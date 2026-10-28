"""Exercise archive retention with disposable source fixtures."""
import importlib.util
from pathlib import Path
from stat import S_IFREG
import tempfile
import unittest
from unittest.mock import patch
from zipfile import ZipFile


spec = importlib.util.spec_from_file_location(
    "package_netlify", Path(__file__).resolve().parents[1] / "scripts/package-netlify.py"
)
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)


class RetentionTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="netlify-retention-")
        self.root = Path(self.directory.name).resolve()
        self.patches = [patch.object(packager, "ROOT", self.root),
                        patch.object(packager, "SOURCE_FILES", ("index.html",)),
                        patch.object(packager, "SOURCE_DIRS", ())]
        for item in self.patches:
            item.start()
        self.addCleanup(self.directory.cleanup)
        for item in self.patches:
            self.addCleanup(item.stop)

    def build(self, text):
        (self.root / "index.html").write_text(text, encoding="utf-8")
        packager.package_source()

    def payload(self, name):
        with ZipFile(self.root / name) as archive:
            return archive.read("index.html").decode("utf-8")

    def test_retains_two_distinct_versions_and_prunes_only_deploy_archives(self):
        self.build("A")
        self.build("B")
        self.build("B")
        self.assertEqual(self.payload(packager.PREVIOUS_NAME), "A")
        (self.root / "mission-alive-netlify-old.zip").write_bytes(b"obsolete")
        (self.root / "other-project.zip").write_bytes(b"unrelated")
        self.build("C")
        self.assertEqual(self.payload(packager.CURRENT_NAME), "C")
        self.assertEqual(self.payload(packager.PREVIOUS_NAME), "B")
        self.assertEqual(sorted(p.name for p in self.root.glob("mission-alive-netlify*.zip")),
                         sorted([packager.CURRENT_NAME, packager.PREVIOUS_NAME]))
        self.assertTrue((self.root / "other-project.zip").exists())
        with ZipFile(self.root / packager.CURRENT_NAME) as archive:
            self.assertEqual(archive.getinfo("index.html").external_attr >> 16, S_IFREG | 0o644)

    def test_incomplete_source_leaves_existing_archives_untouched(self):
        self.build("A")
        self.build("B")
        before = {p.name: p.read_bytes() for p in self.root.glob("*.zip")}
        (self.root / "index.html").unlink()
        with self.assertRaises(FileNotFoundError):
            packager.package_source()
        self.assertEqual(before, {p.name: p.read_bytes() for p in self.root.glob("*.zip")})
        self.assertFalse(list(self.root.glob(".netlify-*")))

    def test_failed_current_replacement_restores_previous(self):
        self.build("A")
        self.build("B")
        (self.root / "index.html").write_text("C", encoding="utf-8")
        original_replace = Path.replace

        def fail_current(path, target):
            if path.suffix == ".pending":
                raise PermissionError("Simulated locked current ZIP")
            return original_replace(path, target)

        with patch.object(Path, "replace", fail_current), self.assertRaises(PermissionError):
            packager.package_source()
        self.assertEqual(self.payload(packager.CURRENT_NAME), "B")
        self.assertEqual(self.payload(packager.PREVIOUS_NAME), "A")
        self.assertFalse(list(self.root.glob(".netlify-*")))

    def test_rejects_paths_outside_project(self):
        with self.assertRaises(ValueError):
            packager.checked_path(self.root.parent / "mission-alive-netlify-old.zip")


if __name__ == "__main__":
    unittest.main()

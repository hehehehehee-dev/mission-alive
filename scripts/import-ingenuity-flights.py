"""Rebuild the local flight log from NASA's final published table.

Requires pdfplumber. Run from the project directory; the source PDF stays in tmp.
NASA's numeric SI columns are copied as published, without deriving distances
from ground tracks or replacing final results with planned-flight estimates.
"""

from datetime import datetime, timezone
from hashlib import sha256
from pathlib import Path
import json
import re
import urllib.request

import pdfplumber


SOURCE_URL = (
    "https://science.nasa.gov/wp-content/uploads/2024/06/"
    "ingenuity-helicopter-flight-log.pdf"
)
ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "tmp/pdfs/ingenuity-helicopter-flight-log.pdf"
OUTPUT_PATH = ROOT / "src/data/ingenuity-flights.json"
MONTHS = {
    "Jan.": 1, "Feb.": 2, "March": 3, "April": 4, "May": 5,
    "June": 6, "July": 7, "Aug.": 8, "Sept.": 9, "Oct.": 10,
    "Nov.": 11, "Dec.": 12,
}


def flight_date(value):
    month, day, year = re.sub(r"\s+", " ", value).split()
    return f"{int(year):04d}-{MONTHS[month]:02d}-{int(day.rstrip(',')):02d}"


def main():
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)
    PDF_PATH.write_bytes(urllib.request.urlopen(SOURCE_URL, timeout=30).read())
    rows = []
    with pdfplumber.open(PDF_PATH) as document:
        for page in document.pages:
            for table in page.extract_tables():
                for row in table:
                    if len(row) < 10 or not row[0] or not row[0].isdigit():
                        continue
                    rows.append({
                        "flight": int(row[0]),
                        "date": flight_date(row[2]),
                        "sol": int(row[1].split()[0]),
                        "duration_s": float(row[9]),
                        "max_altitude_m": float(row[5]),
                        "distance_m": float(row[3]),
                        "max_groundspeed_mps": float(row[7]),
                    })
    assert [row["flight"] for row in rows] == list(range(1, 73))
    assert rows[60] == {
        "flight": 61, "date": "2023-10-05", "sol": 933,
        "duration_s": 129.5, "max_altitude_m": 24.0, "distance_m": 0.0,
        "max_groundspeed_mps": 0.0,
    }
    data = {
        "source": {
            "title": "NASA Ingenuity flight log",
            "url": SOURCE_URL,
            "published": "2024-06-21",
            "retrieved_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "pdf_sha256": sha256(PDF_PATH.read_bytes()).hexdigest(),
            "note": (
                "All 72 rows extracted from NASA's final published PDF table; "
                "SI values and Pacific-time flight dates are retained as published. "
                "Distances are the table's horizontal distance, not recomputed "
                "navigation ground-track lengths. Flight 61 is a pop-up flight: "
                "0 m horizontal distance, 24 m max altitude, 129.5 s duration. "
                "Do not substitute the preview's planned 129.69 s."
            ),
            "spot_checks": [
                {"flight": 1, "date": "2021-04-19", "duration_s": 39.1, "max_altitude_m": 3},
                {"flight": 25, "date": "2022-04-08", "duration_s": 161.3, "distance_m": 704},
                {"flight": 61, "date": "2023-10-05", "sol": 933, "duration_s": 129.5, "max_altitude_m": 24, "distance_m": 0},
                {"flight": 72, "date": "2024-01-18", "duration_s": 32, "max_altitude_m": 12},
            ],
        },
        "flights": rows,
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(rows)} flights into {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

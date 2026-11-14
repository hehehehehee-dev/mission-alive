// CylinderGeometry's normal is +Y. Apply its X turn before the in-plane Z
// turn, so each hexagon faces +Z rather than tilting its face sideways.
export function orientWebbMirror(mesh) {
  mesh.rotation.order = 'ZYX';
  mesh.rotation.set(Math.PI / 2, 0, Math.PI / 6);
  return mesh;
}

export function webbWingAngle(side, progress = 0) {
  return Math.sign(side) * (1 - Math.max(0, Math.min(1, progress))) * Math.PI * .72;
}

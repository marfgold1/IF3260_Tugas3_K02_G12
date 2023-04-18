import TRI from "../lib/TRI/TRI.js";

const mat = new TRI.PhongMaterial();
const geom = new TRI.BufferGeometry();
const mesh = new TRI.Mesh(geom, mat);

export default {
    mesh,
    geometry: geom,
};

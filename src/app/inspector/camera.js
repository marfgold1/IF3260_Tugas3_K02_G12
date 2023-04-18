import { InspectorSection, state } from "../../lib/Inspector.js";

const cameraInspector = new InspectorSection("camera", "Camera", {
    mode: state.select("Mode", "perspective", {
        perspective: "Perspective",
        orthographic: "Orthographic",
        oblique: "Oblique",
    }, (v) => {
        app.camera = app.cameras[v].cam;
        const z = app.camera.position.z;
        const dist = cameraInspector.state.distance;
        if (v === "perspective") {
            app.camera.position.z = 700 - (dist-1)/4 * 300;
        } else {
            app.camera.zoom = dist;
        }
        app.camera.updateProjectionMatrix();
    }),
    distance: state.range(1, (v) => {
        if (cameraInspector.state.mode === "perspective") {
            app.camera.position.z = 700 - (v-1)/4 * 300;
        } else {
            app.camera.zoom = v;
        }
        app.camera.updateProjectionMatrix();
    }, { min: 1, max: 5, step: 0.1 }),
})

export default {
    camera: cameraInspector,
}
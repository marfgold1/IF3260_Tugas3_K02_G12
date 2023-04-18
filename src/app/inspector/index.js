import cameraInspectors from "./camera.js";
import appInspectors from "./app.js";
import modelInspectors from "./model.js";
import materialInspectors from "./material.js";

export default {
    ...modelInspectors,
    ...cameraInspectors,
    ...appInspectors,
    ...materialInspectors,
}

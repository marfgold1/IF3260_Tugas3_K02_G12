import cameraInspectors from "./camera.js";
import appInspectors from "./app.js";
import modelInspectors from "./model.js";
import materialInspectors from "./material.js";
import componentController from "./componentController.js";

export default {
    ...componentController,
    ...modelInspectors,
    ...cameraInspectors,
    ...appInspectors,
    ...materialInspectors,
}

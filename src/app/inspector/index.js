import cameraInspectors from "./camera.js";
import appInspectors from "./app.js";
import modelInspectors from "./model.js";
import componentController from "./componentController.js";

export default {
    ...componentController,
    ...modelInspectors,
    ...cameraInspectors,
    ...appInspectors,
}

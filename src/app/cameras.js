const cameraOrtho = (canvas) => {
    const cam = new TRI.OrthographicCamera(
        -canvas.clientWidth/2,
        canvas.clientWidth/2,
        canvas.clientHeight/2,
        -canvas.clientHeight/2,
        -1000,
        1000
    )
    return {
        cam,
        resizer: (ev) => {
            cam.left = -canvas.clientWidth/2;
            cam.right = canvas.clientWidth/2;
            cam.top = canvas.clientHeight/2;
            cam.bottom = -canvas.clientHeight/2;
            cam.updateProjectionMatrix();
        }
    }
};
const cameraPers = (canvas) => {
    const cam = new TRI.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.01,
        9999
    )
    cam.position.z = 700;
    return {
        cam,
        resizer: (ev) => {
            cam.aspect = canvas.clientWidth / canvas.clientHeight;
            cam.updateProjectionMatrix();
        }
    }
};
const cameraOblique = (canvas) => {
    const cam = new TRI.ObliqueCamera(
        -canvas.clientWidth/2,
        canvas.clientWidth/2,
        canvas.clientHeight/2,
        -canvas.clientHeight/2,
        -1000,
        1000
    )
    return {
        cam,
        resizer: (ev) => {
            cam.left = -canvas.clientWidth/2;
            cam.right = canvas.clientWidth/2;
            cam.top = canvas.clientHeight/2;
            cam.bottom = -canvas.clientHeight/2;
            cam.updateProjectionMatrix();
        }
    }
};

export const cameraCreator = {
    orthographic: cameraOrtho,
    perspective: cameraPers,
    oblique: cameraOblique,
}

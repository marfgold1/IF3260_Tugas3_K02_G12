import { Matrix, Quaternion, Vector3, DEG2RAD } from './index.js';

export class M4 extends Matrix {

    constructor(data) {
        if (data.length !== 16) throw new Error("Matrix4 must have 16 elements");
        super(data, 4, 4);
    }

    static inv(m) {
        const [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33] = m.data;

        const s = 1/M4.determinant(m);
        return new M4([
            (m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33)*s,
            (m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33)*s,
            (m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33)*s,
            (m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23)*s,
            (m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33)*s,
            (m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33)*s,
            (m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33)*s,
            (m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23)*s,
            (m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33)*s,
            (m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33)*s,
            (m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33)*s,
            (m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23)*s,
            (m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32)*s,
            (m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32)*s,
            (m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32)*s,
            (m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22)*s,
        ]);
    }

    static identity() {
        return new M4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Compose a matrix from position, quaternion and scale.
     * 
     * @param {Vector3|Array} position Position for translation matrix.
     * @param {Quaternion|Array} quaternion Quaternion for rotation matrix.
     * @param {Vector3|Array} scale Scale for scale matrix.
     * @returns {Matrix}
     */
    static compose(position, quaternion, scale) {
        if (!Array.isArray(position)) position = position.toArray();
        if (Array.isArray(quaternion)) quaternion = new Quaternion(...quaternion);
        if (!Array.isArray(scale)) scale = scale.toArray();
        const [px,py,pz] = position;
        const [sx,sy,sz] = scale;

        return M4.premul(
            M4.translation3d(px, py, pz),
            quaternion.toMatrix(),
            M4.scale3d(sx, sy, sz),
        );
    }

    /**
     * Compose a matrix from position, rotation and scale.
     * 
     * @param {Vector3|Array} position Position for translation matrix.
     * @param {Vector3|Array} rotation Rotation for rotation matrix.
     * @param {Vector3|Array} scale Scale for scale matrix.
     * @returns {Matrix}
     */
    static transform(position, rotation, scale) {
        if (!Array.isArray(position)) position = position.toArray();
        if (!Array.isArray(rotation)) rotation = rotation.toArray();
        if (!Array.isArray(scale)) scale = scale.toArray();
        return M4.premul(
            M4.translation3d(...position),
            M4.rotation3d(...rotation),
            M4.scale3d(...scale),
        );
    }

    /**
     * Transform eye to look into target.
     * @param {Vector3} eye 
     * @param {Vector3} target 
     * @param {Vector3} up 
     * @returns 
     */
    static lookAt(eye, target, up) {
        const z = _v1.setVector(eye).sub(target).normalize();
        const x = _v2.setVector(up).cross(z).normalize();
        const y = _v3.setVector(z).cross(x).normalize();
        return new M4([
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            eye.x, eye.y, eye.z, 1
        ]);
    }

    /**
     * Get rotation from matrix.
     *
     * @param {M4} m Matrix to find its rotation.
     * @param {Vector3} v Vector to store the rotation.
     * @return {Vector3} Rotation in euler XYZ radians of the matrix.
     * @memberof M4
     */
    static getRotation(m, v=null) {
        if (v === null) v = new Vector3();
        const [
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ] = m.data;
        const y = -Math.asin(Math.max(-1, Math.min(1, m13)));
        if (Math.abs(m13) < 0.999999) {
            return v.set(
                Math.atan2(m23, m33),
                y,
                Math.atan2(m12, m11),
            );
        } else {
            return v.set(
                Math.atan2(-m32, m22),
                y,
                0,
            );
        }
    }

    /**
     * Get translation from matrix.
     * 
     * @param {Matrix} m Matrix to find its scale.
     * @param {Vector3} v Vector to store the scale.
     * @returns {Vector3} Translation of the matrix.
     */
    static getTranslation(m, v=null) {
        if (v === null) v = new Vector3();
        return v.set(...m.data.slice(12, 15));
    }

    static translation3d(dx, dy, dz) {
        return new M4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            dx, dy, dz, 1,
        ]);
    }

    static rotationX(angle) {
        angle = angle * DEG2RAD;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new M4([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ]);
    }

    static rotationY(angle) {
        angle = angle * DEG2RAD;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new M4([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ]);
    }

    static rotationZ(angle) {
        angle = angle * DEG2RAD;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new M4([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    static rotation3d(yaw, pitch, roll) {
        // // rotation in euler angles
        // return this.rotationY(pitch).mul(
        //     this.rotationX(yaw).mul(
        //         this.rotationZ(roll)
        //     )
        // );
        yaw = yaw * DEG2RAD;
        pitch = pitch * DEG2RAD;
        roll = roll * DEG2RAD;
        const c = [Math.cos(yaw), Math.cos(pitch), Math.cos(roll)];
        const s = [Math.sin(yaw), Math.sin(pitch), Math.sin(roll)];

        return new M4([
                           c[1]*c[2],                c[1]*s[2],     -s[1], 0,
            s[0]*s[1]*c[2]-c[0]*s[2], s[0]*s[1]*s[2]+c[0]*c[2], s[0]*c[1], 0,
            c[0]*s[1]*c[2]+s[0]*s[2], c[0]*s[1]*s[2]-s[0]*c[2], c[0]*c[1], 0,
                                   0,                        0,         0, 1,
        ]);
    }

    static scale3d(sx, sy, sz) {
        return new M4([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ]);
    }

    static ortographic(left, right, bottom, top, near, far) {
        const a = 1 / (right - left);
        const b = 1 / (top - bottom);
        const c = 1 / (near - far);
        return new M4([
                          2 * a,                   0,                0, 0,
                              0,               2 * b,                0, 0,
                              0,                   0,            2 * c, 0,
            (left + right) * -a, (bottom + top) * -b, (near + far) * c, 1,
        ]);
    }

    static oblique(left, right, bottom, top, near, far, angle, scale=0.5) {
        angle *= DEG2RAD;
        return M4.premul(
            M4.ortographic(left, right, bottom, top, near, far),
            new M4([
                1, 0, 0, 0,
                0, 1, 0, 0,
                -scale * Math.cos(angle), scale * Math.sin(angle), 1, 0,
                0, 0, 0, 1,
            ]),
        );
    }

    static perspective(fov, aspect, near, far) {
        const f = Math.tan(0.5*Math.PI*(1-fov/180));
        const nf = 1 / (near - far);

        return new M4([
            f / aspect, 0,                   0,  0,
                     0, f,                   0,  0,
                     0, 0,   (far + near) * nf, -1,
                     0, 0, 2 * far * near * nf,  0,
        ]);
    }

    /**
     * Find determinant of matrix M4.
     * @param {M4} m Matrix to find determinant of.
     * @return {Number} Determinant of matrix.
     */
    static determinant(m) {
        const [
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33,
        ] = m.data;
        return (
            m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30+
            m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31+
            m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31+
            m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32+
            m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33+
            m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33
        );
    }

    /**
     * Decompose matrix to translation, rotation and scale.
     * @param {M4} m Matrix to decompose
     * @param {Vector3} translation Vector to store the translation.
     * @param {Quaternion} quaternion Quaternion to store the rotation.
     * @param {Vector3} scale Vector to store the scale.
     * @return {{translation: Vector3, quaternion: Quaternion, scale: Vector3}} Object with translation, quaternion and scale.
     */
    static decompose(m, translation=null, quaternion=null, scale=null) {
        if (translation === null) translation = new Vector3();
        if (quaternion === null) quaternion = new Quaternion();
        if (scale === null) scale = new Vector3();
        this.getTranslation(m, translation);
        const s = [
            _v1.set(...m.data.slice(0, 3)).length,
            _v1.set(...m.data.slice(4, 7)).length,
            _v1.set(...m.data.slice(8, 11)).length,
        ];
        if (M4.determinant(m) < 0) s[0] = -1 * s[0];
        _m1.clone(m);
        const invS = s.map(x => 1 / x);
        _m1.data[0] *= invS[0]; _m1.data[1] *= invS[0]; _m1.data[2] *= invS[0];
        _m1.data[4] *= invS[1]; _m1.data[5] *= invS[1]; _m1.data[6] *= invS[1];
        _m1.data[8] *= invS[2]; _m1.data[9] *= invS[2]; _m1.data[10] *= invS[2];
    
        quaternion.copy(Quaternion.fromMatrix(m));
        scale.set(...s);
        return {translation, quaternion, scale};
    }
}

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _m1 = M4.identity();

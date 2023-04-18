const identity_cache = {
    "4x4": [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ],
}

export class Matrix {
    #data
    #rowLength
    #colLength

    constructor(data=[], rowLength=0, colLength=0) {
        this.#data = data;
        this.#rowLength = rowLength;
        this.#colLength = colLength;
    }

    get size() {
        return this.#data.length;
    }

    get row() {
        return rowLength;
    }

    get column() {
        return colLength;
    }

    get data() {
        return this.#data;
    }

    /**
     * Get the element at (i, j).
     *
     * @param {number} i
     * @param {number} j
     * @return {number} 
     * @memberof Matrix
     */
    get(i, j) {
        if (i < 0 || i >= this.#rowLength || j < 0 || j >= this.#colLength)
            throw new Error("Index out of range.");
        return this.#data[i * this.#colLength + j];
    }

    /**
     * Multiply another matrix with this matrix.
     * NOTE: It will calculate "M2 x this".
     *
     * @param {Matrix} m2 Another matrix to multiply with.
     * @return {Matrix} New matrix instance with the result.
     * @memberof Matrix
     */
    premul(m2) {
        if (m2.#colLength !== this.#rowLength)
            throw new Error("Matrix size mismatch.");
            
        let result = [];
        for (let i = 0; i < m2.#rowLength; i++) {
            for (let j = 0; j < this.#colLength; j++) {
                let sum = 0;
                for (let k = 0; k < m2.#colLength; k++) {
                    sum += m2.get(i, k) * this.get(k, j);
                }
                result.push(sum);
            }
        }
        return new Matrix(result, m2.#rowLength, this.#colLength);
    }

    /**
     * Multiply this matrix with another matrix.
     * NOTE: It will calculate "this x M2".
     * 
     * @param {Matrix} m2 Another matrix to multiply with.
     * @return {Matrix} New matrix instance with the result.
     * @memberof Matrix
     */
    mul(m2) {
        return m2.premul(this);
    }

    transpose() {
        const result = [];
        for (let i = 0; i < this.#rowLength; i++) {
            for (let j = 0; j < this.#colLength; j++) {
                result.push(this.get(j, i));
            }
        }
        return new Matrix(result, this.#colLength, this.#rowLength);
    }

    toString() {
        let data = "";
        for (let i = 0; i < this.#rowLength; i++) {
            let row = [];
            for (let j = 0; j < this.#colLength; j++) {
                row.push(this.get(i, j));
            }
            data += row.join(", ") + "\n";
        }
        return data;
    }

    toArray() {
        return this.#data;
    }

    clone() {
        return new Matrix(this.#data.slice(), this.#rowLength, this.#colLength);
    }

    static premul(...matrices) {
        const len = matrices.length;
        let result = matrices[len-1];
        for (let i = len-2; i >= 0; i--) {
            result = matrices[i].premul(result);
        }
        return result;
    }

    static mul(...matrices) {
        return Matrix.premul(...matrices.reverse());
    }

    static identity(rowLength=0, colLength=0) {
        const size = `${rowLength}x${colLength}`;
        if (identity_cache[size]) {
            return new Matrix(identity_cache[size], rowLength, colLength);
        }
        let data = [];
        for (let i = 0; i < rowLength; i++) {
            for (let j = 0; j < colLength; j++) {
                data.push(i === j ? 1 : 0);
            }
        }
        identity_cache[size] = data;
        return new Matrix(data, rowLength, colLength);
    }
}
import Vec3 from "./Vec3";
import Vec2 from "./Vec2";
import Precision from "./Precision";

var toFixed = function(v) {
    return Math.floor(v * 1000000) / 1000000;
};

export default class Matrix3x3 {

    /**
     * A row-major 3x3 Matrix class for doing 2D graphics with homogeneous coordinates
     * @param m00
     * @param m01
     * @param m02
     * @param m10
     * @param m11
     * @param m12
     * @param m20
     * @param m21
     * @param m22
     */
    constructor(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        this.elements = new Array(9);
        var elements = m00;
        if (!Array.isArray(elements)) {
            elements = Array.prototype.slice.call(arguments);
        }
        // initialize the elements with default values.
        this.setIdentity();
        if (elements.length > 0) {
            this.set(elements);
        }
    }

    /**
     * Duplicate a matrix
     * @returns {Matrix3x3}
     */
    dup(){
        return new Matrix3x3(...this.elements);
    }

    /**
     * Set a matrix to the identity
     */
    setIdentity(){
        this.elements = [1,0,0,
            0,1,0,
            0,0,1];
    }

    //##################//--Set Elements (row major) and check if two matrices are equal--\\##################
    //<editor-fold desc="Set Elements row major">
    /**
     * Set the elements of the matrix
     * @param m00
     * @param m01
     * @param m02
     * @param m10
     * @param m11
     * @param m12
     * @param m20
     * @param m21
     * @param m22
     */
    set(m00, m01, m02, m10, m11, m12, m20, m21, m22){
        if (typeof m01 === 'undefined') {
            if(m00.elements===undefined) {
                this.elements = m00.slice();
                return;
            }else{
                this.elements = m00.elements.slice();
                return;
            }

        }
        this.m00 = m00;
        this.m01 = m01;
        this.m02 = m02;
        this.m10 = m10;
        this.m11 = m11;
        this.m12 = m12;
        this.m20 = m20;
        this.m21 = m21;
        this.m22 = m22;
        return;
    }
    //</editor-fold>

    //<editor-fold desc="">
    equalTo(M, tolerance){
        if(!M || !M.elements || (M.elements.length!==this.elements.length)){
            return false;
        }
        const epsilon = (tolerance!==undefined)? tolerance : Precision.tinyValue;
        for(let i=0;i<this.elements.length;i++){
            if (Math.abs(this.elements[i] - M[i]) > epsilon){
                return false;
            }
        }
        return true;
    }
    //</editor-fold>
    //##################\\--Set Elements row major--//##################


    //##################//--Getters and setters for individual elements (in case you don't remember how they are stored)--\\##################
    //<editor-fold desc="Getters and setters for individual elements (in case you don't remember how they are stored)">
    set m00(value){this.elements[0]=value;}
    get m00(){return this.elements[0];}
    set m01(value){this.elements[1]=value;}
    get m01(){return this.elements[1];}
    set m02(value){this.elements[2]=value;}
    get m02(){return this.elements[2];}
    set m10(value){this.elements[3]=value;}
    get m10(){return this.elements[3];}
    set m11(value){this.elements[4]=value;}
    get m11(){return this.elements[4];}
    set m12(value){this.elements[5]=value;}
    get m12(){return this.elements[5];}
    set m20(value){this.elements[6]=value;}
    get m20(){return this.elements[6];}
    set m21(value){this.elements[7]=value;}
    get m21(){return this.elements[7];}
    set m22(value){this.elements[8]=value;}
    get m22(){return this.elements[8];}
    //</editor-fold>
    //##################\\--Getters and setters for individual elements (in case you don't remember how they are stored)--//##################

    //##################//--Getters and setters for rows and columns--\\##################
    //<editor-fold desc="Getters and setters for rows and columns">
    /** Get set columns */
    set c0(value) {
        if (value.nDimensions === 3) {
            this.m00 = value.x;
            this.m10 = value.y;
            this.m20 = value.z;
        } else {
            this.m00 = value[0];
            this.m10 = value[1];
            this.m20 = value[2];
        }
    }
    get c0(){return new Vec3(this.m00,this.m10,this.m20);}
    set c1(value) {
        if (value.nDimensions === 3) {
            this.m01 = value.x;
            this.m11 = value.y;
            this.m21 = value.z;
        } else {
            this.m01 = value[0];
            this.m11 = value[1];
            this.m21 = value[2];
        }
    }
    get c1(){return new Vec3(this.m01,this.m11,this.m21);}
    set c2(value) {
        if (value.nDimensions === 3) {
            this.m02 = value.x;
            this.m12 = value.y;
            this.m22 = value.z;
        } else {
            this.m02 = value[0];
            this.m12 = value[1];
            this.m22 = value[2];
        }
    }
    get c2(){return new Vec3(this.m02,this.m12,this.m22);}

    /** Get set r0 */
    set r0(value){
        if (value.nDimensions === 3) {
            this.m00 = value.x;
            this.m01 = value.y;
            this.m02 = value.z;
        } else {
            this.m00 = value[0];
            this.m01 = value[1];
            this.m02 = value[2];
        }
    }
    get r0(){return Vec3(this.m00, this.m01, this.m02);}
    set r1(value){
        if (value.nDimensions === 3) {
            this.m10 = value.x;
            this.m11 = value.y;
            this.m12 = value.z;
        } else {
            this.m10 = value[0];
            this.m11 = value[1];
            this.m12 = value[2];
        }
    }
    get r1(){return Vec3(this.m10, this.m11, this.m12);}

    set r2(value){
        if (value.nDimensions === 3) {
            this.m20 = value.x;
            this.m21 = value.y;
            this.m22 = value.z;
        } else {
            this.m20 = value[0];
            this.m21 = value[1];
            this.m22 = value[2];
        }
    }
    get r2(){return Vec3(this.m20, this.m21, this.m22);}
    //</editor-fold>
    //##################\\--Getters and setters for rows and columns--//##################



    //##################//--Static methods--\\##################
    //<editor-fold desc="Static methods">
    static Identity(){
        return new Matrix3x3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }

    static Scale(sx,sy){
        const s = Matrix3x3.Identity();
        if(sx.nDimensions){
            s.m00=sx.x;
            s.m11=sx.y;
            // s.m22=sx.z;
        }else if(sx.length){
            s.m00=sx[0];
            s.m11=sx[1];
            // s.m22=sx[2];
        }else if(sy==undefined){
            s.m00 = sx;
            s.m11 = sx;
        }else{
            s.m00 = sx;
            s.m11 = sy;
            // s.m22 = sz;
        }
        return s;
    }

    static Translation(x,y){
        const t = Matrix3x3.Identity();
        t.setPositionTranslation(x,y);
        return t;
    }

    static Rotation(radians){
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        return new Matrix3x3(c, -s, 0, s, c, 0, 0, 0, 1)
        // return Matrix3x3.Identity().getRotated(radians);
    }

    static Random(range=1, mean=0){
        var m=[];
        for(let i=0;i<9;i++){
            m.push(mean+(Math.random()-0.5)*range);
        }
        return new Matrix3x3(m);
    }

    static Multiply(leftMat,rightMat,C){
        const A = leftMat.elements ? leftMat.elements : leftMat;
        const B = rightMat.elements ? rightMat.elements : rightMat;
        if(B.length == 3){ // Multiply Vector
            return new Vec3(
                B[0]*A[0]+B[1]*A[1]+B[2]*A[2],
                B[0]*A[3]+B[1]*A[4]+B[2]*A[5],
                B[0]*A[6]+B[1]*A[7]+B[2]*A[8]
            );
        }
        if(B.length == 2){ // Multiply Vector
            // In the case where it's a 2D vector we will treat it as a point with
            // homogeneous coordinate 1
            const v3 = new Vec3(
                B[0]*A[0]+B[1]*A[1]+A[2],
                B[0]*A[3]+B[1]*A[4]+A[5],
                B[0]*A[6]+B[1]*A[7]+A[8]
            );
            if(rightMat.elements){
                return rightMat.constructor(v3.elements);
            }
            else{
                return new Vec2(v3.elements);
            }
        }

        C = C || new Array(9);

        C[0] = A[0] * B[0] + A[1] * B[3] + A[2] * B[6];
        C[1] = A[0] * B[1] + A[1] * B[4] + A[2] * B[7];
        C[2] = A[0] * B[2] + A[1] * B[5] + A[2] * B[8];
        C[3] = A[3] * B[0] + A[4] * B[3] + A[5] * B[6];
        C[4] = A[3] * B[1] + A[4] * B[4] + A[5] * B[7];
        C[5] = A[3] * B[2] + A[4] * B[5] + A[5] * B[8];
        C[6] = A[6] * B[0] + A[7] * B[3] + A[8] * B[6];
        C[7] = A[6] * B[1] + A[7] * B[4] + A[8] * B[7];
        C[8] = A[6] * B[2] + A[7] * B[5] + A[8] * B[8];

        return new Matrix3x3(C);
    }

    /**
     * Given an object with the keys 'position', 'rotation', 'anchorshift', and 'scale', compute
     * the corresponding matrix
     * @param args
     * @returns {*}
     * @constructor
     */
     static FromProperties(args){
         const margs = args;
         const o= Matrix3x3.Translation(margs.position);
         const r = Matrix3x3.Rotation(margs.rotation);
         const s = Matrix3x3.Scale(margs.scale);
         const t= Matrix3x3.Translation(margs.anchorshift);
         return o.times(r).times(s).times(t);
     }
    //</editor-fold>
    //##################\\--Static methods--//##################


    //##################//--Arithmetic--\\##################
    //<editor-fold desc="Arithmetic">
    times(B){
        return Matrix3x3.Multiply(this,B);
    }

    plus(matB){
        const B = matB.elements ? matB.elements : matB;
        const rels = [];
        for(let i=0;i<this.elements.length;i++){
            rels.push(this.elements[i]+B[i]);
        }
        return new Matrix3x3(rels);
    }
    //</editor-fold>
    //##################\\--Arithmetic--//##################

    //##################//--Origin (Translation)--\\##################
    //<editor-fold desc="Origin (Translation)">
    setPositionTranslation(x, y){
        if(x.nDimensions) {
            this.m02=x.x;
            this.m12=x.y;
        }else{
            if(x.length){
                this.m02=x[0];
                this.m12=x[1];
            }else{
                this.m02=x;
                this.m12=y;
            }
        }
    }
    getPositionTranslation(){return new Vec2(this.m02, this.m12);}
    //</editor-fold>
    //##################\\--Origin (Translation)--//##################


    /**
     * @name Taken from Two.js, Two.Matrix#toString
     * @function
     * @param {Boolean} [fullMatrix=false] - Return the full 9 elements of the matrix or just 6 for 2D transformations.
     * @returns {String} - The transformation matrix as a 6 component string separated by spaces.
     * @description Create a transform string. Used for the Two.js rendering APIs.
     */
    toString() {
        // array.length = 0;
        return this.elements.map(toFixed).join(' ');
    }

    getDeterminant() {
        var b01 = this.m22 * this.m11 - this.m12 * this.m21;
        var b11 = -this.m22 * this.m10 + this.m12 * this.m20;
        var b21 = this.m21 * this.m10 - this.m11 * this.m20;
        return this.m00 * b01 + this.m01 * b11 + this.m02 * b21;
    }


    /**
     * Calculate inverse... I just used Two.js's method here.
     * @returns {null|Matrix3x3}
     */
    getInverse() {
        var a = this.elements;
        var out = new Matrix3x3();

        var a00 = a[0], a01 = a[1], a02 = a[2];
        var a10 = a[3], a11 = a[4], a12 = a[5];
        var a20 = a[6], a21 = a[7], a22 = a[8];

        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;

        // Calculate the determinant
        var det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            console.warn("Matrix had determinant 0!");
            return null;
        }

        det = 1.0 / det;

        out.elements[0] = b01 * det;
        out.elements[1] = (-a22 * a01 + a02 * a21) * det;
        out.elements[2] = (a12 * a01 - a02 * a11) * det;
        out.elements[3] = b11 * det;
        out.elements[4] = (a22 * a00 - a02 * a20) * det;
        out.elements[5] = (-a12 * a00 + a02 * a10) * det;
        out.elements[6] = b21 * det;
        out.elements[7] = (-a21 * a00 + a01 * a20) * det;
        out.elements[8] = (a11 * a00 - a01 * a10) * det;
        return out;
    }

    /**
     * Apply the matrix to a list of points.
     * @param pointList
     * @returns {*}
     */
    applyToPoints(pointList){
        const self=this;
        return pointList.map(v=> {
            return Matrix3x3.Multiply(self, v.getAsPoint2D());
        });
    }
}


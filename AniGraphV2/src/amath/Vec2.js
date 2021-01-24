/*
 * Copyright (c) 2020. Abe Davis
 */

import Vector from "./Vector";
import Vec3 from "./Vec3";

export default class Vec2 extends Vector{

    /**
     * Returns [bmin, bmax], where bmin is an array of the minimum value in each dimension of the provided points,
     * and bmax is an array of the maximum values.
     * @param pointList
     * @param ndimensions - If provided, will ensure that every point has the provided number of dimensions.
     * If ndimensions is not provided, all points must simply have the same number of dimensions.
     * @returns {[boundsMin, boundsMax]}
     * @constructor
     */
    static GetPointBounds(pointList, ndimensions){
        if(ndimensions!==undefined){console.assert(pointList[0].elements.length===ndimensions, "points have wrong number of dimensions!");}
        const bmin = pointList[0].dup();
        const bmax = pointList[0].dup();
        pointList.map(v=>{
            var n = v.elements.length;
            console.assert(n===bmin.elements.length, "Points in list have inconsistent numbers of dimensions");
            for (let i = 0; i < n; i++){
                if(v.elements[i]<bmin.elements[i]){
                    bmin.elements[i]=v.elements[i];
                }
                if(v.elements[i]>bmax.elements[i]){
                    bmax.elements[i]=v.elements[i];
                }
            }
        })
        return [bmin, bmax];
    }

    constructor(x,y) {
        if(x===undefined){
            super([0,0]);
        }else if(Array.isArray(x)){
            console.assert(y===undefined, {inputs: [x,y], errorMsg: "problem with Vec2 inputs"});
            console.assert(x.length<4, {inputs: [x,y], errorMsg: "problem with Vec2 inputs"});
            // If it's a 3 vector then homogenize
            if(x.length==3){
                if(x[2]!=0){
                    super([x[0]/x[2],x[1]/x[2]]);
                }
            }else{
                super(x);
            }
        }else if(x.elements!==undefined) {
            super(x.elements);
        }else{
            super([x,y]);
        }
        if(typeof x == 'number' && y===undefined){
            super([x,x]);
        }
        // console.assert(elements.length===2, "Cannot create Vec2 with length "+elements.length);
    }

    plus(...args){
        const v2 = new Vec2(...args);
        return new Vec2(this.x+v2.x, this.y+v2.y);
    }
    minus(...args){
        const v2 = new Vec2(...args);
        return new Vec2(this.x-v2.x, this.y-v2.y);
    }

    toString(){
        return `Vec2(${this.x},${this.y})`;
    }

    getAsPoint2D(){
        return new Point2D(this.x, this.y);
    }
    getHomogeneousVector2D(){
        return new Vec3(this.x, this.y, 0);
    }

    getHomogeneousPoint2D(){
        return new Point2D(this.x, this.y);
    }

    getNonHomogeneous(){
        throw new Error("Don't de-homogenize Vec2's");
    }


    set x(value){this.elements[0]=value;}
    get x(){return this.elements[0];}
    set y(value){this.elements[1]=value;}
    get y(){return this.elements[1];}

    hcross(v2){
        const det = this.x*v2.y-this.y*v2.x;
        return new Vec2([det*(this.y-v2.y), det*(this.x-v2.x)]);
    }
    sstring(){
        return `[${this.x},${this.y}]`;
    }

    static RandomVecs(n, mean=0, range=1){
        const vscale = new Vec2(range);
        const vmean = new Vec2(mean)
        const rvals = [];
        for(let i=0;i<n;i++){
            rvals.push(new Vec2(vmean.x+(Math.random()-0.5)*vscale.x, vmean.y+(Math.random()-0.5)*vscale.y));
        }
        return rvals;
    }

}

export function P2D(...args){
    const p = new Vec2(...args);
    p.geoType = 'Point2D';
    return p;
}

export function Point2D(x,y){
    return P2D(x,y);
}
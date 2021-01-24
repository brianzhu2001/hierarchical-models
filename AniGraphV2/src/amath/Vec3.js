import Precision from "./Precision";
import Vector from "./Vector";

export default class Vec3 extends Vector{

    constructor(x,y,z){
        if(x===undefined){
            super([0,0,0]);
        }else if(Array.isArray(x)){
            console.assert(y===undefined, {inputs: [x,y,z], errorMsg: "problem with Vec3 inputs"});
            if(x.length===2){
                super([x[0],x[1],1]);
            }else if(x.length===3){
                super(x);
            }else {
                throw Error(`cannot create Vec3 with array ${x} of length ${x.length}`);
            }
        }else if(x.elements!==undefined) {
            if(x.elements.length===2) {
                super([x.elements[0], x.elements[1], 1]);
            }else {
                super(x.elements);
            }
        }else{
            super([x,y,z]);
        }
    }


    plus(...args){
        const v3 = new Vec3(...args);
        return new Vec3(this.x+v3.x, this.y+v3.y, this.z+v3.z);
    }
    minus(...args){
        const v3 = new Vec3(...args);
        return new Vec3(this.x-v3.x, this.y-v3.y, this.z-v3.z);
    }

    toString(){
        return `Vec3(${this.x},${this.y},${this.z})`;
    }

    get x(){
        return this.elements[0];
    }
    get y(){
        return this.elements[1];
    }
    get z(){
        return this.elements[2];
    }
    get i(){
        return this.elements[0];
    }
    get j(){
        return this.elements[1];
    }
    get k(){
        return this.elements[2];
    }

    homogenize(){
        if(this.elements[2]===1 || this.elements[2]===0){
            return;
        }
        this.elements[0]=this.elements[0]/this.elements[2];
        this.elements[1]=this.elements[1]/this.elements[2];
        this.elements[2]=1;
    }

    getHomogenized(){
        const h = this.dup();
        h.homogenize();
        return h;
    }

    getAsPoint2D(){
        const p = this.getHomogenized();
        p.geoType = 'Point2D';
        return p;
    }

    getNonHomogeneous(){
        if(Precision.PEQ(this.z,0) || this.z==1){
            return new Vec2(this.x, this.y);
        }else{
            return new Vec2(this.x/this.z, this.y/this.z);
        }
    }

    sstring(){
        return `[${this.x},${this.y},${this.z}]`;
    }
}

import Precision from "./Precision";

const PRECISION = 1e-6;

export default class Vector{
    constructor(elements){
        this.setElements(elements);
    }

    get nDimensions (){return this.elements.length;}

    L2(){
        return Math.sqrt(this.dot(this));
    }

    equalTo(vector){
        var n = this.elements.length;
        var V = vector.elements || vector;
        if(n !== V.length){
            return false;
        }
        while(n--){
            if (Math.abs(this.elements[n] - V[n]) > PRECISION){
                return false;
            }
        }
        return true;
    }

    dup(){
        return new this.constructor(this.elements);
    }

    getHomogeneousPoint(){
        const rval = this.dup();
        rval.elements.push(1);
        return rval;
    }
    getHomogeneousVector(){
        const rval = this.dup();
        rval.elements.push(0);
        return rval;
    }

    getNonHomogeneous(){
        const rval = this.dup();
        const h = rval.elements.pop();
        if(h==0){
            return rval;
        }else{
            return rval.times(1.0/h);
        }
    }


    getMapped (fn, context){
        var elements = [];
        this.forEach(function(x, i){
            elements.push(fn.call(context, x, i));
        });
        return new this.constructor(elements);
    }

    forEach (fn, context){
        var n = this.elements.length;
        for (let i = 0; i < n; i++){
            fn.call(context, this.elements[i], i+1);
        }
    }

    normalize(){var r=this.L2();
        if(r===0){
            return this;
        }
        var n = this.elements.length;
        var rinv = 1.0/r;
        for (let i = 0; i < n; i++){
            this.elements[i]=this.elements[i]*rinv;
        }
    }

    getNormalized(){
        var r = this.L2();
        if (r === 0){
            return this.dup();
        }
        return this.getMapped(function(x){
            return x/r;
        });
    }

    plus(vector){
        var V = vector.elements || vector;
        if (this.elements.length !== V.length) {
            return null;
        }
        return this.getMapped(function(x, i) { return x + V[i-1]; });
    }

    minus (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length){
            return null;
        }
        return this.getMapped(function(x, i){
            return x - V[i-1];
        });
    }

    addVector (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length)
        {
            return null;
        }
        var n = this.nDimensions;
        for (let i = 0; i < n; i++)
        {
            this.elements[i]=this.elements[i]+vector.elements[i];
        }
        return this;
    }

    subtractVector (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length)
        {
            return null;
        }
        var n = this.nDimensions;
        for (let i = 0; i < n; i++)
        {
            this.elements[i]=this.elements[i]-vector.elements[i];
        }
        return this;
    }

    times(k){
        return this.getMapped(function(x){
            return x*k;
        });
    }

    dot(vector){
        var V = vector.elements || vector;
        var i, product = 0, n = this.elements.length;
        if(n !== V.length){
            return null;
        }
        while(n--){
            product += this.elements[n] * V[n];
        }
        return product;
    }

    cross(vector)
    {
        var B = vector.elements || vector;
        if (this.elements.length !== 3 || B.length !== 3){
            return null;
        }
        var A = this.elements;
        return new this.constructor([
            (A[1] * B[2]) - (A[2] * B[1]),
            (A[2] * B[0]) - (A[0] * B[2]),
            (A[0] * B[1]) - (A[1] * B[0])
        ]);
    }

    max()
    {
        var m = 0, i = this.elements.length;
        while (i--){
            if (Math.abs(this.elements[i]) > Math.abs(m))
            {
                m = this.elements[i];
            }
        }
        return m;
    }

    indexOf(x)
    {
        var index = null, n = this.elements.length;
        for (let i = 0; i < n; i++){
            if (index === null && this.elements[i] === x)
            {
                index = i + 1;
            }
        }
        return index;
    }

    getRounded(){
        return this.getMapped(function(x){
            return Math.round(x);
        });
    }

    snapTo(x){
        return this.getMapped(function(y){
            return (Math.abs(y - x) <= PRECISION) ? x : y;
        });
    }

    distanceFrom(obj){
        if (obj.anchor || (obj.start && obj.end)){
            return obj.distanceFrom(this);
        }
        var V = obj.elements || obj;
        if (V.length !== this.elements.length){
            return null;
        }
        var sum = 0, part;
        this.forEach(function(x, i){
            part = x - V[i-1];
            sum += part * part;
        });
        return Math.sqrt(sum);
    }

    inspect(){
        return '[' + this.elements.join(', ') + ']';
    }

    setElements(els){
        if(els.elements){this.elements = els.elements.slice(); return this;}
        else{
            this.elements = els.slice();
            return this;
        }
    }

    flatten(){
        return this.elements;
    }

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
}





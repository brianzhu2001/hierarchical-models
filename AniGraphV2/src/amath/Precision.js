/***
 * Convenience class for specifying and dealing with some precision issues.
 */
export default class Precision{
    static tinyValue=1e-6;
    static SMALLEST = 2*Number.MIN_VALUE;
    static isTiny(a, epsilon){
        const tinyValue = epsilon ? epsilon : this.tinyValue;
        return Math.abs(a)<=tinyValue;
    }
    static TinyRotation = 0.00001;
    static signedTiny(a, epsilon){
        const tinyValue = epsilon ? epsilon : this.tinyValue;
        if(!Math.abs(a)<tinyValue){
            return a;
        }else{
            return (a>=0)? tinyValue : -tinyValue;
        }
    }

    static signedTiny(a, epsilon){
        return a;
        const tinyValue = epsilon ? epsilon : this.tinyValue;
        if(!this.isTiny(a)){
            return a;
        }else{
            return (a>=0)? tinyValue : -tinyValue;
        }
    }

    static PEQ(a,b){
        return Math.abs(a-b)<this.tinyValue;
    }

    static signedTinyInt(a){
        if(Math.abs(a)<1){
            if(a<0){
                return -1;
            }else{
                return 1;
            }
        }else{
            return a;
        }
    }
}



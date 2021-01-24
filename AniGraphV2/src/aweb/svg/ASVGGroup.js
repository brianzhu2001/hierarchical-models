import ASVGElement from "./ASVGElement";
import Matrix3x3 from "../../amath/Matrix3x3";

export default class ASVGGroup extends ASVGElement{
    constructor(args) {
        super(args);
        this._matrix = Matrix3x3.Identity();
        if(this.getTwoJSObject()!==undefined){
            this.twoJSObject._matrix.manual = true;
        }
    }

    add(elem){
        this.addChild(elem);
        this.getTwoJSObject().add(elem.getTwoJSObject());
        // this.getTwoJSObject().add(...arguments);
    }


    /** Get set matrix */
    set matrix(value){
        this.getTwoJSObject().matrix.set(... value.elements);
        this._matrix = value;
    }
    get matrix(){return this._matrix;}

    // remove(elem){
    //     this.removeChild(elem);
    // }

    removeFromContext(){

    }

    getDOMItem() {
        // return super.getDOMItem();
        const twojsob = this.getTwoJSObject();
        const twojsobid = twojsob.id;
        return document.getElementById(twojsobid);
    }

    removeChild(child){
        this.getTwoJSObject().remove(child.getTwoJSObject());
        super.removeChild(child);
    }
}
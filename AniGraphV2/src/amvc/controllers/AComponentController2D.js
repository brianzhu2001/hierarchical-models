import AController2D from "./AController2D";


export default class AComponentController2D extends AController2D{
    activate(args){
        super.activate(args);
    }

    getViewGroup(){
        return this.getComponent().getRootGraphicsGroup();
    }

    createView(){
        return;
        // super.createView();
    }

    get modelClassMap(){
        // return this._modelClassMap;
        return this.getComponent().modelClassMap;
    }

    onModelRelease(){
        super.onModelRelease();
    }

}
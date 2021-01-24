import AObjectNode from "../../aobject/AObjectNode";

export default class AView extends AObjectNode{
    constructor(args){
        super(args);
        if(args!==undefined){
            this.controller = args.controller;
        }
    }

    initTempState(args) {
        super.initTempState(args);
        this.controller = undefined;
    }

    getComponentAppState(name) {
        return this.getController().getComponent().getAppState(name);
    }

    releaseGraphics(args){
        if(this.getGraphics()) {
            for (let g of this.getGraphics()) {
                g.release(args);
            }
            this.setGraphics([]);
        }
    }

    release(args){
        this.releaseGraphics();
        this.updateGraphicsContext(); // TODO: this is only defined in child class, I think
        super.release();
    }

    _removeFromParent(){
        //    views arent in hierarchy right now so do nothing
    }

    _attachToNewParent(newParent){
        //    views arent in hierarchy right now so do nothing
    }


    /**
    * [graphics] setter
    * @param graphics Value to set graphics
    * @param update Whether or not to update listeners
    */
    setGraphics(graphics){this._graphics = graphics;}
    getGraphics(){return this._graphics;}
    addGraphic(graphic){
        this.getGraphics().push(graphic);
        graphic.setView(this);
    }

    /** Getter and setter that map [controller] to tempState, which means it wont be serialized.*/
    get controller(){return this._tempState.controller;}
    set controller(value){this._tempState.controller = value;}

    setController(controller){this.controller = controller;}
    getController(){return this.controller;}
    getModel(){return this.getController().getModel();}
    getComponent(){return this.getController().getComponent();}
    getGraphicsContext(){return this.getComponent().getGraphicsContext();}

    getComponentController(){
        return this.getController().getComponent().componentController;
    }
    get componentController(){return this.getComponentController();}

    initGraphics(){
        this.setGraphics([]);
    }

    hideGraphics(){

    }
    showGraphics(){

    }

    getModel(){
        return this.getController().getModel();
    }

    onModelUpdate(){
        this.updateGraphics();
        return true;
    }

    updateGraphics(){
        this.updateViewElements();
        this.updateGraphicsContext();
    }

}
import AController2D from "../AController2D";



export default class A2DSupplementalController extends AController2D{
    static DefaultHostViewInteractionClasses = [];
    static ViewClass = null;
    constructor(args) {
        super(args);
        this.hostViewInteractionClasses = (args && args.hostViewInteractionClasses)? args.hostViewInteractionClasses : this.constructor.DefaultHostViewInteractionClasses.slice();
    }

    release(args){
        this.detach();
        super.release(args);
    }

    getModel(){
        return this.hostController? this.hostController.getModel() : undefined;
    }

    listenToHostModel(){
        this.listen();
    }


    /** Get set hostInteractions */
    set hostInteractions(value){this._hostInteractions = value;}
    get hostInteractions(){return this._hostInteractions;}

    //TODO instead of setting model when attaching, just have getter that accesses it through hostController | DONE?

    get isSupplementalController(){return true;}
    get isComponentSupplementalController(){return false;}
    /** Get set hostController */
    set hostController(value){this._hostController = value;}
    get hostController(){return this._hostController;}

    getHostController(){
        return this.hostController;
    }

    get isAttached(){return !!this.hostController;}

    getViewClass(){
        return this.constructor.ViewClass;
    }

    createView(){
        if(this.getViewClass() && this.hostController) {
            const newView = new (this.getViewClass())({controller: this});
            this.setView(newView);
            this.getView().initGraphics();
            this.getView().onModelUpdate();
        }
    }

    attachToController(controller){
        if(this.hostController) {
            this.detach();
        }
        this.hostController = controller;
        this.hostController.addSupplementalController(this);
        this.createView();
        this.initInteractions();

        if(this.getView()) {
            this.hostController.getViewGroup().add(this.getViewGroup());
        }
        // if(this.getView()) {
        //     this.getView().onModelUpdate();
        // }
    }

    activate(args){
        super.activate(args);
        if(this.getModel()) {
            // this.onModelUpdate();
            if(this.getViewClass() && this.getView()){
                this.getView().onModelUpdate(args);
            }
        }
    }
    /**
     * Add the interactions
     * @param args
     */
    initInteractions(args) {
        super.initInteractions(args);
        this.initHostViewInteractions(args);
    }

    /**
     * Initializat any of the supplemental controller's interactions that belong on the host view or elements
     */
    initHostViewInteractions(){
        const self = this;
        if(this.hostController && this.hostController.getView()){
            this.hostController.getView().getGraphics().map((g)=>{
                self.addInteractionsToHostViewElement(g);
            })
        }
        // TODO: implement this so that it adds interaction... maybe need to have a list of host interactions
    }

    addInteractionsToHostViewElement(element){
        for (let iclass of this.hostViewInteractionClasses) {
            // iclass.Create({
            //     element: element,
            //     controller: this,
            //     hostController: this.hostController
            // })
            iclass.Create({
                element: element,
                controller: this,
                hostController: this.hostController
            })
        }
    }

    detach(){
        this.deactivate();
        const host = this.hostController;
        // this.getView().getGroup().removeFromParentGroup();
        this.releaseAllInteractions();
        if(this.getView() && this.getViewClass()){
            console.assert(this.getView().getController()===this, "RELEASING ANOTHER CONTROLLER'S VIEW!");
            this.getView().release();
            this.setView();
        }
        if(host){
            host.removeSupplementalController(this);
            this.hostController = undefined;
            host.getComponent().updateGraphics();
        }
    }

    onModelRelease() {
        this.detach();
        // console.log("Is this getting called?");
        super.onModelRelease();
    }

    onModelUpdate(args){
        const self = this;
        function defaultResponse(){
            // Only update view if we own it...
            if(self.getViewClass() && self.getView()){
                self.getView().onModelUpdate(args);
            }
            return true;
        }
        // return defaultResponse();
        function unanticipatedUpdate(){
            console.warn("Did not know what to do for onModelUpdate for: "+args.type);
        }
        switch (args.type){
            // case 'addChild':
            case 'childUpdated':
                return defaultResponse();
                break;
            case 'setProperties':
                return defaultResponse();
                break;
            case "setAttributes":
                return defaultResponse();
                break;
            case "addChild":
                return defaultResponse();
                break;
            case "_attachToNewParent":
                return defaultResponse();
                break;
            case "_removeFromParent":
                return defaultResponse();
                break;
            case "release":
                return self.onModelRelease();
                break;
            default:
                return unanticipatedUpdate();
        }

    }

}
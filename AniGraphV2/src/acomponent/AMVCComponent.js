import React from "react";
import AController from "../amvc/controllers/AController";
import AView from "../amvc/views/AView";
import AModel from "../amvc/models/AModel";
import AComponent from "./AComponent";

export default class AMVCComponent extends AComponent{
    static ComponentControllerClass = AController;
    static SupplementalControllerClasses = {};
    static ModelClassMap = {
        default: {
            controllerClass: AController,
            viewClass: AView,
            modelClass: AModel
        }
    };

    get modelClassMap(){return this.constructor.ModelClassMap;}

    getDefaultModelClass(){
        return this.constructor.ModelClassMap.default.modelClass;
    }

    initComponent(props){
        super.initComponent(props);
        var model = undefined;
        if(props!==undefined && props.model!==undefined){
            model = props.model;
        }
        model = model? model: (this.getAppStateObject()? this.getAppState('model') : undefined);
        this.setModelAndListen(model);

        this._initDefaultControllers(props);
        this.startControllers();
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.setAppState('loadNewModel', function(model){
            self.loadNewModel(model);
        });
    }

    _getMainControllerForModel(model){
        if(!model){return;}
        if(model===this.model){
            return this.componentController;
        }
        const matches = this.componentController.findDescendants((c)=>{
            if(c && c.getModel() && c.getModel().getUID()===model.getUID()){
                return c;
            }
        });
        console.assert(matches.length<2, {msg: `Found ${matches.length} controllers for model`, model: model, matches: matches});
        if(matches.length){
            return matches[0];
        }
    }

    loadNewModel(model){
        this.reset();
        this.componentController.getModel().addChild(model);
        this.model.notifyPropertySet();
    }

    _createNewComponentController(){
        const componentController =  new this.componentControllerClass({
            model: this.getModel(),
            component: this
        });
        // componentController.activate();
        return componentController;

            // modelClassMap: this.modelClassMap

    }


    //##################//--Model--\\##################
    //<editor-fold desc="Model">
    // /** Get set model */
    // set model(value){this.state.model = value;}
    // get model(){return this.state.model;}
    set model(value){this.setAppState('model', value);}
    get model(){return this.getAppState('model');}
    /**
     * Set the data model. This will be the root model for the application.
     * If the data model is hierarchical, then it may have children.
     * @param model
     */
    setModelAndListen(model, listen=true){
        this.model = model;
        if(model && listen) {
            this.listen();
        }
    }

    getModel(){
        return this.model;
    }

    getModelSummary(){
        return this.getModel().getSummary();
    }

    onModelUpdate(args){
        if(args && args.type && args.type=='call'){
            if(this[args.method]){
                this[args.method](args.args);
            }
        }
    }

    //</editor-fold>
    //##################\\--Model--//##################

    //##################//--saving/loading--\\##################
    //<editor-fold desc="saving/loading">
    saveJSON(){
        this.model.saveJSON();
    }

    saveModelToJSON(){
        this.model.saveJSON();
    }
    //</editor-fold>
    //##################\\--saving/loading--//##################


    /**
     * Creates controllers
     * @param props
     */
    _initDefaultControllers(props){
        if(this.controllers && this.controllers!=={}){
            return;
        }
        this.controllers = {};
        this._componentControllerClass = (props && props.ComponentControllerClass)? props.ComponentControllerClass : this.constructor.ComponentControllerClass;
        this.setComponentController(this._createNewComponentController());
        this._defaultSupplementalControllerClasses=(props && props.SupplementalControllerClasses)? props.SupplementalControllerClasses : this.constructor.SupplementalControllerClasses;
        for (let supCName in this.defaultSupplementalControllerClasses) {
            var newC = new this.defaultSupplementalControllerClasses[supCName]({component: this});
            this.setController(supCName, newC);
        }
    };


    /**
     * Where initial set of controllers should be activated. Will be called once component mounts and context is created.
     * Any controllers based on the classes in  this.constructor.SupplementalControllerClasses will be initialized here.
     * @param args
     */
    startControllers(args){
        for(let newC of this.getControllersList()) {
            if (newC.isSupplementalComponentController) {
                newC.attachToController(this.componentController);
            }
        }
        this.componentController.activate();
    }

    release(args){
        super.release(args);
        // TODO: release controllers and possibly model...
    }

    reset(){
        const supc = this.getSupplementalModelControllers();
        for(let c of supc){
            c.detach();
        }
    }

    //##################//--Controllers--\\##################
    //<editor-fold desc="Controllers">
    /**
     * [root controller class] setter
     * @param componentControllerClass Value to set root controller class
     * @param update Whether or not to update listeners
     */
    get componentControllerClass(){
        if(this.getComponentController()){
            return this.getComponentController().constructor;
        }else {
            return this._componentControllerClass;
        }
    }

    /** Get set defaultSupplementalControllerClasses */
    get defaultSupplementalControllerClasses(){return this._defaultSupplementalControllerClasses;}

    getControllersList(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){return self._controllers[k]});
    }

    getSupplementalComponentControllers(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){
            if(self.controllers[k].isSupplementalComponentController){
                return self._controllers[k]
            }
        });
    }

    getSupplementalModelControllers(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){
            let controller = self.controllers[k];
            if(controller.isSupplementalController && !controller.isSupplementalComponentController){
                return self._controllers[k]
            }
        }).filter(c=>{return c;});
    }


    /** Get set controllers */
    set controllers(value){this._controllers = value;}
    get controllers(){return this._controllers;}

    getController(name){return this._controllers[name];}
    setController(name, controller){
        this._controllers[name]=controller;
        controller.component = this;
        controller.keyInComponent = name;
    }
    removeController(c){
        if(c){
            var key = c.keyInComponent ? c.keyInComponent : c;
            var controller= this.controllers[key];
            controller.deactivate();
            if(controller.isSupplementalController){
                controller.detach();
            }
            delete this.controllers[key];
        }
    }
    setComponentController(controller){this.setController('component', controller);}
    getComponentController(){return this.componentController;}
    get componentController(){return this.getController('component');}

    // addController(name, controller){this.getControllers().push(controller);}
    getControllers(){return this._controllers;}
    setControllers(controllers){
        for(let name of controllers){
            this.setController(name, controllers[name]);
        }
    }

    //</editor-fold>
    //##################\\--Controllers--//##################

    //##################//--Update functions--\\##################
    //<editor-fold desc="Update functions">
    update(){
        var d = Date.now();
        this.setState(() => ({
            time: d,
            // modelSummary: this.getModelSummary()
        }));
    }
    startTimer(){
        if(this.timerID === null) {
            this.timerID = setInterval(
                () => this.tick(),
                1000
            );
        }
    }
    stopTimer(){
        if(this.timerID !== null) {
            clearInterval(this.timerID);
            this.timerID = null;
        }
    }
    tick(){
        this.update();
    }

    onGraphChange(args){
        this.updateGraph(args);
    }
    updateGraph(args){
        this.signalAppEvent("graphChanged", args);
    }

    //</editor-fold>
    //##################\\--Update functions--//##################

    bindMethods(){
        super.bindMethods();
        this.saveJSON = this.saveJSON.bind(this);
        this.saveModelToJSON = this.saveModelToJSON.bind(this);
    }

}

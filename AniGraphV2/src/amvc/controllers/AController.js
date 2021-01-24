import AObjectNode from "../../aobject/AObjectNode";
import AModel from "../models/AModel";


/**
 * AController extends AModelListener, which is an AObjectNode subclass decorated with ModelListener.
 * This is done so that AController can use super to access the decorated version of the ModelListener methods.
 */
export default class AController extends AObjectNode{
    static DefaultViewElementInteractionClasses = [];
    static HasView = true;
    /**
     * Should create the view in the constructor
     * @param args For most use cases, should only include a model and component, e.g., { model: myModel, component: myComponent}
     */
    constructor(args) {
        super(args);
        this.viewElementInteractionClasses = (args && args.viewElementInteractionClasses)? args.hostViewInteractionClasses : this.constructor.DefaultViewElementInteractionClasses.slice();
        var component = (args && args.component) ? args.component : undefined;
        if(component){
            this.component = component;
        }
        if(args && args.model && !this.isSupplementalController) {
            this.loadModel(args.model);
        }
        if (this.getView() === undefined){
            this.createView();
        }

        if(args && args.model && !this.isSupplementalController){
            this.initModelChildren();
        }

        // if(!this.isSupplementalController) {
        //     this.setModelClassMap(this.constructor.DefaultModelClassMap());
        //     this.initWithModel((args && args.model)? args.model : undefined);
        //     if(args && args.view){
        //         this.setView(args.view);
        //     }
        //     this.initModelChildren();
        // }
        // if (this.getView() === undefined) {
        //     this.createView();
        //     this.onViewUpdate();
        // }
    }

    get modelClassMap(){
        // return this._modelClassMap;
        return this.getComponent().modelClassMap;
    }



    /** Get set newModelClass */
    set newModelClass(value){this._newModelClass = value;}
    get newModelClass(){return this._newModelClass;}

    getNewModelClass(){
        return this.newModelClass? this.newModelClass : this.constructor.DefaultModelClass;
    }

    loadModel(model){
        this.initWithModel(model);
    }

    initTempState(args){
        super.initTempState(args);
        this.supplementalControllers = {};
        this.interactions = {};
    }

    /**
     * TODO: this does not release the model or view... yet.
     * @param args
     */
    release(args){
        super.release(args);
        this.mapOverSupplementalControllers((c)=>{c.detach();});
        if(this.getModel()) {
            this.stopListening();
        }
        if(this.getView()){
            this.getView().release();
        }
        this.releaseAllInteractions();
    }


    //##################//--Supplemental Controllers--\\##################
    //<editor-fold desc="Supplemental Controllers">

    /**
     * Supplemental controllers are not part of the same model hierarchy as the data; they can be added or removed to different controllers over time.
     * To tell if a controller is supplemental, we can simply check if it has a model class map.
     * @returns {boolean}
     */
    get isSupplementalController(){return false;}

    /** Getter and setter that map [supplemental controllers] to tempState, which means it wont be serialized.*/
    get supplementalControllers(){return this._tempState.supplementalControllers;}
    set supplementalControllers(value){this._tempState.supplementalControllers = value;}

    /**
     * Map over any supplemental controllers
     * @param fn
     * @returns {[]}
     */
    mapOverSupplementalControllers(fn){
        if(Object.keys(this.supplementalControllers).length<1){return;}
        var rvals = [];
        for(let child of this.supplementalControllers){
            rvals.push(fn(child));
        }
        return rvals;
    }

    /**
     * Deactivate supplemental controllers.
     * @param args
     */
    deactivateSupplemental(args){
        this.mapOverSupplementalControllers(child=>{
            child.deactivate(args);
        });
    }

    addSupplementalController(sup){
        console.assert(sup.isSupplementalController, `Tried to add non-supplemental ${sup.constructor.name} as supplemental controller.`);
        this.supplementalControllers[sup.uid]=sup;
        sup.listenToHostModel();
        // sup.setModelAndListen(this.getModel(), true);
    }

    removeSupplementalController(sup){
        console.assert(sup.isSupplementalController, `Tried to remove non-supplemental ${sup.constructor.name} as supplemental controller.`);
        sup.stopListening();
        if(sup.getView()) {
            this.getViewGroup().removeChild(sup.getViewGroup());
        }
        delete this.supplementalControllers[sup.uid];
    }


    //</editor-fold>
    //##################\\--Supplemental Controllers--//##################



    getChildrenByModel(model, includeSupplemental=false){
        var rvals = [];
        for(let child of this.getChildrenList()){
            if(child.getModel()===model) {
                if((!child.isSupplementalController) || includeSupplemental){
                    rvals.push(child);
                }
            }
        }
        return rvals;
    }

    /**
     * Adds the given model as a child to the controller's model, and returns the corresponding child controller that is created.
     * Note that this works by first adding the child to the model, then looking for a corresponding child controller.
     * There should then be no other controllers with the same model added in the interum.
     * @param model
     */
    addModelGetChild(model){
        // this.getModel().addChild(model);
        return this.getComponent().addNewModel({model: model, parent: this.getModel()});
        // const childlist = this.getChildrenByModel(model);
        // if(childlist.length!==1){
        //     throw new Error(`wrong number of children  in ${this.constructor.name}.addModelGetChild(model) after child model added`);
        // }
        // return childlist[0];
    }

    getViewClassForModel(model){
        var modelclassmap = this.modelClassMap;
        var modelmap = modelclassmap[model.constructor.name];
        if(modelmap!==undefined){
            return modelmap.viewClass
        }else{
            return this.getModelClassMap()['default'].viewClass;
        }
    }

    getControllerClassForModel(model){
        var modelmap = this.modelClassMap[model.constructor.name];
        if(modelmap!==undefined){
            return modelmap.controllerClass
        }else{
            return this.modelClassMap['default'].controllerClass;
        }
    }

    getContextElement(){
        return this.getComponent().getGraphicsContext().getElement();
    }

    // /**
    // * [model class map] setter
    // * @param modelClassMap Value to set model class map
    // * @param update Whether or not to update listeners
    // */
    // setModelClassMap(modelClassMap){
        // this._modelClassMap = modelClassMap;
    // }
    getModelClassMap(){
        // return this._modelClassMap;
        return this.modelClassMap;
    }

    /**
     * Need to build the interaction tree after mounting because it applies to web elements that need to be created first
     */
    // onDidMount(){
    //     // this._buildInteractionTree();
    //     this.activate();
    // }


    //##################//--Interactions--\\##################
    //<editor-fold desc="Interactions">

    /** Getter and setter that map [interactions] to tempState, which means it wont be serialized.*/
    get interactions(){return this._tempState.interactions;}
    set interactions(value){this._tempState.interactions = value;}

    /**
     * If there is only one interaction for a given name, we can get it like so. This is ambiguous if there are multiple
     * interactions under the same name, so an assert is thrown in that case.
     * @param name
     * @returns {*}
     */
    getInteraction(name){

        const interactions = (this.interactions && this.interactions[name])? this.interactions[name] : undefined;
        if(interactions){
            const interactionKeys = Object.keys(interactions);
            console.assert(interactionKeys.length==1, "Wrong number of interactions: getInteraction is ambiguous!");
            return interactions[interactionKeys[0]];
        }
    }

    addInteraction(interaction){
        if(interaction===undefined || interaction.name===undefined){
            throw new Error({interaction: interaction, message:"Problem with interaction"});
        }
        if(this.interactions[interaction.name]===undefined){
            this.interactions[interaction.name]= {};
        }
        if(interaction.getUID() in this.interactions[interaction.name]){
            throw new Error({interaction: interaction, message:"Tried adding interaction that was already added"});
        }
        this.interactions[interaction.name][interaction.getUID()]=interaction;

        console.assert(interaction.controller===undefined, {controller: this, interaction: interaction, message: "Tried adding interaction that already has a controller"})
        interaction.controller=this;
    }

    removeInteraction(interaction){
        if(interaction===undefined || interaction.name===undefined){
            throw new Error("Problem with interaction:"+interaction);
        }
        if(this.interactions[interaction.name]===undefined || this.interactions[interaction.name][interaction.getUID()]===undefined){
            throw new Error("Cannot remove interaction that has not been added: "+interaction);
        }
        delete this.interactions[interaction.name][interaction.getUID()];
    }

    activateInteractions(nameList = 'all'){
        if(nameList==='all'){
            for(let name in this.interactions){
                this.activateInteractionsNamed(name);
            }
        }else{
            for(let n in nameList){
                this.activateInteractionsNamed(n);
            }
        }
    }

    activateInteractionsNamed(name){
        var itypedict = this.interactions[name];
        if(itypedict===undefined){
            throw new Error("No interactions named "+name);
        }
        for(let uid in itypedict){
            itypedict[uid].activate();
        }
    }

    releaseAllInteractions(){
        for(let name in this.interactions){
            var itypedict = this.interactions[name];
            for(let uid in itypedict){
                itypedict[uid].release();
            }
        }
        this.interactions = {};
    }

    deactivateInteractions(nameList = 'all'){
        if(nameList==='all'){
            for(let name in this.interactions){
                this.deactivateInteractionsNamed(name);
            }
        }else{
            for(let n in nameList){
                this.deactivateInteractionsNamed(n);
            }
        }
    }

    deactivateInteractionsNamed(name){
        var itypedict = this.interactions[name];
        if(itypedict===undefined){
            throw "No interactions named "+name;
        }
        for(let uid in itypedict){
            itypedict[uid].deactivate();
        }
    }


    /**
     * Define interacrtions
     * @param args
     */
    initInteractions(args){
        if(this.getView()) {
            this.addInteractionsToView(this.getView());
        }
    }

    /**
     * Build the interactions for this and all children recursively. (calls initInteractions on all, root to leaf order)
     * @param args
     * @private
     */
    _buildInteractionTree(args){
        this.initInteractions();
        this.mapOverChildren(child=>{
            child._buildInteractionTree(args);
        })
    }

    /**
     * This should activate the interactions
     * @param args
     */
    activate(args){
        this.isActive=true;
        this.activateInteractions(args);
        this.activateChildren(args);
    }
    activateChildren(args){
        this.mapOverChildren(child=>{
            child.activate(args);
        })
    }

    deactivate(args){
        this.deactivateChildren(args);
        this.deactivateInteractions(args);
        this.isActive=false;
    }
    deactivateChildren(args){
        this.mapOverChildren(child=>{
            child.deactivate(args);
        });
    }



    //</editor-fold>
    //##################\\--Interactions--//##################

    initWithModel(model, listen=true){
        this.setModelAndListen(model, listen);
        if(this.getModel()===undefined){
            this.setModelAndListen(new AModel(), listen);
        }

    }

    initModelChildren(){
        for(let child of this.getModel().getChildrenList()){
            this.createChildWithArgs({childModel: child});
            // this.onModelUpdate({
            //     type:'addChild',
            //     model: child
            // })
        }
    }

    getModel() {return this.model;}
    setModelAndListen(model, listen=true){
        this.model = model;
        if(listen && this.getModel()!==undefined){
            this.listen();
        }
    }

    //##################//--Model Listener--\\##################
    //<editor-fold desc="Model Listener">

    onModelRelease(){
        // console.log("CONTROLLER's MODEL RELEASED!!!");
    }

    listen() {
        this.getModel().setListener(this);
    }
    stopListening() {
        this.getModel().removeListener(this);
    }
    /**
     * Returns something that evaluates to true if the update is accounted for,
     * returns false otherwise.
     * @param args
     * @returns {boolean|*}
     */
    onModelUpdate(args){
        const self = this;
        function defaultResponse(){
            self.getView().onModelUpdate(args);
            return true;
        }
        function unanticipatedUpdate(){
            // console.warn("Did not know what to do for onModelUpdate for: "+args.type);
            // We can warn or throw an error if a type is unaccounted for, but be careful with order of execution
            // when it comes to subclasses that might handle the given type.
            console.warn("Did not know what to do for onModelUpdate with arguments:\n"+args);
            // throw (this.constructor.name+" needs to define "+args.type+" in onModelUpdate().");
        }

        switch (args.type){
            case 'addChild':
                return this.createChildWithArgs(args);
                break;
            case"parentUpdated":
                return defaultResponse();
                break;
            case 'childUpdated':
                return defaultResponse();
                break;
            case 'setProperties':
                return defaultResponse();
                break;
            case "setAttributes":
                return defaultResponse();
                break;
            case "release":
                return self.onModelRelease();
                break;
            default:
                return unanticipatedUpdate();
        }

    }
    //</editor-fold>
    //##################\\--Model Listener--//##################


    /** Get set component */
    set component(value){this._component = value;}
    get component(){return this._component;}
    getComponent(){return this._component;}


    setView(view){
        this.view = view;
        this.onViewUpdate();
    }
    getView(){return this.view;}

    getViewGroup(){
        return this.getView().getGroup();
    }

    createView(){
        var viewClass = this.getViewClassForModel(this.getModel());
        const newView = new viewClass({controller: this});
        this.setView(newView);
        this.getView().initGraphics();
        this.onViewUpdate();
        if(this.getView()) {
            this.addInteractionsToView(this.getView());
        }
    }

    addInteractionsToView(){
        for (let graphic of this.getView().getGraphics()) {
            this.addInteractionsToElement(graphic);
        }
    }

    addInteractionsToElement(element){
        for (let iclass of this.viewElementInteractionClasses) {
            iclass.Create({
                element: element,
                controller: this,
            })
        }
    }

    replaceViewClass(viewClass, replaceInChildren=true){
        if(this.getView()){
            this.mapOverSupplementalControllers((c)=>{c.detach();});
            this.releaseAllInteractions();
            this.getView().release();
        }
        const newView = new viewClass({controller: this});
        this.setView(newView);
        this.getView().initGraphics();
        this.onViewUpdate();

        this.mapOverChildren((c)=>{
            c.replaceViewClass(viewClass, true);
        });
    }

    onViewUpdate(){
    }

    createChildWithArgs(args){
        if(args.childModel===undefined) {
            console.log(args);
            console.assert(args.childModel !== undefined, "Must provide a childModel to " + this.constructor.name + ".createChildWithArgs...");
        }
        const childClass = this.getControllerClassForModel(args.childModel);
        var passArgs = Object.assign({}, args)
        passArgs = Object.assign(passArgs, {
            component: this.getComponent(),
            model: args.childModel,
            childModel: undefined
        });

        const newChild = new childClass(passArgs);
        this.addChild(newChild);
        return newChild;
    }

}
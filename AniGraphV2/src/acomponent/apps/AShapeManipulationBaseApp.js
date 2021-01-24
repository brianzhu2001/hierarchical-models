import AGraphicsComponent2D from "../AGraphicsComponent2D";
import React from "react";
import ABackgroundClickController from "../../amvc/controllers/supplemental/ABackgroundClickController";
import AComponentController2D from "../../amvc/controllers/AComponentController2D";
import A2DShapeController from "../../amvc/controllers/A2DShapeController";
import AView2D from "../../amvc/views/AView2D";
import AModel2D from "../../amvc/models/AModel2D";


export default class AShapeManipulationBaseApp extends AGraphicsComponent2D {
    static ModelClassMap = {
        default: {
            controllerClass: A2DShapeController,
            viewClass: AView2D,
            modelClass: AModel2D
        }
    };
    static ComponentControllerClass = AComponentController2D;
    static SupplementalControllerClasses = {
        backgroundClick: ABackgroundClickController,
    };
    get backgroundClickController(){return this.getController('backgroundClick')}
    get currentSelectionModeControllers(){return this._currentSelectionModeControllers;}
    set currentSelectionModeControllers(value){this._currentSelectionModeControllers = value;}
    set createShapeControllers(value){this._createShapeControllers = value;}
    get createShapeControllers(){return this._createShapeControllers;}

    /** Get set saveSVG */
    set saveSVG(value){this._saveSVG = value;}
    get saveSVG(){return this._saveSVG ? this._saveSVG : this._saveContextSVG;}

    // whether shape selection is enabled. When a new shape is being created, shape selection is not enabled.
    get shapeSelectionEnabled(){return true;}

    // The class to use for creating new models
    get newModelClass(){return this._newModelClass;}


    /**
     * Default state related to model selection. Whenever this state changes, the React component will re-render, which
     * will cause the tool panel to update (to show and allow control of the selected shape's properties and attributes).
     */
    getDefaultState() {
        return Object.assign(super.getDefaultState(), {
            selectedModel: undefined,
        });
    }


    bindMethods() {
        super.bindMethods();
        this._saveContextSVG = this._saveContextSVG.bind(this);
        this.setCurrentEditMode = this.setCurrentEditMode.bind(this);
    }

    //<editor-fold desc="Controllers">
    /**
     * Gets called after component mounts. Also calls initSupplemental____Controllers();
     * @param args
     */
    startControllers(args){
        super.startControllers(args);
        this.backgroundClickController.activate();
        this.currentSelectionModeControllers = [];
        this.initSupplementalComponentControllers();
        this.initSupplementalSelectionControllers();
        this.initSelectionModes();
        this.setAppState('availableSelectionModes', Object.keys(this._selectionModes));
    }

    initSupplementalComponentControllers(){
        // init supplemental component controllers
    }

    initSelectionModes(){
        const component = this;
        this.defineSelectionMode('Default', {
            getWorldSpaceBoundingBox: function(){
                return component.getSelectedModel().getWorldSpaceBBoxCorners();
            }
        });
        this.setCurrentSelectionMode('Default');
    }

    getSelectionModeDefinition(name){
        if(!this._selectionModes){
            return;
        }else{
            if(!name){
                return this._selectionModes['Default'];
            }else{
                return this._selectionModes[name];
            }
        }
    }

    /**
     * Define a new selection mode
     * @param name
     * @param args - either a function that gets world space bounding box from a mode,
     * or a dictionary with a getWorldSpaceBoundingBox argument that describes such a function.
     */
    defineSelectionMode(name, args){
        const requiredFuncName = 'getWorldSpaceBoundingBox';
        if(!this._selectionModes){
            this._selectionModes= {};
        }
        if(!!(args && args.constructor && args.call && args.apply)){
            this._selectionModes[name]={};
            this._selectionModes[name][requiredFuncName]=args;
        }else{
            if(!args[requiredFuncName]){
                throw new Error({msg: `Selection mode definition must include ${requiredFuncName} function`, providedArgs: {name: name, args: args}})
            }
            this._selectionModes[name]=args;
        }
    }

    getWorldSpaceBBoxCornersForSelection(){
        return this.getSelectionModeDefinition(this.getCurrentSelectionMode()).getWorldSpaceBoundingBox();
    }


    addSelectionController(name, controller){
        if(!this._selectionControllers){
            this._selectionControllers=[];
        }
        this.setController(name, controller);
        this._selectionControllers.push(name);
        this.setAppState('availableEditModes',
            this._selectionControllers
        );
    }

    /**
     * Gets a dictionary of the selection controllers.
     * This dictionary is created by the function, as the actual controllers are
     * stored with the rest of the controllers in the dictionary accessed by getController
     */
    getSelectionControllersDict(){
        const rval = {};
        for (let name of this._selectionControllers) {
            rval[name]=this.getController(name);
        }
        return rval;
    }

    initSupplementalSelectionControllers(){
        // add supplemental selection controllers.
        //e.g.,
        // this.addSelectionController('transform', new ABoundingBox2DController({
        //     component: this,
        //     handleInteractionClasses: [AIDragScaleAroundAnchor],
        //     anchorInteractionClasses: [AIDragAnchor],
        //     hostViewInteractionClasses: [AIDragShapePosition]
        // }));
    }
    //</editor-fold>

    //<editor-fold desc="Save SVG">
    /**
     * Save the svg corresponding to this component.
     * This function is private; the public saveSVG can be set to this or to
     * a function provided in props.
     * @private
     */
    _saveContextSVG(){
        this.getGraphicsContext().saveSVG();
    }
    //</editor-fold>

    //##################//--Shape Selection--\\##################
    //<editor-fold desc="Shape Selection">
    /**
     * User clicks on the graphics context. Generally, this should deselect an object.
     * @param args
     */
    handleContextClick(args){
        if(this.shapeSelectionEnabled) {
            this.selectShape(args);
        }
    }

    attachSelectionControllers(selectedController){
        this.currentSelectionModeControllers.map(c=>{
            c.attachToController(selectedController);
            c.activate();
        })
    }
    detachSelectionControllers(){
        this.currentSelectionModeControllers.map(c=>{
            if(c.isActive) {
                c.detach();
            }
        });
    }
    /**
     * This function handles everything that needs to happen when a shape is selected.
     * @param args - a dictionary. 'controller' key should be the controller for whatever shape is being selected.
     */
    selectShape(args) {
        var selectedController = (args && args.controller) ? args.controller : undefined;
        if(!selectedController && args && args.model){
            selectedController = this._getMainControllerForModel(args.model);
        }
        const addToSelection = (args && args.addToSelection) ? args.addToSelection : false;
        if(selectedController && this.getSelectionModeDefinition(this.getCurrentSelectionMode()).selectController){
            selectedController = this.getSelectionModeDefinition(this.getCurrentSelectionMode()).selectController(selectedController);
        }

        // if (selectedController && (selectedController!==this.componentController)) {
        if (selectedController) {
            if(addToSelection){
                this.addToModelControllerSelection(selectedController);
            }else{
                this.setSelectedModelController(selectedController);
            }
            if(selectedController!==this.componentController) {
                this.attachSelectionControllers(selectedController);
            }

        } else {
            this.detachSelectionControllers();
            this.setSelectedModelController(undefined);
        }
        this.updateGraph();
        this.updateGraphics();
    }

    reselectSelectedShape(){
        this.selectShape({controller: this.getSelectedModelController()});
    }

    //</editor-fold>
    //##################\\--Shape Selection--//##################

    //##################//--App State--\\##################
    //<editor-fold desc="App State">

    setSelectedModelControllers(value){
        this.setAppState('selectedModelControllers', value);
    }
    getSelectedModelControllers(){
        return this.getAppState('selectedModelControllers');
    }

    setSelectedModelController(value){
        this.setSelectedModelControllers(value? [value] : []);
    }

    addToModelControllerSelection(value){
        const currentSelection = this.getSelectedModelControllers();
        if(!currentSelection.includes(value)){
            currentSelection.push(value);
            this.setSelectedModelControllers(currentSelection);
        }
    }
    getSelectedModelController(){
        const selection = this.getSelectedModelControllers();
        return (selection && selection.length>0)? selection[0] : undefined;
    }

    getSelectedModel(){
        const controller = this.getSelectedModelController();
        return controller? controller.getModel() : undefined;
    }

    setCurrentEditMode(value){
        this.setAppState('currentEditMode', value);
    }
    getCurrentEditMode(){
        return this.getAppState('currentEditMode');
    }

    setCurrentSelectionMode(value){
        this.setAppState('currentSelectionMode', value);
    }
    getCurrentSelectionMode(){
        return this.getAppState('currentSelectionMode');
    }

    initAppState(){
        super.initAppState();
        const self = this;
        // initialize app state
        this.setAppState('saveSVG', this.saveSVG);
        this.setAppState('mainComponent', this);
        this.setAppState('AutoGroup', false);
        // set functions to call when certain app state changes
        this.addAppStateListener('currentEditMode', function(currentEditMode){
            self.setEditMode(currentEditMode);
        })
    }

    get autoGroupIsOn(){return this.getAppState('autoGroupIsOn');}


    /**
     * args should have a model key, can optionally have a parent key
     * @param args
     * @returns {the main controller created for the model being added}
     */
    addNewModel(args){
        console.assert(args && args.model, {msg: `Problem with addNewModel in ${this}`});
        console.assert(!this._getMainControllerForModel(args.model), {msg: `model already has controller`, args:args, oldController:this._getMainControllerForModel(args.model)});
        const parent = args.parent? args.parent : this.getModel();
        if(this.autoGroupIsOn){
            const newGroup = args.model.constructor.CreateGroup();
            parent.addChild(newGroup);
            newGroup.addChild(args.model);
            newGroup.recenterAnchorInSubtree();
        }else{
            parent.addChild(args.model);
        }
        return this._getMainControllerForModel(args.model);

    }

    /**
     * These modes will appear as options in the mode selection widget.
     * Hard coded for now. You can override this and add new modes if you want to experiment
     * in creative portion of the assignment.
     * @returns {string[]}
     */
    getAvailableEditModes(){
        return this.getAppState('availableEditModes');
    }


    /**
     * Set the editting mode, and activate or deactivate controllers based on what the new mode is.
     * @param mode
     */
    setEditMode(mode){
        if(mode && mode===this._lastEditMode){
            return;
        }
        this._lastEditMode=mode;
        this.detachSelectionControllers();
        this.currentSelectionModeControllers=[this.getSelectionControllersDict()[mode]];
        const selectedModelController = this.getSelectedModelController();
        if(selectedModelController){
            this.attachSelectionControllers(selectedModelController);
        }
    }


    //</editor-fold>
    //##################\\--App State--//##################

    //##################//--Rendering the React Component--\\##################
    //<editor-fold desc="Rendering the React Component">
    /**
     * Tells React how to render the component. This is written in JSX, which reads much like HTML.
     * If you want to know more [React docs](https://reactjs.org/docs/getting-started.html).
     * @returns {JSX.Element}
     */
    render() {
        // const toolPanels = this.renderToolPanels();
        return (

            // <div className={"col-6"}>
            <div className={"d-flex justify-content-start"}>
                {super.render()}
            </div>
        )
    }

    //</editor-fold>
    //##################\\--Rendering the React Component--//##################∂
}

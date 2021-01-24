import A2DShapeVertexEditController from "../../../amvc/controllers/supplemental/shape/A2DShapeVertexEditController";
import React from "react";
import A2DShapeCreateByVerticesController from "../../../amvc/controllers/supplemental/shape/A2DShapeCreateByVerticesController";
import ABackgroundClickController from "../../../amvc/controllers/supplemental/ABackgroundClickController";
import Vec2 from "../../../amath/Vec2";
import ABoundingBox2DController from "../../../amvc/controllers/supplemental/bbox/ABoundingBox2DController";
import AIDragScaleAroundAnchor from "../../../amvc/interactions/shape/AIDragScaleAroundAnchor";
import AIDragAnchor from "../../../amvc/interactions/shape/AIDragAnchor";
import AIDragShapePosition from "../../../amvc/interactions/shape/AIDragShapePosition";
import AShapeManipulationBaseApp from "../AShapeManipulationBaseApp";

function randomColorHex(){
    return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

export default class A2DShapeEditorComponent extends AShapeManipulationBaseApp {
    static SupplementalControllerClasses = {
        backgroundClick: ABackgroundClickController,
        createByVertices: A2DShapeCreateByVerticesController,
    };
    set createShapeControllers(value){this._createShapeControllers = value;}
    get createShapeControllers(){return this._createShapeControllers;}

    get shapeSelectionEnabled(){return !this.createShapeControllers[0].isActive;}
    /** Get set itemBeingCreated */
    set itemBeingCreated(value){
        this._itemBeingCreated = value;
    }
    get itemBeingCreated(){return this._itemBeingCreated;}


    /**
     * Default state related to model selection. Whenever this state changes, the React component will re-render, which
     * will cause the tool panel to update (to show and allow control of the selected shape's properties and attributes).
     */
    getDefaultState() {
        return Object.assign(super.getDefaultState(), {
            isCreatingNewShape: false,
        });
    }


    bindMethods() {
        super.bindMethods();
        this.runScript = this.runScript.bind(this);
        this.addRandomShape = this.addRandomShape.bind(this);
        this.deleteSelectedShape = this.deleteSelectedShape.bind(this);
        this.groupSelectionChildren = this.groupSelectionChildren.bind(this);
        this.ungroupSelectionChildren = this.ungroupSelectionChildren.bind(this);
    }

    //<editor-fold desc="Controllers">
    /**
     * Gets called after component mounts. super will call this.initSupplementalComponentControllers() and this.initSupplementalSelectionControllers();
     * @param args
     */
    startControllers(args){
        super.startControllers(args);
    }

    initSupplementalComponentControllers(){
        super.initSupplementalComponentControllers();
        this.createShapeControllers = [this.getController('createByVertices')];
        this.setNewModelClass();
    }

    initSupplementalSelectionControllers(){
        super.initSupplementalSelectionControllers();
        this.addSelectionController('editVertices', new A2DShapeVertexEditController({component: this}))
        this.initEditModes();
        this.initSelectionModes();
    }

    initEditModes(){
        this.addSelectionController('transform', new ABoundingBox2DController({
            component: this,
            handleInteractionClasses: [AIDragScaleAroundAnchor],
            anchorInteractionClasses: [AIDragAnchor],
            hostViewInteractionClasses: [AIDragShapePosition],
        }));
        this.switchToEditMode('transform')
    }



    switchToEditMode(editModeName){
        this.setCurrentEditMode(editModeName);
        this.setEditMode(editModeName);
    }

    getWorldSpaceBBoxCornersForSelection(){
        return super.getWorldSpaceBBoxCornersForSelection();
    }


    //</editor-fold>

    //##################//--Shape Selection--\\##################
    //<editor-fold desc="Shape Selection">

    //##################//--Shape Creation--\\##################
    //<editor-fold desc="Shape Creation">
    setNewModelClass(newModelClass){
        this._newModelClass = newModelClass? newModelClass : this.constructor.ModelClassMap.default.modelClass;
        this.createShapeControllers.map(c=>{
            c.newModelClass = newModelClass;
        })
    }

    activateCreateShapeControllers(){
        this.createShapeControllers.map(c=>{
            c.newModelClass = this.newModelClass;
            c.activate();
        })
    }
    deactivateCreateShapeControllers(){
        this.createShapeControllers.map(c=>{
            c.deactivate();
        });
    }

    /**
     * This function handles transition from creating a new shape to editing existing shapes.
     * Note that the associated state is updated at the end of the function.
     * @param value
     */
    toggleCreateNewShape(value) {
        var newValue = value;
        // if (newValue === undefined) {
        //     newValue = !this.getIsCreatingNewShapeAppState();
        // }
        const contextElement = this.componentController.getContextElement();
        if (value) {
            // We ARE creating a new shape
            this.detachSelectionControllers();
            this.activateCreateShapeControllers();
            contextElement.setStyle('cursor', 'crosshair');
        } else {
            // We are NOT creating a new shape
            this.deactivateCreateShapeControllers();
            contextElement.setStyle('cursor', 'default');
            this.itemBeingCreated = undefined;
        }
        // this.setIsCreatingNewShape(!!newValue);
    }
    //</editor-fold>
    //##################\\--Shape Creation--//##################

    //##################//--App State--\\##################
    //<editor-fold desc="App State">

    /**
     * The editor app has state indicating whether the user is currently creating a new shape.
     * @returns {boolean}
     */
    getIsCreatingNewShape() {
        // return this.state.isCreatingNewShape;
        return this.getAppState('isCreatingShape');
    }
    /**
     * Set the app state that indicates whether the user is about to create a new shape.
     * @param value
     */
    setIsCreatingNewShape(value) {
        this.setAppState('isCreatingNewShape', value);
    }

    setCurrentEditMode(value){
        this.setAppState('currentEditMode', value);
    }

    initAppState(){
        super.initAppState();
        const self = this;
        // initialize app state
        this.setAppState('onRunScriptButtonClick', this.runScript);
        this.setAppState('onRandomShapeButtonClick', this.addRandomShape);
        this.setAppState('onDeleteButtonClick', this.deleteSelectedShape);
        this.setAppState('onGroupChildrenButtonClick', this.groupSelectionChildren);
        this.setAppState('onUngroupChildrenButtonClick', this.ungroupSelectionChildren);

        this.addAppStateListener('isCreatingNewShape', function(isCreatingNewShape){
            self.toggleCreateNewShape(isCreatingNewShape);
        })
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
    //##################\\--Rendering the React Component--//##################

    deleteSelectedShape(){
        const selectedController = this.getSelectedModelController();
        const selectedModel = this.getSelectedModel();
        if(!selectedModel || !selectedModel.getParent()){
            return;
        }
        if(selectedModel===undefined){
            return;
        }
        selectedModel.release();
        this.updateGraph()
    }


    groupSelectionChildren(){
        const selectedModel = this.getSelectedModel();
        const newModelGroup = selectedModel.groupChildren();
        this.selectShape({
            model: newModelGroup,
        });
        this.updateGraph();
    }
    ungroupSelectionChildren(){
        const selectedModel = this.getSelectedModel();

        // if nothing selected, just return
        if(!selectedModel){return;};

        const newSelectedModel = selectedModel.ungroupChildren();
        this.selectShape({
            model: newSelectedModel,
        });
        this.updateGraph();
    }


    //##################//--Button Scripts--\\##################
    //<editor-fold desc="Button Scripts">
    /**
     * When you are testing your code, this function may come in handy...
     * It creates a shape with random vertices and color, and adds it to the scene.
     * @param model
     */
    addRandomShapeTo(model){
        const newModel = new this._newModelClass();
        newModel.setVertices(Vec2.RandomVecs(10, 250, 200));
        newModel.renormalizeVertices(true);
        this.addNewModel({model: newModel, parent: model});
        var randomColor = randomColorHex();
            // '#'+(Math.floor(Math.random()*16777215).toString(16));
        newModel.setAttribute('fill', randomColor);
    }

    /**
     * The "run script" button will be hooked up to this function. You are welcome to play with it as
     * a way to test your code.
     */
    runScript(){
        const newModel = new this._newModelClass();
        newModel.setVertices([
            new Vec2(100, 100),
            new Vec2(200, 100),
            new Vec2(200,200),
            new Vec2(100, 200)
        ]);
        newModel.renormalizeVertices(true);
        // this.model.addChild(newModel);
        this.addNewModel({model: newModel});
        var randomColor = randomColorHex();
        newModel.setAttribute('fill', randomColor);
    }

    addRandomShape(){
        this.addRandomShapeTo(this.model);
    }

    //</editor-fold>
    //##################\\--Button Scripts--//##################
}

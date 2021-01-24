import React from "react"
import {Toggle} from "rsuite";
import {Uploader} from "rsuite";
import AObject from "../../../aobject/AObject";
import AModelColorPicker from "../../gui/AModelColorPicker";
import AGUIComponent from "../../gui/AGUIComponent";
import AModelSlider from "../../gui/AModelSlider";
import AModel2D from "../../../amvc/models/AModel2D";
import ASelectPicker from "../../gui/ASelectPicker";


AObject.RegisterClass(AModel2D);

export default class A2DShapeEditorToolPanel extends AGUIComponent{

    constructor(props){
        super(props);
    }

    saveSVG(){
        this.getAppState('saveSVG')();
    }

    saveJSON(){
        this.getAppState('model').saveJSON();
    }

    setIsCreatingNewShape(value){
        this.setAppState('isCreatingNewShape', value);
    }
    // getIsCreatingNewShape(){
    //     return this.props.isCreatingNewShape;
    // }

    onRunScriptButtonClick(){
        this.getAppState('onRunScriptButtonClick')();
    }
    onRandomShapeButtonClick(){
        this.getAppState('onRandomShapeButtonClick')();
    }

    onDeleteButtonClick(){
        this.getAppState('onDeleteButtonClick')();
    }


    //##################//--new app state--\\##################
    //<editor-fold desc="new app state">

    setSelectedModelControllers(value){
        this.setAppState('selectedModelControllers', value);
    }
    getSelectedModelControllers(){
        return this.getAppState('selectedModelControllers');
    }

    setSelectedModelController(value){
        this.setSelectedModelControllers(value? [value] : []);
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

    getModelRotation(){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            return selectedModel.getRotation();
        }
    }

    setModelRotation(value){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            selectedModel.setRotation(value);
        }
    }

    getModelStrokeWidth(value){
        const selectedModel = this.getSelectedModel();
        if(selectedModel) {
            return selectedModel.getAttribute('linewidth');
        }
    }

    setModelStrokeWidth(value){
        const model = this.getSelectedModel();
        if(model) {
            model.setAttribute('linewidth', value);
        }
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('availableEditModes', function(availableEditModes){
            self.setState({editModeDataItems: self._getModeDataItems(availableEditModes)});
        })
        this.addAppStateListener('availableSelectionModes', function(availableSelectionModes){
            self.setState({selectionModeDataItems: self._getModeDataItems(availableSelectionModes)});
        })
        this.setAppState('saveSVG', this.saveSVG);

        this.addAppStateListener('selectedModelControllers', this.onSelectionChanged);
    }


    onSelectionChanged(selectedModelControllers){
        const selectedModel = selectedModelControllers && selectedModelControllers.length? selectedModelControllers[0].getModel() : undefined;
        this.setState({selectedModel: selectedModel});
    }


    //</editor-fold>
    //##################\\--new app state--//##################



    _getModeDataItems(availableModes){
        const modeNames = availableModes;
        if(!modeNames){
            return [];
        }
        const rval = [];
        if(Array.isArray(modeNames)){
            for(let m of modeNames){
                rval.push({value: m, label:m});
            }
        }else{
            for(let m in modeNames){
                rval.push({value: m, label:m});
            }
        }
        return rval;
    }

    async onUpload(file){
        const text = await file.blobFile.text();
        const aobj = AObject.NewFromJSON(text);
        if(aobj.recenterAnchorInSubtree){
            aobj.recenterAnchorInSubtree();
        }
        this.getAppState('loadNewModel')(aobj);
    }

    bindMethods() {
        super.bindMethods();
        this.setIsCreatingNewShape = this.setIsCreatingNewShape.bind(this);
        this.saveJSON = this.saveJSON.bind(this);
        this.saveSVG = this.saveSVG.bind(this);
        this.onUpload=this.onUpload.bind(this);
        this.setCurrentEditMode = this.setCurrentEditMode.bind(this);
        this.getCurrentEditMode = this.getCurrentEditMode.bind(this);
        this.getSelectedModel = this.getSelectedModel.bind(this);
        this.getModelRotation = this.getModelRotation.bind(this);
        this.setModelRotation = this.setModelRotation.bind(this);
        this.onRunScriptButtonClick = this.onRunScriptButtonClick.bind(this);
        this.onRandomShapeButtonClick = this.onRandomShapeButtonClick.bind(this);
        this.setModelStrokeWidth = this.setModelStrokeWidth.bind(this);
        this.getModelStrokeWidth = this.getModelStrokeWidth.bind(this);
        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.setCurrentSelectionMode = this.setCurrentSelectionMode.bind(this);
        this.getCurrentSelectionMode = this.getCurrentSelectionMode.bind(this);
    }
    render(){

        const uploaderStyles = {
            lineHeight: '15px'
        }

        return (
            <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
                {/*<div className={""} key={"col" + this.constructor.name}>*/}
                <div className={"container atoolpanel"}>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            Fill: <AModelColorPicker model={this.state.selectedModel} attribute={'fill'}/>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            Stroke: <AModelColorPicker model={this.state.selectedModel} attribute={'stroke'}/>
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            New:<Toggle onChange={this.setIsCreatingNewShape} checked={this.state.isCreatingNewShape}/>
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRunScriptButtonClick}>
                                Script
                            </button>
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRandomShapeButtonClick}>
                                Random
                            </button>
                        </div>
                    </div>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            Stroke <AModelSlider model={this.state.selectedModel} min={0} max={20} getValueFromModel={this.getModelStrokeWidth} setModelValue={this.setModelStrokeWidth} step={0.1}/>
                        </div>

                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick = {this.saveJSON}>
                                SaveJSON
                            </button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.saveSVG}>SaveSVG</button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable onUpload={this.onUpload}>
                                <div style={uploaderStyles}>Open [Risky]</div>
                            </Uploader>
                        </div>
                    </div>

                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            <ASelectPicker
                                placeholder={"EditMode"}
                                onChange={this.setCurrentEditMode}
                                data={this.state.editModeDataItems}
                                value={this.getCurrentEditMode}
                                defaultValue={this.getCurrentEditMode()}
                            />
                        </div>

                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            Rotation <AModelSlider model={this.state.selectedModel} min={-2*Math.PI} max={2*Math.PI} getValueFromModel={this.getModelRotation} setModelValue={this.setModelRotation} step={0.1}/>
                        </div>

                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.onDeleteButtonClick}>Delete</button>
                        </div>

                    </div>

                    {this.props.children}
                </div>
                {/*</div>*/}
            </div>
        )
    }
}
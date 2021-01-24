import React from "react"
import {Checkbox, Toggle} from "rsuite";
import {Uploader} from "rsuite";
import {
    A2DShapeEditorToolPanel,
    AModelColorPicker,
    AModelSlider,
    ASelectPicker,
} from "AniGraph";


export default class A2ToolPanel extends A2DShapeEditorToolPanel{
    //##################//--new app state--\\##################
    //<editor-fold desc="new app state">
    initAppState(){
        super.initAppState();
        this.setState({autoGroupIsOn: this.getAutoGroupIsOn()});
    }

    onAutoGroupToggle(args){
        this.setAutoGroupIsOn(!this.getAutoGroupIsOn());
    }

    setAutoGroupIsOn(value){
        this.setAppState('autoGroupIsOn', value);
    }
    getAutoGroupIsOn(){
        return this.getAppState('autoGroupIsOn');
    }

    onSelectionChanged(selectedModelController) {
        super.onSelectionChanged(selectedModelController);
    }

    bindMethods() {
        super.bindMethods();
        this.onAutoGroupToggle = this.onAutoGroupToggle.bind(this);
    }

    render(){
        const uploaderStyles = {
            lineHeight: '15px'
        }
        return (
            <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
                {/*<div className={""} key={"col" + this.constructor.name}>*/}
                <div className={"container atoolpanel"}>
                    <div className={"d-flex justify-content-end atoolpanel-row"}>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick = {this.saveJSON}>
                                SaveJSON
                            </button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.saveSVG}>SaveSVG</button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-right align-self-center"}>
                            <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable onUpload={this.onUpload}>
                                <div style={uploaderStyles}>Open [Risky]</div>
                            </Uploader>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-right align-self-center"}>
                            Fill: <AModelColorPicker model={this.state.selectedModel} attribute={'fill'}/>
                        </div>
                        <div className={"p-2 align-items-right align-self-center"}>
                            <button onClick = {this.onRunScriptButtonClick}>
                                Script
                            </button>
                        </div>
                        <div className={"p-2 align-items-right align-self-center"}>
                            <button onClick = {this.onRandomShapeButtonClick}>
                                Random
                            </button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-right align-self-center"}>
                            Stroke: <AModelColorPicker model={this.state.selectedModel} attribute={'stroke'}/>
                        </div>
                        <div className={"d-inline-flex p-3 align-items-right align-self-center"}>
                            Stroke <AModelSlider model={this.state.selectedModel} min={0} max={20} getValueFromModel={this.getModelStrokeWidth} setModelValue={this.setModelStrokeWidth} step={0.1}/>
                        </div>


                    </div>
                    <div className={"d-flex justify-content-end atoolpanel-row"} style={{height: '50px'}}>
                        <div className={"d-inline-flex p-2 mr-auto"}>
                            <div className={"p-2 align-self-center"}>
                            <ASelectPicker
                                placeholder={"SelectionMode"}
                                onChange={this.setCurrentSelectionMode}
                                data={this.state.selectionModeDataItems}
                                value={this.getCurrentSelectionMode}
                                defaultValue={this.getCurrentSelectionMode()}
                            />
                            </div>
                            <div className={"p-2 align-self-center"}>
                                <Checkbox
                                    checked={this.state.autoGroupIsOn}
                                    onChange={(args)=>{
                                        this.onAutoGroupToggle(args);
                                    }}
                                    style={{border: '2px solid #dddddd', borderRadius: '10px', paddingRight: '5px'}}>
                                    AutoGroup
                                </Checkbox>
                            </div>
                        </div>
                        {/*<div className={"d-inline-flex p-2 align-items-right align-self-center"}>*/}
                        {/*    <button onClick={this.onDeleteButtonClick}>Delete</button>*/}
                        {/*</div>*/}
                        <div className={"p-3 align-items-right align-self-center"}>
                            New:<Toggle onChange={this.setIsCreatingNewShape} checked={this.state.isCreatingNewShape}/>
                        </div>
                        <div className={"d-inline-flex p-3 align-items-right align-self-center"}>
                            Rotation <AModelSlider model={this.state.selectedModel} min={-2*Math.PI} max={2*Math.PI} getValueFromModel={this.getModelRotation} setModelValue={this.setModelRotation} step={0.1}/>
                        </div>
                        <div className={"d-inline-flex p-3 align-items-right align-self-center"}>
                            <ASelectPicker
                                placeholder={"EditMode"}
                                onChange={this.setCurrentEditMode}
                                data={this.state.editModeDataItems}
                                value={this.getCurrentEditMode}
                                defaultValue={this.getCurrentEditMode()}
                            />
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
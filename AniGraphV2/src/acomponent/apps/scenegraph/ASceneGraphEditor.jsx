

import ASceneGraphDragTable
    from "../../gui/ASceneGraphDragTable";
import AGUIComponent from "../../gui/AGUIComponent";
import React from "react";
import {Checkbox} from "rsuite";

export default class ASceneGraphEditor extends AGUIComponent{

    initAppState() {
        super.initAppState();
    }

    updateScenegraph(){
        this.signalAppEvent('graphChanged');
    }

    onDeleteButtonClick(){
        this.getAppState('onDeleteButtonClick')();
    }

    onGroupChildrenButtonClick(){
        this.getAppState('onGroupChildrenButtonClick')();

    }

    onUngroupChildrenButtonClick(){
        this.getAppState('onUngroupChildrenButtonClick')();
    }




    bindMethods() {
        super.bindMethods();
        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
        this.onGroupChildrenButtonClick = this.onGroupChildrenButtonClick.bind(this);
        this.onUngroupChildrenButtonClick = this.onUngroupChildrenButtonClick.bind(this);
    }

    render(){
        const getButton = function(text, fn, width=1){
            return (
                <div className={"d-inline-flex p-"+width+" align-items-center align-self-center"}>
                    <button onClick = {fn}>
                        {text}
                    </button>
                </div>
            );
        }

        return (
            <div className={""+this.constructor.name}>
                <div className="d-flex flex-row">
                    <div className="d-flex p-6">
                        {getButton("Delete", this.onDeleteButtonClick, 1)}
                        {getButton("GroupChildren", this.onGroupChildrenButtonClick, 2)}
                        {getButton("UngroupChildren", this.onUngroupChildrenButtonClick, 2)}
                    </div>
                </div>
                <div className="row">
                    <div style={{
                        height: 500,
                        width: '100%'
                    }}>
                        <ASceneGraphDragTable
                            appState={this.state.appState}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
import React from "react"
import AGUIComponent from "./AGUIComponent";

export default class AToolPanelComponent extends AGUIComponent{

    constructor(props){
        super(props);
    }

    bindMethods() {
        super.bindMethods();
    }
    render(){
        return (
        <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
            {/*<div className={""} key={"col" + this.constructor.name}>*/}
            <div className={"container atoolpanel"}>
                <div className={"d-flex justify-content-start atoolpanel-row"}>
                </div>
                {this.props.children}
            </div>
            {/*</div>*/}
        </div>
        );
    }
}
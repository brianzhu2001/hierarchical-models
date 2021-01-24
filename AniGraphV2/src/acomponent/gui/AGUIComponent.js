import React from "react"
import AComponent from "../AComponent";

export default class AGUIComponent extends AComponent{
    initComponent(props){
        super.initComponent(props);
        this.componentHost = (props && props.componentHost) ? props.componentHost : undefined;
    }

    // /** Get set host */
    set componentHost(value){this.state.host = value;}
    get componentHost(){return this.state.host;}


    bindMethods() {
        super.bindMethods();
    }

    render(){
        return (
            <div className={"container"}>
                {this.props.children}
            </div>
        )
    }
}
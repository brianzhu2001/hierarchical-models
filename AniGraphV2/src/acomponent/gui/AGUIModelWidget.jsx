import AComponent from "../AComponent";
import React from "react";

export default class AGUIModelWidget extends AComponent{
    constructor(props){
        super(props);
    }
    initComponent(props) {
        super.initComponent(props);
    }

    bindMethods() {
        super.bindMethods();
        this.handleChange=this.handleChange.bind(this);
    }

    getValueFromModel(){
        if(this.props.model) {
            if (this.props.attribute) {
                return this.props.model.getAttribute(this.props.attribute);
            } else if (this.props.property) {
                return this.props.model.getProperty(this.props.property);
            } else {
                return this.props.getValueFromModel();
            }
        }
    }
    setModelValue(value){
        if(this.props.model) {
            if (this.props.attribute) {
                return this.props.model.setAttribute(this.props.attribute, value);
            } else if (this.props.property) {
                return this.props.model.setProperty(this.props.property, value);
            } else {
                return this.props.setModelValue(value);
            }
        }
    }

    handleChange(value){
        this.setModelValue(value);
        this.setState({
            value: value
        })
        if(this.onValueChange!==undefined){
            this.onValueChange(value);
        }
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}
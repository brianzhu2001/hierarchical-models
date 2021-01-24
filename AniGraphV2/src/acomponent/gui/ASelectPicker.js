import React from "react"
import {SelectPicker} from "rsuite";
import AGUIModelWidget from "./AGUIModelWidget";

export default class ASelectPicker extends AGUIModelWidget{
    constructor(props) {
        super(props);
        if(props.data) {
            this.state.value = props.value;
        }
    }
    getDefaultState() {
        return Object.assign(super.getDefaultState(), {disabled:false});
    }

    bindMethods() {
        super.bindMethods();
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        super.handleChange(value);
        this.props.onChange(value);
        this.setState({value: value})
    }

    render(){
        return (
            <React.Fragment>
                <SelectPicker
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    onChange={this.onChange}
                    data={this.props.data}
                    style={{ width: 150 }}
                    defaultValue={this.props.defaultValue}
                />
            </React.Fragment>
        );
    }
}
// disabled={this.state.disabled}

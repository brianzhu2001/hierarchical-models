import React from 'react';
import reactCSS from 'reactcss';
import {SketchPicker} from "react-color";
import AComponent from "../AComponent";
import AGUIComponent from "./AGUIComponent";
import tinycolor from "tinycolor2"
import AGUIModelWidget from "./AGUIModelWidget";

const defaultColor = tinycolor({r: 200, g:200, b:200, a:1}).toRgb();

export default class AModelColorPicker extends AGUIModelWidget {
    constructor(props){
        super(props);
    }

    getDefaultState(){
        const state = super.getDefaultState();
        state.value= defaultColor;
        state.displayColorPicker = false;
        return state;
    }

    bindMethods() {
        super.bindMethods();
        this.handleClick=this.handleClick.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(){
        if(!!this.props.model) {
            this.setState({displayColorPicker: !this.state.displayColorPicker});
        }else{
            this.setState({displayColorPicker: false});
        }
    }



    onModelUpdate(){
        if(this.props.model!==undefined) {
            this.setState({
                value: tinycolor(this.getValueFromModel()).toRgb()
            });
        }else{
            this.setState({
                value: defaultColor
            });
        }
    }

    handleClose(){
        this.setState({ displayColorPicker: false })
    }

    handleChange(value){
        this.setModelValue(value.hex);
        this.setState({
            value: value.rgb
        })
        // this.onColorChange(color);
    }

    _onColorChange(value){
        // console.log(color);
        // console.assert(false, "onColorChange not provided!");
    }

    render() {

        var modelColor = this.getValueFromModel();
        if(modelColor===undefined){
            modelColor = defaultColor;
        }else{
            modelColor = tinycolor(modelColor).toRgb();
        }
        const styles = reactCSS({
            'default': {
                color: {
                    padding: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '2px',
                    background: `rgba(${ modelColor.r }, ${ modelColor.g }, ${ modelColor.b }, ${ modelColor.a })`,
                },
                swatch: {
                    padding: '2px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <React.Fragment>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color }>
                        {this.props.label}
                    </div>
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ modelColor } onChange={ this.handleChange } />
                </div> : null }
            </React.Fragment>
        )
    }
}


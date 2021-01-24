import {Slider} from 'rsuite'
import AGUIModelWidget from "./AGUIModelWidget";
import reactCSS from 'reactcss'
import React from "react";
import 'rsuite/dist/styles/rsuite-default.css';

export default class AModelSlider extends AGUIModelWidget{
    getMin(){
        return this.props.min? this.props.min : 0;
    }
    getMax(){
        return this.props.max? this.props.max : 10;
    }

    render(){
        const styles = reactCSS({
            'default': {
                slider: {
                    width: 100,
                    margin: 10
                }
            },
        });
        return (
                <div style={styles.slider}>
                <Slider
                    onChange={this.handleChange}
                    value={this.getValueFromModel()}
                    min={this.getMin()}
                    max={this.getMax()}
                    step={this.props.step}
                    disabled={this.props.model===undefined}
                />
                </div>
        );
    }
}
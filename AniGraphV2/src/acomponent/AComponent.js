import React from "react";
// import JSONTree from 'react-json-tree';
import {ModelListener} from "../amvc/models/AModelListener";
import "./styles/AGraphicsComponent.css"
import AppState from "../amvc/models/AppState";

@ModelListener()
export default class AComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = Object.assign(this.getDefaultState(), this.state);
        if(props && props.appState) {
            this.setAppStateObject(props.appState);
        }
        this.bindMethods();
        if(this.state===undefined){this.state = {};}
    }


    /**
     * This function will be run in the constructor, and potentially re-run if the component is reset
     * This may happen, for example, if the component is given a new model.
     * @param props
     */
    initComponent(props){
    }

    initAppState(){
        this._aEventCallbackSwitches = {};
    }

    /**
     * Setting app state will set the component's state AND the appState State...
     * @param name
     * @param value
     * @param update
     */
    setAppState(name, value, update=true, setReactState=true){
        this.getAppStateObject().setState(name, value, update);
        if(setReactState) {
            if(!this.hasMounted){
                this.state[name]=value;
            }else {
                const stateDict = {};
                stateDict[name] = value;
                this.setState(stateDict);
            }
        }
    }

    getAppState(name){
        return this.getAppStateObject().getState(name)
    }

    setAppStateObject(appState){
        this.state.appState = appState;
        if(this.state.appState) {
            this.state.appState.setListener(this);
        }
    }

    getAppStateObject(){
        return this.state.appState;
    }

    onAppStateUpdate(args){
        // Nothing right now
    }

    signalAppEvent(eventName, args){
        this.getAppStateObject().signalEvent(eventName, args);
    }

    /**
     * Largely the same as addAppStateListener.
     * @param eventName
     * @param callback
     * @param handle
     */
    addAppEventListener(eventName, callback, handle){
        const switchHandle = handle? handle : eventName;
        const callbackSwitch = this.getAppStateObject().addAEventListener(
            eventName,
            callback
        );
        this._addAEvenetCallbackSwitch(
            switchHandle,
            callbackSwitch
        );
    }

    addAppStateListener(stateName, callback, handle){
        const switchHandle = handle? handle : stateName;
        const callbackSwitch = this.getAppStateObject().addAEventListener(
            AppState.GetStateListenerEventName(stateName),
            callback
        );
        this._addAEvenetCallbackSwitch(
            switchHandle,
            callbackSwitch
        );
    }

    _addAEvenetCallbackSwitch(handle, callbackSwitch){
        if(this._aEventCallbackSwitches[handle] !== undefined){
            console.assert(false, {message: `Handle ${handle} already used for AEvent callback`, component: this});
            this._aEventCallbackSwitches[handle].deactivate();
        }
        this._aEventCallbackSwitches[handle]=callbackSwitch;
    }

    release(args){
    }

    get hasMounted(){
        return this._hasMounted;
    }

    get cssClassName(){
        return "acomp-"+this.constructor.name;
    }

    //##################//--Initialization and defaults--\\##################
    //<editor-fold desc="Initialization and defaults">


    reset(args){

    }

    // loadNewModel(model){
    //     this.reset();
    //     // this.setState(this.getDefaultState());
    //     this.initComponent({model:model});
    //     this.componentDidMount();
    //     this.model.notifyPropertySet();
    // }




    getDefaultState(){
        return {
            model : undefined,
            width: 800,
            height: 500
        };
    }

    componentDidMount(){
        this._hasMounted = true;
        this.initComponent(this.props);
        this.initAppState(this.props);
    }
    //</editor-fold>
    //##################\\--Initialization and defaults--//##################


    //##################//--Update functions--\\##################
    //<editor-fold desc="Update functions">
    update(){
        var d = Date.now();
        this.setState(() => ({
            time: d,
            // modelSummary: this.getModelSummary()
        }));
    }
    startTimer(){
        if(this.timerID === null) {
            this.timerID = setInterval(
                () => this.tick(),
                1000
            );
        }
    }
    stopTimer(){
        if(this.timerID !== null) {
            clearInterval(this.timerID);
            this.timerID = null;
        }
    }
    tick(){
        this.update();
    }
    // resize(){
    //     this.setState({
    //         right: this.two.width,
    //         bottom: this.two.height
    //     });
    // }

    //</editor-fold>
    //##################\\--Update functions--//##################






    //##################//--ReactComponent Functions--\\##################
    //<editor-fold desc="ReactComponent Functions">
    // componentWillUnmount(){
    // }
    // componentDidUpdate(prevProps, prevState){
    // }

    render(){
        return (
            <div className={'acomponent-parent-container'}>
                <div
                    className={"acomponent "+this.cssClassName}
                    ref={el => {this.setStage(el);}}
                    style={{
                        height: this.state.height,
                        width: this.state.width
                    }}
                />
                {/*<JSONTree data={this.state.modelSummary}/>*/}
            </div>
        );
    }
    //</editor-fold>
    //##################\\--ReactComponent Functions--//##################

    bindMethods(){

    }

}

/*
 * Copyright (c) 2020. Abe Davis
 */

import AHasModelListeners from "./AHasModelListeners";
import ASignalsAEvents from "../../aobject/events/ASignalsAEvents";
import AEventCallbackDict from "../../aobject/events/AEventCallbackDict";

@ASignalsAEvents()
export default class AppState extends AHasModelListeners{

    static GetStateListenerEventName(stateName){
        return '_setState_'+stateName;
    }

    constructor(args) {
        super(args);
        this._appState = {};
        if(args!==undefined) {
            this._initState(args);
        }else{
            this._initState();
        }
        // this.setDefaultState(defaultProps);
    }

    release(){
        super.release();
    }

    initTempState(args) {
        super.initTempState(args);
        this._tempState.listeners = {};
    }

    _initState(stateDict, defaults, update){
        console.assert(this._appState !== undefined, "Tried to call initState before app properties array created. Did you call initState before super(args, stateDict) in a constructor?");
        // if(defaults !== undefined){
        //     this.setStates(defaults, false);
        // }
        const args = Object.assign({}, stateDict, defaults);
        var stateDictPresent = (typeof stateDict)==="object";
        if((stateDict===undefined) || Object.entries(stateDict).length<1){stateDictPresent=false};
        this.setStates(args, stateDictPresent);
    }

    // /**
    //  *
    //  * @param args
    //  */
    // callListeners(args){
    //
    //     const listeners = Object.assign({}, this.getListeners());
    //     const callMessage = Object.assign({type: 'call'}, args);
    //     for(let uid in this.getListeners()) {
    //         this.getListenerByID(uid).onAppStateChange(callMessage);
    //     }
    // }

    setDefaultState(defaults, update=false){
        var stateUpdate = {};
        for(let key in defaults){
            if(this.getState(key)===undefined){
                stateUpdate[key]=defaults[key];
            }
        }
        if(Object.entries(propertyUpdate).length>0){
            this.setState(propertyUpdate, update);
        }

    }

    getState(name){
        return this._appState[name];
    }

    setState(name, value, update=true){
        this._appState[name] = value;
        if(update) {
            this.signalEvent(AppState.GetStateListenerEventName(name), value);
            // this.notifyListeners({
            //     type: "setState",
            //     args: {name:value}
            // });
        }
    }

    setStates(stateDict, update=true){
        Object.assign(this._appState, stateDict);
        if(update) {
            for (let k in stateDict) {
                this.signalEvent(AppState.GetStateListenerEventName(k), stateDict[k]);
            }
        }
    }

    // notifySetState(args){
    //     this.notifyListeners(Object.assign({type: "setState"}, args));
    // }

    // setState(stateDict, update=true){
    //     if(stateDict === undefined){return;}
    //     Object.assign(this._appState, stateDict);
    //     if(update){
    //         this.notifySetState(stateDict);
    //     }
    // }

    // getState(){return this._appState;}

    // notifyChildAdded(child){
    //     this.notifyListeners({
    //         type: 'addChild',
    //         childApp: child
    //     })
    // }

    notifyListeners(args){
        const listeners = Object.assign({}, this.getListeners());
        const appMessage = this.createUpdateMessage(args);
        for(let uid in this.getListeners()) {
            this.getListenerByID(uid).onAppStateUpdate(appMessage);
        }
    }

    getSummary(){
        const summary = {};
        const details = {
            name:this.name,
            // uid: this.getUID()
        }
        details.properties = this.getState();
        details.children = [];
        for(let child of this.getChildrenList()){
            details.children.push(child.getSummary());
        }
        summary[this.constructor.name]=details;
        return summary;
    }



}
import AEventCallbackDict from "./AEventCallbackDict";
import AObject from "../AObject";

export default function ASignalsAEvents() {
    return function( target) {
        const signallerFunctions = {
            _setAEvents: function _setAEvents(aEvents){this.aEvents = aEvents;},
            _getAEvents: function _getAEvents(){return this.aEvents;},
            _getAEventCallbackDict: function _getAEventCallbackDict(eventName){return this.aEvents[eventName];},
            addAEventListener: function addAEventListener(eventName, callback){
                if(this.aEvents===undefined){
                    this.aEvents={};
                }
                if(this.aEvents[eventName]===undefined){
                    this.aEvents[eventName]=new AEventCallbackDict({name:eventName});
                }
                return this.aEvents[eventName].addCallback(callback);
            },
            removeEventListener: function removeEventListener(eventName, callback){
                if(this.aEvents===undefined){return;}
                if(this.aEvents[eventName]===undefined){return;}
                this.aEvents[eventName].removeCallback(callback);
            },
            signalEvent: function signalEvent(eventName, args){
                if(this.aEvents===undefined){
                    this.aEvents={};
                }
                if(this.aEvents[eventName]===undefined){
                    this.aEvents[eventName]=new AEventCallbackDict({name:eventName});
                }
                this._getAEventCallbackDict(eventName).signalEvent(args);
            }
        }

        var elnames = {};
        for(let el of target.elements){
            elnames[el.key]=el;
        }
        for(let funcname in signallerFunctions){
            if(elnames[funcname]===undefined) {
                target.elements.push({
                    kind: 'method',
                    key: funcname,
                    placement: 'prototype',
                    descriptor: {
                        value: signallerFunctions[funcname],
                        writable: false,
                        configurable: false,
                        enumerable: false,
                    }
                });
            }
        }

        // const requiredFunctions = ['onModelUpdate'];
        // for(let rfuncname of requiredFunctions){
        //     if(elnames[rfuncname]===undefined){
        //         console.assert(elnames[rfuncname] !== undefined, "Class decorated with AModelListener must define method "+rfuncname);
        //     }
        // }
        return target;
    }
}

@ASignalsAEvents()
class ASignalsAEventsObject extends AObject{
    constructor(args){
        super(args);
        // this.events
    }
    // _setAEvents(aEvents){this.aEvents = aEvents;}
    // _getAEvents(){return this.aEvents;}
    // _getAEventCallbackDict(eventName){return this.aEvents[eventName];}
    // addAEventListener(eventName, callback){
    //     if(this.aEvents===undefined){
    //         this.aEvents={};
    //     }
    //     if(this.aEvents[eventName]===undefined){
    //         this.aEvents[eventName]=new AEventCallbackDict({name:eventName});
    //     }
    //     this.aEvents[eventName].addCallback(callback);
    // }
    // removeEventListener(eventName, callback){
    //     if(this.aEvents===undefined){return;}
    //     if(this.aEvents[eventName]===undefined){return;}
    //     this.aEvents[eventName].removeCallback(callback);
    // }
    //
    // signalEvent(eventName, args){
    //     this._getAEventCallbackDict(eventName).signalEvent(args);
    // }
}
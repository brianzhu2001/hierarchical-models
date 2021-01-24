import AObject from "../AObject";
import { v4 as uuidv4 } from 'uuid';

export default class AEventCallbackDict extends AObject{
    /**
     * Event callback dictionary. When you add a callback, it returns a switch.
     * If you call switch.activate() then the callback is added to the Dict.
     * if you call switch.deactivate() then the callback is removed.
     * deactivating it removes the record of it from the dictionary, so there is no pointer left
     * behind in the dictionary.
     *
     * @param args
     */
    constructor(args) {
        super(args);
        this.callbacks = (args && args.callbacks) ? args.callbacks : {};
    }

    /** Get set callbacks */
    set callbacks(value){this._callbacks = value;}
    get callbacks(){return this._callbacks;}

    _addCallback(callback){
        this.callbacks[handle] = callback;
    }

    /**
     * Adds the callback and returns a callback switch, which can call activate() and deactivate() to enable/disable the callback.
     * @param callback
     * @returns Callback switch {{activate: activate, active: boolean, handle: string, deactivate: deactivate}}
     */
    addCallback(callback){
        const handle = uuidv4();
        // this.callbacks[handle] = callback;
        const event = this;
        const callbackSwitch = {
            handle: handle,
            active: false,
            deactivate: function(){
                event.removeCallback(handle);
                this.active = false;
            },
            activate: function(){
                event.callbacks[handle] = callback;
            }
        }
        callbackSwitch.activate();
        return callbackSwitch;
    }
    removeCallback(uid){
        delete this.callbacks[uid];
    }

    getCallbackList() {
        const callbacks = this.callbacks;
        return Object.keys(callbacks).map(function(k){return callbacks[k]});
    }

    signalEvent(args){
        const callbackList = this.getCallbackList();
        for(let c of callbackList){
            c.call(null, args);
        }
    }

}
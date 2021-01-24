import AObjectNode from "../../aobject/AObjectNode"

/**
 * Decorator that turns a class into a model listener.
 * Not strictly required, and no longer used in the base code,
 * but possibly useful at some point.
 * @returns {function(*): *}
 * @constructor
 */
export function ModelListener() {
    return function( target) {
        const modelListenerFunctions = {
            getModel: function getModel() {
                return this.model;
            },

            setModel: function setModel(model, listen = true) {
                this.model = model;
                if (this.getModel() !== undefined && listen) {
                    this.listen();
                }
                // this.onModelUpdate({type: 'setModel'});
            },

            listen: function listen() {
                this.getModel().setListener(this);
            },

            stopListening: function stopListening() {
                if(this.getModel()!==undefined){
                    this.getModel().removeListener(this);
                }
            },

            onModelUpdate: function onModelUpdate(args){
                throw (this.constructor.name+" needs to define onModelUpdate.");
            }
        }

        var elnames = {};
        for(let el of target.elements){
            elnames[el.key]=el;
        }
        for(let mlfuncname in modelListenerFunctions){
            if(elnames[mlfuncname]===undefined) {
                target.elements.push({
                    kind: 'method',
                    key: mlfuncname,
                    placement: 'prototype',
                    descriptor: {
                        value: modelListenerFunctions[mlfuncname],
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

@ModelListener()
export default class AModelListener extends AObjectNode{
    constructor(args) {
        super(args);
        if(args!==undefined && args.model!==undefined){
            this.setModel(args.model, true);
        }
    }

    onModelUpdate(args){
        throw (this.constructor.name+" needs to define onModelUpdate.");
    }
}


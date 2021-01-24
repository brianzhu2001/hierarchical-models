import AObjectNode from "../../aobject/AObjectNode"

export function HasListeners() {
    return function( target) {
        const modelListenerFunctions = {
            setListeners: function setListeners(listeners){
                this._tempState.listeners = listeners;
            },
            getListeners: function getListeners(){return this._tempState.listeners;},
            setListener: function setListener(listener){
                this.getListeners()[listener._uid]=listener;
            },
            getListenerByID: function getListenerByID(uid){
                return this.getListeners()[uid];
            },
            removeListener: function removeListener(listener){
                delete this._tempState.listeners[listener._uid];
            },
            createUpdateMessage: function createUpdateMessage(args){
                return Object.assign({updater: this}, args);
            },
            notifyListeners: function notifyListeners(args){
                const listeners = Object.assign({}, this.getListeners());
                const modelMessage = this.createUpdateMessage(args);
                for(let uid in this.getListeners()) {
                    this.getListenerByID(uid).onModelUpdate(updateMessage);
                }
            },
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

@HasListeners()
export default class AHasModelListeners extends AObjectNode{
    constructor(args) {
        super(args);
        this.setListeners({});
    }

    initTempState(args) {
        super.initTempState(args);
        this._tempState.listeners = {};
    }

    // setListeners(listeners){
    //     this._tempState.listeners = listeners;
    // }
    // getListeners(){return this._tempState.listeners;}
    //
    // setListener(listener){
    //     this.getListeners()[listener._uid]=listener;
    // }
    // getListenerByID(uid){
    //     return this.getListeners()[uid];
    // }
    // removeListener(listener){
    //     delete this._tempState.listeners[listener._uid];
    // }
    // notifyListeners(args){
    //     const listeners = Object.assign({}, this.getListeners());
    //     for(let uid in this.getListeners()) {
    //         this.getListenerByID(uid).onModelUpdate(args);
    //     }
    // }

    notifyChildren(args){
        for (let child of this.getChildrenList()) {
            child.notifyListeners({
                type: 'parentUpdated',
                parent: this,
                args: args
            });
        }
    }

    notifyDescendants(args){
        this.notifyChildren({
            type: 'parentUpdated',
            parent: this,
            args: args
        });
        for (let child of this.getChildrenList()) {
            child.notifyDescendants({
                type: 'parentUpdated',
                parent: this,
                args: args
            });
        }
    }


    notifyParent(args){
        if(this.getParent()!==undefined){
            this.getParent().notifyListeners({
                type: 'childUpdated',
                child: this,
                args: args
            });
        }
    }
}


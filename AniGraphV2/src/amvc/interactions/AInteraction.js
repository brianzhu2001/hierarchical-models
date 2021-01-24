import AObject from "../../aobject/AObject";
import Vec2 from "../../amath/Vec2";


export default class AInteraction extends AObject{
    /**
     * Add an interaction to an element.
     * @param args
     * @returns {AInteraction}
     * @constructor
     */
    static Create(args){
        console.assert(args, {msg:`Must provide args dictionary to ${this.name}.Create({})`, args:args});
        const name = (args && args.name)? args.name : this.name;
        const element = (args && args.element)? args.element : undefined;

        // controller is always the controller that will activate/deactivate the interaction
        // In other words, it will always be the 'requesting' controller.
        const controller = (args && args.controller) ? args.controller : undefined;

        // hostController is the controller whose model and view are being accessed.
        // hostController is only different from controller when, for example, a supplemental controller adds interactions to the view elements of a host.
        const hostController = (args && args.hostController) ? args.hostController : controller;
        console.assert(element, {msg: `Must provide element to ${this.name}.Create({})`, args:args})
        const interaction = new this({
            name: name,
            element: element
        });
        element.setInteraction(name, interaction);
        if(controller) {
            controller.addInteraction(interaction);
            interaction.requestingController = controller;
            interaction.controller = hostController;
        }
        return interaction;
        ////////////////////////////
    }


    /**
     * Sets name and element if available in the args dictionary
     * @param args
     */
    constructor(args){
        super(args);
        if(args!==undefined){
            this.setElement(args.element);
            this._setEventListeners(args.eventListeners);
        }
        if(this._getEventListeners()===undefined){
            this._setEventListeners([]);
        }
        this.isActive = false;
        this.bindMethods();
    }

    bindMethods(){
        //
    }

    initTempState() {
        super.initTempState();
        this._setEventListeners([]);
    }

    /** Getter and setter that map [controller] to tempState, which means it wont be serialized.*/
    // get controller(){return this._tempState.controller;}
    // set controller(value){this._tempState.controller = value;}
    get controller(){return this._controller;}
    set controller(value){this._controller = value;}

    getController(){return this.controller;}

    /**
    * [event listeners] setter
    * @param eventListener Value to set event listener
    * @param update Whether or not to update listeners
    */
    _setEventListeners(eventListener){this._tempState.eventListeners = eventListener;}
    _getEventListeners(){return this._tempState.eventListeners;}
    addEventListener(type, callback, ...args){
        const interaction = this;
        // const passOptions = options? Object.assign({}, options) : {
        //
        // }
        //
        // var wrapper = function(fn){
        //     return function(event, ...args){
        //         var args = [...arguments].splice(0);
        //         return fn(arg)
        //     }
        // }

        function addListener(){
            interaction.getElement().addEventListener(type, callback, ...args);
        }
        function removeListener(){
            interaction.getElement().removeEventListener(type, callback, args);
        }
        const eventListener = {type:type, activate: addListener, deactivate: removeListener};
        this._getEventListeners().push(eventListener);
        return eventListener;
    }

    addWindowEventListener(type, callback, ...args){
        const interaction = this;
        function addListener(){
            interaction.getWindowElement().addEventListener(type, callback, ...args);
        }
        function removeListener(){
            interaction.getWindowElement().removeEventListener(type, callback, ...args);
        }
        const eventListener = {type:type, activate: addListener, deactivate: removeListener};
        this._getEventListeners().push(eventListener);
        return eventListener;
    }



    elementIsTarget(event){
        // return event.target===this.getElement().getDOMItem();
        const target = event.target;
        const thisElement = this.getElement();
        const domitem = thisElement.getDOMItem();
        const rval = target===domitem;
        return rval;
    }

    getContextElement(){
        return this.getElement().getContext().getElement();
    }

    getEventPositionInContext(event){
        // const svgrect = this.getContextElement().getBoundingClientRect();
        const svgrect = this.getElement().getContext().getElement().getBoundingClientRect();
        return new Vec2(event.clientX-svgrect.left, event.clientY-svgrect.top);
    }

    activate(){
        // if(!this.isActive) {
        this.deactivate();
        for(let eventListener of this._getEventListeners()){
            eventListener.activate();
        }
        this.isActive = true;
        // }
    }

    _deactivateEventListeners(){
        for(let eventListener of this._getEventListeners()){
            eventListener.deactivate();
        }
    }

    clearEventListeners(){
        this._deactivateEventListeners();
        this._setEventListeners([]);
    }

    deactivate(){
        // if(this.isActive){
        this._deactivateEventListeners();
        this.isActive = false;
        // }
    }

    release(args){
        this.deactivate();
        this._setEventListeners([]);
        super.release();
    }


    /**
    * [element] setter
    * @param element Value to set element
    * @param update Whether or not to update listeners
    */
    setElement(element){this._element = element;}
    getElement(){return this._element;}

    getWindowElement(){
        return this.getElement().getWindowElement();
    }

    /** Get set element */
    set element(value){this._element = value;}
    get element(){return this._element;}
}

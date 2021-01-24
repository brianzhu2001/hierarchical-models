import AInteraction from "../amvc/interactions/AInteraction";
import ADragInteraction from "../amvc/interactions/ADragInteraction";
import AObjectNode from "../aobject/AObjectNode";

export default class AWebElement extends AObjectNode{
    constructor(args){
        super(args);
        this._interactions = {};
        if(args!==undefined) {
            this.setInteractions(args.interactions);
        }
        if(args!==undefined) {
            for (let key in args) {
                this[key] = args[key];
            }
        }
    }

    release(args){
        this.deactivateAllInteractions();
        super.release(args)
    }

    /**
    * [element] setter
    * @param element Value to set element
    * @param update Whether or not to update listeners
    */
    setDOMItem(element){this._element = element;}
    getDOMItem(){return this._element;}


    /**
    * [Style] setter
    * @param style Value to set Style
    * @param update Whether or not to update listeners
    */
    setStyle(name, value){this.getDOMItem().style[name]=value;}
    getStyle(name){return this.getDOMItem().style[name];}


    getWindowElement(){
        return AWebElement.WindowElement;
    }

    getBoundingClientRect(){
        return this.getDOMItem().getBoundingClientRect();
    }

    /** Getter and setter that map [context] to tempState, which means it wont be serialized.*/
    get context(){return this._tempState.context;}
    set context(value){this._tempState.context = value;}
    setContext(context){this.context = context;}
    getContext(){return this.context;}

    /**
     *
     * @param type
     * @param callback
     * @param options - a dictionary of options. capture=true will cause events to trigger top-down
     */
    addEventListener(type, callback, ...args){
        this.getDOMItem().addEventListener(type, callback, ...args);
    }

    removeEventListener(type, callback, ...args){
        this.getDOMItem().removeEventListener(type, callback, ...args);
    }

    /**
    * [interactions] setter
    * @param interactions Value to set interactions
    * @param update Whether or not to update listeners
    */
    setInteractions(interactions){
        if(interactions!==undefined){
            for(interaction of interactions){
                this.setInteraction(interaction, interactions[interaction]);
            }
        }
    }
    getInteractions(){return this._interactions;}
    setInteraction(name, value){
        this.getInteractions()[name]=value;
        value.setElement(this);
    }
    getInteraction(name){return this.getInteractions()[name];}
    definesInteraction(name){return (this.getInteraction(name)!==undefined);}
    createInteraction(name, args){
        var iargs = args;
        if(iargs===undefined){
            iargs={name: name};
        }else{
            console.assert(!('name' in args), args);
            iargs = Object.assign(args, {name:name});
        }

        const interaction = new AInteraction(iargs);
        this.setInteraction(name, interaction);
        return interaction;
    }
    createDragInteraction(name, args){
        var iargs = args;
        if(iargs===undefined){
            iargs={name: name};
        }else{
            console.assert(!('name' in args), args);
            iargs = Object.assign(args, {name:name});
        }
        const interaction = new ADragInteraction(iargs);
        this.setInteraction(name, interaction);
        return interaction;
    }

    activateInteraction(name){
        this.getInteraction(name).activate();
    }
    activateAllInteractions(){
        for(let interaction in this.getInteractions()){
            this.activateInteraction(interaction);
        }
    }
    deactivateInteraction(name){
        this.getInteraction(name).deactivate();
    }
    deactivateAllInteractions(){
        for(let interaction in this.getInteractions()){
            this.deactivateInteraction(interaction);
        }
    }

    addSelectInteraction(interactionName = 'select', eventType='click'){
        const self = this;
        const interaction = self.createInteraction(interactionName);
        interaction.addEventListener(eventType, function (event) {
            event.preventDefault();
            self.getView().getController().selectElement({
                model: view.getModel(),
                webelement: webelement,
                event: event
            });
        });
    }

    addClass(className){
        const domitem = this.getDOMItem();
        domitem.classList.add(className);
    }
    removeClass(className){
        const domitem = this.getDOMItem();
        domitem.classList.remove(className);
    }
    getCSSClasses(){
        return this.getDOMItem().classList;
    }

    setCSSClass(className){
        const currentClasses = this.getCSSClasses();
        if(className in currentClasses){
            return;
        }else{
            this.addClass(className);
        }
    }
}

class DocumentElement extends AWebElement{
    getDOMItem(){
        return document;
    }
}

AWebElement.WindowElement = new DocumentElement();

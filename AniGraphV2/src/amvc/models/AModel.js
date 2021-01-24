import AHasModelListeners from "./AHasModelListeners";
import AObject from "../../aobject/AObject";

export default class AModel extends AHasModelListeners{
    /**
     *
     * @param args Arguments that are not listened to (i.e., their setting does not trigger external events).
     * <br>args.modelProperties will be set as model properties. Setting any of the model properties will cause the model to inform its listeners of the change.
     */
    constructor(args) {
        super(args);
    }

    _initPrivate(args) {
        super._initPrivate(args);
        this._modelProperties = {};
        if(args!==undefined) {
            this._initProperties(args.modelProperties);
        }else{
            this._initProperties();
        }
    }

    _initName(args){
        this.name = (args && args.name) ? args.name : this.getUID().slice(0,5);
    }
    /** Get set name */
    set name(value){
        super.name=value;
        this.setProperty('name', value);
    }
    get name(){return super.name;}

    /** Get modelProperties */
    get modelProperties(){return this._modelProperties;}

    afterLoadFromJSON(args) {
        super.afterLoadFromJSON(args);
        this.setProperties(this.getModelProperties());
    }


    release(args){
        this.notifyListeners({
            type: "release",
            args: args
        });
        super.release();
    }

    // _detachSubtree(args){
    //     this.notifyListeners({
    //         type: "detachSubtree",
    //         args: args
    //     });
    //     super._detachNode();
    // }
    //
    // _attachSubtree(args){
    //     this.notifyListeners({
    //         type: "attachSubtree",
    //         args: args
    //     });
    //     super._detachNode();
    // }

    initTempState(args) {
        super.initTempState(args);
        this._tempState.listeners = {};
    }

    /**
     * Initialize the properties of a model. Value in props override values in defaultProps.
     * @param props A dictionary of properties passed to the constructor.
     * @param defaultProps A dictionary default properties and values. There are overwritten by any values present in props.
     * @param update Whether to update listeners. Defaults to true if props is non-empty, and false otherwise.
     */
    _initProperties(props, defaults, update){
        console.assert(this._modelProperties !== undefined, "Tried to call initProperties before model properties array created. Did you call initProperties before super(args, props) in a constructor?");
        if(defaults !== undefined){
            this.setProperties(defaults, false);
        }
        var propsPresent = (typeof props)==="object";
        if((props===undefined) || Object.entries(props).length<1){propsPresent=false};
        this.setProperties(props, propsPresent);
    }

    /**
     * Sets default values for certain properties. This is called after super(args, props) in subclasses. It will only set values for model properties that are currently undefined.
     * @param defaults A dictionary of the default properties and their values.
     * @param update Whether to update listeners. Defaults to false, as the default values are already assumed.
     */
    setDefaultProperties(defaults, update=false){
        var propertyUpdate = {};
        for(let key in defaults){
            if(this.getProperty(key)===undefined){
                propertyUpdate[key]=defaults[key];
            }
        }
        if(Object.entries(propertyUpdate).length>0){
            this.setProperties(propertyUpdate, update);
        }

    }

    /**
     * Get a model property.
     * @param name The name of the model property.
     * @returns The value of the corresponding model property.
     */
    getProperty(name){
        return this._modelProperties[name];
    }

    /**
     * Sets a property of the model. Every time a property is set, it takes on the new value assigned to it and notifies all of its listeners.
     * @param name name of property to update
     * @param value value to assign
     * @param update Whether to notify listeners
     */
    setProperty(name, value, update=true){
        this._modelProperties[name] = value;
        if(update) {
            var passargs = {};
            passargs[name]=value;
            this.notifyListeners({
                type: "setProperties",
                args: passargs
            });
        }
    }

    notifyPropertySet(args){
        this.notifyListeners(Object.assign({type: "setProperties"}, args));
        this.notifyDescendants();
    }

    /**
     * Sets multiple properties at once
     * @param props Dictionary of property names and values to update
     * @param update Whether to notify listeners
     */
    setProperties(props, update=true){
        if(props === undefined){return;}
        // var keys = [];
        // for(let key in props){
        //     this._modelProperties[key]=props[key];
        // }

        Object.assign(this._modelProperties, props);
        if(update){
            this.notifyPropertySet(props);
        }
    }

    getModelProperties(){return this._modelProperties;}


    // setChildren(children){this._children=children;}
    // getChildren(){return this._children;}
    // initChildren(children){
    //     this.setChildren(children);
    //     if(this.getChildren()===undefined){
    //         this.setChildren([]);
    //     }
    // }

    notifyChildAdded(child){
        this.notifyListeners({
            type: 'addChild',
            childModel: child
        })
    }

    addChild(child){
        console.assert(child.getParent() === undefined, {child: child, childparent: child.getParent(), self:this, errorMsg:"tried to add child that already had parent"});
        super.addChild(child);
        this.notifyListeners({
            type: 'addChild',
            childModel: child
        })
    }


    //##################//--SceneGraph mod opps--\\##################
    //<editor-fold desc="SceneGraph mod opps">
    _removeFromParent(){
        super._removeFromParent();
        this.notifyListeners({
            type: '_removeFromParent'
        });
    }

    _attachToNewParent(newParent){
        super._attachToNewParent(newParent);
        this.notifyListeners({
            type: '_attachToNewParent',
            parent: newParent,
        });
    }
    //</editor-fold>
    //##################\\--SceneGraph mod opps--//##################


    //
    // /**
    //  * Add any default parameters to the message
    //  * @param args
    //  */
    // createUpdateMessage(args){
    //     return Object.assign({updater: this}, args);
    // }

    /**
     * Notify listeners that the model has changed. Iterates through a copy of this.listeners to avoid self-removal issues.
     * @param changedProperties properties that have changed
     */
    notifyListeners(args){
        // const listeners = Object.assign({}, this.getListeners());
        const modelMessage = this.createUpdateMessage(args);
        for(let uid in this.getListeners()) {
            this.getListenerByID(uid).onModelUpdate(modelMessage);
        }
    }

    getSummary(){
        const summary = {};
        const details = {
            name:this.name,
            // uid: this.getUID()
        }
        details.properties = this.getModelProperties();
        details.children = [];
        for(let child of this.getChildrenList()){
            details.children.push(child.getSummary());
        }
        summary[this.constructor.name]=details;
        return summary;
    }
}

AObject.RegisterClass(AModel);
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import Vec2 from "../amath/Vec2";
import Vec3 from "../amath/Vec3";
import Matrix3x3 from "../amath/Matrix3x3";

export default class AObject{
    //Base class, gets uid for reference saving
    constructor(args){
        this._AObjectClass=this.className;
        this._uid = (args && args.uid) ? args.uid : uuidv4();
        this.initTempState();
        this._initPrivate(args);
        this._initName(args);
    }

    _initName(args){
        this.name = (args && args.name) ? args.name : this._AObjectClass;
    }

    /**
     * Temp state is not saved and loaded. It is therefore useful to keep track of separately, so it can be initialized
     * after loading.
     */
    initTempState(){
        this._tempState = {};
    }

    /**
     * This function is optionally a way to initialize some private object that is pointed to, holding the actual values of variables
     * e.g., if the setter for name has side effets, you can prepare for that in _initPrivate.
     * @private
     */
    _initPrivate(args){
        //
    }

    /**
     * Ends up being useful to keep track of, even though javascript has garbage collection
     * @param args
     */
    release(args){
        this._AObjectClass=this.constructor.name;
        this.initTempState();
    }

    /** Get set name */
    set name(value){this._name = value;}
    get name(){return this._name;}
    getName(){return this._name;}

    /** Get className */
    get className(){return this.constructor.name;}

    getUID(){
        return this._uid;
    }
    /** Get uid */
    get uid(){return this._uid;}

    derefCopy(aObjecMap){
        const myAObjectMap = aObjectMap ? aObjectMap : {};
        function deref(obj){
            if (typeof obj !== "object" || obj === null) {
                return obj; // Return the value if inObject is not an object
            }
            if(obj && obj._AOBJECTREF){
                return myAObjectMap[obj._AOBJECTREF];
            }
            for (key in obj){
                obj[key] = deref(obj[key]);
            }
            return obj;
        }
        for (key in this) {
            this[key] = deref(this[key]);
        }
    }
    toIndexedJSON(aObjectMap){
        // var myIndexMap = indexMap;
        let myIndexMap = indexMap;
        if(indexMap===undefined){
            myIndexMap = {};
            myIndexMap[this.getUID()]=this;
        }
        var jsonString = JSON.stringify(this, function(key, value){
            if(value._AObjectClass!==undefined){
                if(myIndexMap[value.getUID()]===undefined){
                    myIndexMap[value.getUID()]=value;
                }
                return {_AOBJECT: value.getUID()};
            }
            if(key==='_tempState'){
                return {};
            }
            return value;

        });
        return {
            aObjectMap: myAObjectMap,
            json: jsonString
        }
    }

    //##################//--Serialization--\\##################
    //<editor-fold desc="Serialization">
    afterLoadFromJSON(){
        this.initTempState();
    }

    saveJSON(){
        var jsonString = this.getJSONString();
        var blob = new Blob([jsonString], {type: "application/json"});
        var nownum = Date.now();//.slice(0, 10);
        saveAs(blob, this._AObjectClass+"_"+this.getName()+'_'+String(nownum)+"_"+".json");
    }

    getJSONString(){
        return JSON.stringify(this, function(key, value){
            if(key==='_tempState'){
                return {};
            }else{
                return value;
            }
        }, ' ');
    }



    getIndexCopy(aObjectMap){
        const myAObjectMap = aObjectMap ? aObjectMap : {};
        const deepIndexedCopy = (inObject) => {
            let outObject, value, key
            if (typeof inObject !== "object" || inObject === null) {
                return inObject; // Return the value if inObject is not an object
            }

            if(inObject._AObjectClass!==undefined){
                if(myAObjectMap[inObject.getUID()]===undefined){
                    myAObjectMap[inObject.getUID()]=inObject;
                }
                return {_AOBJECTREF: inObject.getUID()};
            }
            // Create an array or object to hold the values
            outObject = Array.isArray(inObject) ? [] : {}
            for (key in inObject) {
                value = inObject[key]
                // Recursively (deep) copy for nested objects, including arrays
                outObject[key] = deepCopyFunction(value)
            }
            return outObject
        }

        return Object.assign(
            Object.create(
                // Set the prototype of the new object to the prototype of the instance.
                // Used to allow new object behave like class instance.
                Object.getPrototypeOf(this),
            ),
            // Prevent shallow copies of nested structures like arrays, etc
            deepIndexedCopy(this)
        );
    }


    static NewFromObjectDict(o){
        const newobj = Object.assign(new AObject.AObjectClasses[o._AObjectClass](), o);
        newobj.afterLoadFromJSON();
        return newobj;
    }
    static NewFromJSON(jsonText){
        let obj=JSON.parse(jsonText, (key, value)=>{
            function res(v){
                if (typeof v !== "object" || v === null) {
                    return v; // Return the value if inObject is not an object
                }
                if(v && v._AObjectClass){
                    return AObject.NewFromObjectDict(v);
                }
                if(v && v.elements){
                    switch(v.elements.length){
                        case 2:
                            return new Vec2(v.elements);
                            break;
                        case 3:
                            return new Vec3(v.elements);
                            break;
                        case 9:
                            return new Matrix3x3(v.elements);
                            break;
                        default:
                            throw new Error(`Did not know what to do with ${v.elements.length} elements`);
                    }
                }
                for (key in obj){
                    v[key] = res(v[key]);
                }
                return v;
            }
            return res(value);
        });
        var rval = Object.assign(new this.AObjectClasses[obj._AObjectClass](),obj );
        rval.initTempState();
        return rval;
    }
    static AObjectClasses = {'AObject': AObject};
    static RegisterClass(aClass) {
        this.AObjectClasses[aClass.name]=aClass;
    }
    //</editor-fold>
    //##################\\--Serialization--//##################


}

AObject.RegisterClass(AObject);
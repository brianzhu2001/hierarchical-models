

import AObject from "./AObject"
import AModelListener from "../amvc/models/AModelListener";
import AModel from "../amvc/models/AModel";

export default class AObjectHistory extends AObjectNode{
    constructor(args) {
        super(args);
        // map of all the currently included objects, indexed by their uid
        this.objectMap = (args && args.objectMap) ? args.objectMap : {};

        // map of latest indexCopy for each object.
        this.changeMap = (args && args.changeMap) ? args.changeMap : {};


        // history of 'committed' changes
        this.changeHistory = (args && args.changeHistory) ? args.changeHistory : [];

        // count of changes, which can optioanlly be used to kep a finite-length circular array of them (finite memory)
        this.changeCounter = (args && args.changeCounter) ? args.changeCounter : 0;
    }

    /** Get set changeCounter */
    set changeCounter(value){this._changeCounter = value;}
    get changeCounter(){return this._changeCounter;}
    incrementChangeCounter(){this._changeCounter++;}
    /** Get set objectMap */
    set objectMap(value){this._objectMap = value;}
    get objectMap(){return this._objectMap;}
    getObjectMap(){return this.objectMap;}
    getObjectForUID(uid){return this.objectMap[uid];}

    /** Get set object changes */
    set changeMap(value){this._changeMap = value;}
    get changeMap(){return this._changeMap;}
    getChangeMap(){return this._changeMap;}
    onObjectUpdate(args){
        this.changeMap.push(args.updated.getIndexCopy(this.objectMap));
        this.changeCounter = this.changeCounter+1;
    }

    listenToObject(obj){
        throw new Error(`listenToObject is not defined for ${this.constructor.name}`);
    }


    // getLatestVersionOfObjectByUID(uid){
    //     if(this.changeMap[uid]===null){
    //         return this.objectMap[uid];
    //     }
    //     if(this.)
    // }

    addObject(object){
        console.assert(this.getObjectForUID(object.getUID())===undefined, `Tried to add object ${object.name} that was already added`);
        this.objectMap[object.getUID()] = object;
        this.changeMap[object.getUID()] = null;
        this.
        this.listenToObject(object);
    }
    removeObjectFromMap(object){
        delete this.objectMap[object.getUID()];
    }




}
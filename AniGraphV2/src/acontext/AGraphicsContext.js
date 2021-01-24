import AObject from "../aobject/AObject";


export default class AGraphicsContext extends AObject{
    constructor(args) {
        super(args);
        this.setDOMItemDict({});
    }

    release(args){
        for(let key in this.getDOMItemDict()){
            this._domItemDict[key].release();
            this.releaseDOMItem(key);
        }
        super.release(args);

    }
    /**
    * [DOM element] setter
    * @param dOMElement Value to set d o m element
    * @param update Whether or not to update listeners
    */
    setStageElement(element){this._stageElement = element;}
    getStageElement(){return this._stageElement;}

    /**
    * [element] setter
    * @param element Value to set element
    * @param update Whether or not to update listeners
    */
    setElement(element){this._element = element;}
    getElement(){return this._element;}

    setDOMItemDict(elementDict){this._domItemDict = elementDict;}
    getDOMItemDict(){return this._domItemDict;}
    registerDOMItem(element){this.getDOMItemDict()[element.getDOMItem()]=element;}
    releaseDOMItem(domItem){
        this._domItemDict[domItem].release();
        delete this._domItemDict[domItem];
    }

    // /**
    // * [elements] setter
    // * @param element Value to set element
    // * @param update Whether or not to update listeners
    // */
    // setElementDict(elements){
    //     if(this._elements===undefined){
    //         this._elements={};
    //     }
    //     if(elements!==undefined){
    //         for(let elementName in elements){
    //             this.setElement(elementName, elements[elementName]);
    //         }
    //     }
    // }
    // getElementDict(){return this._elements;}
    // setElementForDOMItem(handle, value){
    //     this.getElements()[handle]=value;
    // }
    getElementForDOMItem(handle){return this.getElements()[handle];}


    /**
    * [width] setter
    * @param width Value to set width
    * @param update Whether or not to update listeners
    */
    setWidth(width){this._width = width;}
    getWidth(){return this._width;}

    /**
    * [height] setter
    * @param height Value to set height
    * @param update Whether or not to update listeners
    */
    setHeight(height){this._height = height;}
    getHeight(){return this._height;}

    appendTo(){
        this.setStageElement(arguments[0]);
    }
}
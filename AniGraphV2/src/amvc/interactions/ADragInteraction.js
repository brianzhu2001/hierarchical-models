import AInteraction from "./AInteraction";

export default class ADragInteraction extends AInteraction{

    static Create(args){
        return super.Create(args);
    }


    release(){
        this._removeDragListeners();
        super.release();
    }

    activate(){
        // if(!this.isActive) {
        this._removeDragListeners();
        this._addDragListeners();
        this.mouseDownEventListener.activate();
        this.isActive = true;
        // }
    }

    deactivate(){
        super.deactivate();
        // if(this.isActive){
        //     this._removeDragListeners();
        //     this.isActive = false;
        // }
    }

    setDragStartCallback(dragStartCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['start'] = dragStartCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragStartCallback(){return this._dragCallbacks['start'];}
    setDragMoveCallback(dragMoveCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['move'] = dragMoveCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragMoveCallback(){return this._dragCallbacks['move'];}
    setDragEndCallback(dragEndCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['end'] = dragEndCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragEndCallback(){return this._dragCallbacks['end'];}

    _updateDragListeners(){
        // if(this.isActive){
        this._removeDragListeners();
        // }
        this._addDragListeners();
    }
    _removeDragListeners(){
        // this.getElement().removeEventListener('mousedown', this._dragSetCallback);
        // this.mouseDownEventListener.deactivate();
        this.clearEventListeners();
        // this.setDragStartCallback();
        // this.setDragMoveCallback();
        // this.setDragEndCallback();
    }
    _addDragListeners(){
        if(this._dragSetCallback===undefined){
            this._dragSetCallback=null;
        }
        if(this._dragSetCallback!==null){
            this._removeDragListeners();
        }
        const interaction = this;
        const self = this;

        // function startCallback(){
        //     self.mouseDownEventListener.activate();
        // }
        function dragmovingcallback(event) {
            event.preventDefault();
            interaction.getDragMoveCallback()(event);
        }
        self.mouseMoveEventListener = self.addWindowEventListener('mousemove', dragmovingcallback);


        function dragendcallback(event) {
            event.preventDefault();
            interaction.getDragEndCallback()(event);
            self.mouseMoveEventListener.deactivate();
            // startCallback();
        }
        self.mouseUpEventListener = self.addWindowEventListener('mouseup', dragendcallback, {once: true});


        this._dragSetCallback = function(event){
            // if(!interaction.elementIsTarget(event)){
            //     return;
            // }
            event.preventDefault();
            // rect.getDOMItem().classList.add('isdragging');
            interaction.getDragStartCallback()(event);
            if(!interaction.isEscaped) {
                // element.getWindowElement().addEventListener('mousemove', dragmovingcallback);
                // element.getWindowElement().addEventListener('mouseup', dragendcallback, {once: true});
                self.mouseMoveEventListener.activate();
                self.mouseUpEventListener.activate();
            }
        }

        // startCallback();
        self.mouseDownEventListener = self.addEventListener('mousedown', interaction._dragSetCallback);
    }
}
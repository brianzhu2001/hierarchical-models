import A2DSupplementalController from "./A2DSupplementalController";

export default class ADragSupplementalController extends A2DSupplementalController{

    //##################//--Functions to Customize--\\##################
    //<editor-fold desc="Functions to Customize">
    getViewElement(){
        throw new Error("Must define getViewElement");
        // return this.hostController.getView().shape;
    }

    getPropertyValue(){
        throw new Error("Must define getPropertyValue");
        // this.getModel().getAnchorShift();
    }

    setPropertyValue(value){
        // this.getModel().setAnchorShift(value);
        throw new Error("Must define setPropertyValue");
    }

    dragPropertyValue(valueStart, dragStart, dragCurrent){
        const valueChange = dragCurrent.minus(dragStart);
        this.setPropertyValue(valueStart.plus(valueChange))
    }
    //</editor-fold>
    //##################\\--Functions to Customize--//##################


    initHostViewInteractions(args) {
        super.initHostViewInteractions(args);
        this.addInteractionsToElement(this.getViewElement());
    }

    /**
     * It's good practice to factor out the code that adds interactions to an individual elements.
     * This will make it easier to implement views that dynamically create elements later on.
     * @param element
     */
    addInteractionsToElement(element){
        this.addDragInteraction(element);
    }

    addDragInteraction(graphicElement){
        //Lets create a new drag interaction for our shape called 'drag-translate'
        //we can use the name to activate and deactivate it later
        const dragInteraction = graphicElement.createDragInteraction('drag-translate');

        //add the interaction to the controller right away so we don't forget
        this.addInteraction(dragInteraction);

        // we need to assign an alias to this controller so that we can access it in callbacks.
        // [For mode info on the 'this' variable in Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
        const controller = this;
        const host = this.hostController;
        //define the drag start callback
        dragInteraction.setDragStartCallback(event=>{
            if(!dragInteraction.elementIsTarget(event)){return;}
            event.preventDefault();
            //we can set state related to this interaction in our interaction object
            dragInteraction.dragStartCursorPosition = dragInteraction.getEventPositionInContext(event);
            dragInteraction.dragStartPropertyValue = controller.getPropertyValue();
        });

        //now define a drag move callback
        dragInteraction.setDragMoveCallback(event=> {
            event.preventDefault();
            const newCursorLocation = dragInteraction.getEventPositionInContext(event);
            controller.dragPropertyValue(
                dragInteraction.dragStartPropertyValue,
                dragInteraction.dragStartCursorPosition,
                newCursorLocation
            );
        });

        //we can optionally define a drag end callback
        dragInteraction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return dragInteraction;
    }

}
import A2DSupplementalController from "../A2DSupplementalController";
import Vec2 from "../../../../amath/Vec2";
import A2DVertexHandlesView from "../../../views/supplemental/A2DVertexHandlesView";

export default class A2DShapeVertexEditController extends A2DSupplementalController{
    static ViewClass = A2DVertexHandlesView;

    /**
     * The handle size can be given as an optional parameter.
     * @param args
     */
    constructor(args) {
        super(args);
        this.handleSize = (args && args.handleSize) ? args.handleSize : 8;
    }

    /**
     * We should add interactions to each of the view's handles
     */
    createView(){
        super.createView();
        if(this.getView()) {
            for (let h of this.getView().handles) {
                this.addInteractionsToElement(h);
            }
            // this.detach();
        }
    }

    addInteractionsToElement(element){
        this.addEditHandleInteraction(element);
    }

    addEditHandleInteraction(handle){
        //Lets create a new drag interaction for our handle called 'edit-handle'
        const dragInteraction = handle.createDragInteraction('edit-handle');

        //let's add the interaction to the controller right away
        this.addInteraction(dragInteraction);

        // we should assign an alias to this controller so that we can access it in callbacks.
        const controller = this;

        // Remember that when we create these handles in our view class, we assign an index to each one
        // that index will tell us which vertex to modify when the user moves a handle.
        const handleIndex = handle.handleIndex;

        //define the drag start callback
        dragInteraction.setDragStartCallback(event=>{
            // if(!dragInteraction.elementIsTarget(event)){return;}
            event.preventDefault();
            const model = controller.getModel();
            dragInteraction.dragStartCursorPosition = new Vec2(event.clientX, event.clientY);
            dragInteraction.dragStartPropertyValue = model.getVertices()[handleIndex];
        });

        //now define a drag move callback
        dragInteraction.setDragMoveCallback(event=> {
            event.preventDefault();
            const model = controller.getModel();
            const newCursorLocation = new Vec2(event.clientX, event.clientY);
            const newValue = dragInteraction.dragStartPropertyValue.plus(
                newCursorLocation.minus(
                    dragInteraction.dragStartCursorPosition
                )
            );
            var verts = model.getVertices().slice();
            verts[handleIndex]=newValue;
            model.setVertices(verts);
        });

        //we can optionally define a drag end callback
        dragInteraction.setDragEndCallback(event=>{
            event.preventDefault();
            // controller.getModel().renormalizeVertices();
        });

        //Finally, return the interaction
        return dragInteraction;
    }

    onModelUpdate(args) {
        if(this.getView()) {
            const model = this.getModel();
            const modelVerts = model.getVertices();
            const nOldHandles = this.getView().handles.length;
            const nNewHandles = modelVerts.length - nOldHandles;

            //now we'll update the view and it will potentially create new handles for us to add interactions to.
            var rval = super.onModelUpdate(args);

            // the view will release handles that have been removed from the model, so we need not worry about
            // deactivating them. However, we need to add interactions for any new handles
            if (nNewHandles > 0) {
                for (let j = 0; j < nNewHandles; j++) {
                    var handle = this.getView().handles[nOldHandles + j];
                    this.addInteractionsToElement(handle);
                }
            }
            return rval;
        }
    }
}



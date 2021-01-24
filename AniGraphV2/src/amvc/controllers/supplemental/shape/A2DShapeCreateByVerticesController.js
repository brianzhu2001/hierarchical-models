import Vec2 from "../../../../amath/Vec2";
import ASupplementalComponentController2D from "../ASupplementalComponentController2D";
import AModel2D from "../../../models/AModel2D";

//TODO: change defaultShapeClass to be property of the controller
export default class A2DShapeCreateByVerticesController extends ASupplementalComponentController2D{
    static DefaultModelClass=AModel2D;


    initHostViewInteractions(args) {
        super.initHostViewInteractions(args);
        this.addDragNewShapeInteraction();
    }

    addDragNewShapeInteraction(args){
        const contextElement = this.getContextElement();
        const dragShapeInteraction = contextElement.createDragInteraction('newShape');
        this.addInteraction(dragShapeInteraction);
        
        //<editor-fold desc="Set Aliases">
        const controller=this;
        const host = this.hostController;
        //</editor-fold>
        //define the drag start callback
        dragShapeInteraction.setDragStartCallback(event=>{
            event.preventDefault();
            const svgCursorPos = dragShapeInteraction.getEventPositionInContext(event);
            var newItem = controller.getComponent().itemBeingCreated;
            var newModel = newItem ? newItem.model : undefined;
            // var isCreatingNewShape = controller.getComponent().getIsCreatingNewShape();
            var vertices = [
                new Vec2(svgCursorPos)
            ];
            if(newModel===undefined){
                newModel = new (controller.getNewModelClass())({
                    objectVertices: vertices
                });
                const newController = host.addModelGetChild(newModel);
                controller.getComponent().itemBeingCreated={controller: newController, model: newModel};
                dragShapeInteraction.newModel = newModel;
                dragShapeInteraction.newController = newController;
            }else{
                vertices = newModel.getVertices().slice();
                vertices.push(new Vec2(svgCursorPos))
            }
            dragShapeInteraction.newVertexIndex = vertices.length-1;
            newModel.setVertices(vertices);
        });

        //now define a drag move callback
        dragShapeInteraction.setDragMoveCallback(event=> {
            event.preventDefault();
            const newCursorPosition = dragShapeInteraction.getEventPositionInContext(event);
            let moveVerts = dragShapeInteraction.newModel.getVertices();
            moveVerts[dragShapeInteraction.newVertexIndex]=newCursorPosition;
            dragShapeInteraction.newModel.setVertices(moveVerts);
        });

        //we can optionally define a drag end callback
        dragShapeInteraction.setDragEndCallback(event=>{
            event.preventDefault();
            dragShapeInteraction.newModel.renormalizeVertices(true);
        });
    }


}
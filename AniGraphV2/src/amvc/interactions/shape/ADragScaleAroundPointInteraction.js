import Matrix3x3 from "../../../amath/Matrix3x3";
import Precision from "../../../amath/Precision";
import ADragInteraction from "../ADragInteraction";

export default class ADragScaleAroundPointInteraction extends ADragInteraction{
    /**
     * Creates a drag interaction for scaling the controller's model around a specified point
     * based on the value returned by getValue (in general, we assume these
     * represent the same value, but they need not necessarily).
     * Example args dictionary:
     * ``` javascript
     * args = {
     *     name: 'drag-position',
     *     element: myShape,
     *     controller: myController,
     * }
     * ```
     * @param args
     * @returns {*}
     * @constructor
     */
    static Create(args){
        const interaction = super.Create(args);
        //define the drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            interaction.startCursor = interaction.getEventPositionInContext(event);
            interaction.startTransformOrigin = interaction.getTransformOrigin();
            interaction.TR=Matrix3x3.Translation(interaction.startTransformOrigin).times(
                Matrix3x3.Rotation(interaction.controller.getModel().getRotation())
            );
            interaction.RiTi=interaction.TR.getInverse();
            interaction.startMatrix = interaction.controller.getModel().matrix;
            interaction.startCursorScaleCoords = interaction.RiTi.times(interaction.startCursor);
        });

        //now define a drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            const newCursor = interaction.RiTi.times(interaction.getEventPositionInContext(event));
            const denomX = Precision.signedTiny(interaction.startCursorScaleCoords.x);
            const denomY = Precision.signedTiny(interaction.startCursorScaleCoords.y);
            const rescaleX = Precision.signedTiny(newCursor.x)/denomX;
            const rescaleY = Precision.signedTiny(newCursor.y)/denomY;
            interaction.controller.getModel().setMatrix(interaction.TR.times(
                Matrix3x3.Scale(rescaleX, rescaleY)).times(
                interaction.RiTi
                ).times(interaction.startMatrix)
            );
        });
        //we can optionally define a drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return interaction;
    }

    getTransformOrigin(){
        return new Vec2(0,0);
    }

}
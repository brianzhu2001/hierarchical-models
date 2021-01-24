import {
    Matrix3x3,
    Vec2,
    Precision,
    ADragInteraction,
    ADragValueInteraction
} from "AniGraph"



export class DragToScaleAroundWorldPointInteraction extends ADragInteraction{
    /**
     * Creates a drag interaction for scaling the controller's model around
     * a given point using the value returned by getValue.
     * 
     * Example args:
     * args = {
     *     name: 'drag-position',
     *     element: myShape,
     *     controller: myController
     * }
     * 
     * @param args
     * @returns {*}
     * @constructor
     */
    static Create(args){
        // instantiates the AInteraction subclass to return
        const interaction = super.Create(args);

        // drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            interaction.startCursor = interaction.getEventPositionInContext(event);
            let model = interaction.controller.getModel()
            interaction.startTransformOrigin = model.getWorldPosition()
            interaction.startTransformRotation = model.getRotation()
        });

        // drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            let cursorPos = interaction.getEventPositionInContext(event)
            let pr_inv = Matrix3x3.Rotation(-interaction.startTransformRotation).times(
                Matrix3x3.Translation(-interaction.startTransformOrigin.x, -interaction.startTransformOrigin.y)
            )
            let S_A_p = pr_inv.times(interaction.startCursor)
            let Sp_A_p = pr_inv.times(cursorPos)
            let dx = Sp_A_p.x/S_A_p.x
            let dy = Sp_A_p.y/S_A_p.y
            let model = interaction.controller.getModel()
            let oldscale = model.getScale()
            model.setScale(new Vec2(oldscale.x*dx, oldscale.y*dy))
            interaction.startCursor = interaction.getEventPositionInContext(event);
            interaction.startTransformOrigin = model.getWorldPosition()
            interaction.startTransformRotation = model.getRotation()
        });

        // empty drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        return interaction;
    }

    getTransformOriginInWorldCoordinates(){
        return new Vec2(0,0);
    }
}

export class AIDragToMovePosition extends ADragValueInteraction{
    getValueFunction(){
        return this.controller.getModel().getWorldPosition()
    }
    setValueFunction(value){
        let model = this.controller.getModel()
        model.setPosition(model.getParentSpaceMatrix().getInverse().times(value))
    }
}

export class AIDragToMoveAnchorPoint extends ADragValueInteraction{
    getValueFunction(){
        return this.controller.getModel().getWorldPosition()
    }

    setValueFunction(value){
        this.controller.getModel().setWorldPosition(value)
    }
}

export class AIDragToScaleAroundModelAnchor extends DragToScaleAroundWorldPointInteraction{
    /**
     * We need only redefine our transform origin to get the handle interaction from A1TransformController
     * @returns {*}
     */
    getTransformOriginInWorldCoordinates(){
        return this.controller.getModel().getWorldPosition();
    }
}

export class AIDragToScaleAroundBoundingBoxCenter extends DragToScaleAroundWorldPointInteraction{
    /**
     * We need only redefine our transform origin to get the center of our object's bounding box to implement
     * the handle interaction from our A1TransformCenteredController
     * @returns {Vec3|Vec2|Matrix3x3}
     */
    getTransformOriginInWorldCoordinates(){
        const corners = this.controller.getModel().getWorldSpaceBBoxCorners();
        return corners[0].plus(corners[2]).times(0.5);
    }
}


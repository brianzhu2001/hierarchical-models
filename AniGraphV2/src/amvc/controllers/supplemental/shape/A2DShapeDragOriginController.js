import ADragSupplementalController from "../ADragSupplementalController";

export default class A2DShapeDragOriginController extends ADragSupplementalController{
    /**
     * Specify what view element controller applies to.
     * @returns {*}
     */
    getViewElement(){
        return this.hostController.getView().shape;
    }

    /**
     * Get the value of the property being modified
     * @returns {*}
     */
    getPropertyValue(){
        return this.getModel().getWorldPosition();
    }

    /**
     * Set the value of the property being modified
     * @param value
     */
    setPropertyValue(value){
        this.getModel().setWorldPosition(value);
    }

    /**
     * Simplefied drag function.
     * @param valueStart The starting value of the property being modified
     * @param dragStart the staring coordinates of the drag
     * @param dragCurrent the current coordinates of the drag
     */
    dragPropertyValue(valueStart, dragStart, dragCurrent){
        const valueChange = dragCurrent.minus(dragStart);
        this.setPropertyValue(valueStart.plus(valueChange))
    }
}


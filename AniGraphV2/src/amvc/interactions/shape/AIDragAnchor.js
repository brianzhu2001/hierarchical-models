import ADragValueInteraction from "../ADragValueInteraction";

export default class AIDragAnchor extends ADragValueInteraction{
    // To set the anchor point in world coordinates
    getValueFunction(){
        return this.controller.getModel().getWorldPosition();
    }

    setValueFunction(value){
        this.controller.getModel().setWorldPosition(value, false);
        this.controller.getModel().updateMatrixProperties();
    }
}









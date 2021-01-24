import AIDragScaleAroundPointInteraction from "./ADragScaleAroundPointInteraction";


export default class AIDragScaleAroundAnchor extends AIDragScaleAroundPointInteraction{
    getTransformOrigin(){
        return this.controller.getModel().getWorldPosition();
    }
}
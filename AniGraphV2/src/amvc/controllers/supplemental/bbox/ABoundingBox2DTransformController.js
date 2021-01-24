
import ABoundingBox2DController from "./ABoundingBox2DController";
import AIDragScaleAroundAnchor from "../../../interactions/shape/AIDragScaleAroundAnchor";
import AIDragShapePosition from "../../../interactions/shape/AIDragShapePosition";
import AIDragAnchor from "../../../interactions/shape/AIDragAnchor";
import AIClickShape from "../../../interactions/shape/AIClickShape";

export default class ABoundingBox2DTransformController extends ABoundingBox2DController{
    static DefaultHandleInteractionClasses=[AIDragScaleAroundAnchor];
    static DefaultAnchorInteractionClasses=[AIDragAnchor];
    static DefaultGroupBoxInteractionClasses=[AIDragShapePosition];
    static DefaultHostViewInteractionClasses = [AIDragShapePosition, AIClickShape];

    clickShape(args){
        console.log("CLICK!");
        console.log(args);
    }
}
import AObjectHistory from "../../aobject/AObjectHistory";
import ModelListener from "./AModelListener";

@ModelListener()
export default class AModelHistory extends AObjectHistory{
    onModelUpdate(args){
        return this.onObjectUpdate(args);
    }

    listenToObject(obj) {
        obj.setListener(this);
    }
}



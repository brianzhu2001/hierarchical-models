import A2DSupplementalController from "../A2DSupplementalController";
import A2DBoundingBoxView from "../../../views/supplemental/A2DBoundingBoxView";


export default class ABoundingBox2DController extends A2DSupplementalController{
    static ViewClass = A2DBoundingBoxView;
    static DefaultHandleInteractionClasses=[];
    static DefaultAnchorInteractionClasses=[];
    static DefaultBoundingBoxEdgeInteractionClasses=[];
    static DefaultGroupBoxInteractionClasses=[];


    constructor(args) {
        super(args);
        this._renderBox=true;
        this.handleInteractionClasses = (args && args.handleInteractionClasses)? args.handleInteractionClasses : this.constructor.DefaultHandleInteractionClasses;
        this.anchorInteractionClasses = (args && args.anchorInteractionClasses)? args.anchorInteractionClasses : this.constructor.DefaultAnchorInteractionClasses;
        this.boundingBoxEdgeInteractionClasses = (args && args.boundingBoxEdgeInteractionClasses)? args.boundingBoxEdgeInteractionClasses : this.constructor.DefaultBoundingBoxEdgeInteractionClasses;
        this.groupBoxInteractionClasses = (args && args.groupBoxInteractionClasses)? args.groupBoxInteractionClasses : this.constructor.DefaultGroupBoxInteractionClasses;
        const self = this;
        // this._componentManagesBBox=true;
        this._componentManagesBBox= (args && args.componentManagesBBox)? args.componentManagesBBox : true;
        if(this._componentManagesBBox) {
            this.getBoundingBoxCorners = (args && args.getBoundingBoxCorners) ? args.getBoundingBoxCorners : (m => {
                return self.getComponent().getWorldSpaceBBoxCornersForSelection();
            });
        }else{
            this.getBoundingBoxCorners = (args && args.getBoundingBoxCorners) ? args.getBoundingBoxCorners : (m => {
                return self.getModel().getWorldSpaceBBoxCorners();
            });
        }
    }

    createView(){
        super.createView();
    }

    _getBoundingBoxCorners(){
        return this.getBoundingBoxCornersFromModel(this.getModel());
    }

    addInteractionsToView(){
        for (let h of this.getView().handles) {
            this.addInteractionsToHandle(h);
        }
        if(this.getView().boxLines) {
            for (let ln of this.getView().boxLines) {
                this.addInteractionsToBoundingBoxEdge(ln);
            }
        }
        if(this.getModel().isModelGroup) {
            this.addInteractionsToGroupBox(this.getView().box);
        }
        this.addInteractionsToAnchor(this.getView().anchor);
        // for(this.hostController.get)
    //    TODO: for each element in hostController's view, add the

    }

    addInteractionsToHandle(handle){
        for (let iclass of this.handleInteractionClasses) {
            iclass.Create({
                element: handle,
                controller: this
            })
        }
    }

    addInteractionsToBoundingBoxEdge(element){
        for (let iclass of this.boundingBoxEdgeInteractionClasses) {
            iclass.Create({
                element: element,
                controller: this
            })
        }
    }

    addInteractionsToGroupBox(box){
        for (let iclass of this.groupBoxInteractionClasses) {
            iclass.Create({
                element: box,
                controller: this
            })
        }
    }
    addInteractionsToAnchor(anchor){
        for (let iclass of this.anchorInteractionClasses) {
            iclass.Create({
                element: anchor,
                controller: this
            })
        }
    }

    onModelUpdate(args) {
        super.onModelUpdate(args);
    }
}
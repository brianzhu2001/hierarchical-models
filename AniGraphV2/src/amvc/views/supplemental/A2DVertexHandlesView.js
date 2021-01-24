import AView2D from "../AView2D";
import Vec2 from "../../../amath/Vec2";

export default class A2DVertexHandlesView extends AView2D{
    constructor(args) {
        super(args);
        this.handleSize = (args && args.handleSize) ? args.handleSize : 8;
    }

    getHandleVerts(location, sideLength){
        return [new Vec2(location.x-sideLength*0.5, location.y-sideLength*0.5),
            new Vec2(location.x-sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y-sideLength*0.5)];
    }

    createHandle(location, handleIndex, sideLength=8){
        const context = this.getGraphicsContext();
        const handleVerts = this.getHandleVerts(location, sideLength);
        const handle = context.makePath(handleVerts);
        const color = '#aaaaaa';
        handle.setAttributes({
            fill: color,
            opacity: 1.0,
            stroke: 'black'
        });
        handle.handleIndex = handleIndex;
        this.addGraphic(handle);
        // this.getController().addInteractionsToElement(handle);
        handle.addClass('shapehandle');
        return handle;
    }

    initGraphics() {
        super.initGraphics();
        const context = this.getGraphicsContext();
        var verts;
        if(this.getModel()!==undefined) {
            verts = this.getModel().getVertices();
        }else{
            verts = this.getHandleVerts(new Vec2(0,0), 10);
        }
        this.handles = [];
        for(let i=0;i<verts.length;i++){
            var handle = this.createHandle(verts[i], i);
            this.handles.push(handle);
        }
    }



    onModelUpdate(args) {
        const model = this.getController().getModel();
        const modelVerts = model.getVertices();
        const nOldHandles = this.handles.length;
        const nNewHandles = modelVerts.length-nOldHandles;
        if(nNewHandles<0) {
            var toremove = this.handles.splice(modelVerts.length);
            for(let hr of toremove){
                hr.release();
            }
            // for(let k=0;k<(-nNewHandles);k++){
            //     this.handles[nOldHandles-(k+1)].hide();
            // }
        }else if(nNewHandles>0){
            for(let j=0;j<nNewHandles;j++){
                var handle = this.createHandle(modelVerts[nOldHandles+j], nOldHandles+j);
                this.handles.push(handle);
            }
        }
        for(let i=0; i<modelVerts.length; i++){
            this.handles[i].setVertices(this.getHandleVerts(modelVerts[i], this.handleSize))
        //     this.handles[i].show();
        }
        return super.onModelUpdate(args);
    }

}
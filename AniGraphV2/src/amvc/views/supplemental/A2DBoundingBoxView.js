import AView2D from "../AView2D";
import Vec2 from "../../../amath/Vec2";

export default class A2DBoundingBoxView extends AView2D{
    constructor(args) {
        super(args);
        this.handleSize = (args && args.handleSize) ? args.handleSize : 10;
        this.anchorInnerRadius = (args && args.anchorInnerRadius) ? args.anchorInnerRadius : 4;
        this.anchorOuterRadius = (args && args.anchorOuterRadius) ? args.anchorOuterRadius : 30;
        this.boxThickness = (args && args.boxThickness) ? args.boxThickness : 3;
    }

    /** Get set isGroupBound */
    get isGroupBound(){return this.getController().getModel().isModelGroup;}

    getHandleVerts(location, handleSize){
        const sideLength = (handleSize!==undefined)? handleSize : this.handleSize;
        return [new Vec2(location.x-sideLength*0.5, location.y-sideLength*0.5),
            new Vec2(location.x-sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y-sideLength*0.5)];
    }

    /**
     * returns xy, Xy, XY, xY
     * @param minXminY
     * @param maxXmaxY
     * @returns {Vec2[]}
     */
    getBoxVerts(corners){
        return [
            corners[0].dup(),
            corners[1].dup(),
            corners[2].dup(),
            corners[3].dup()
        ];

    }

    getAnchorVerts(location, outerRadius, innerRadius){
        const myOuterRadius = (outerRadius!==undefined)? outerRadius : this.anchorOuterRadius;
        const myInnerRadius = (innerRadius!==undefined)? innerRadius : this.anchorInnerRadius;
        const verts = [
            new Vec2(myInnerRadius,myInnerRadius),
            new Vec2(0,myOuterRadius),
            new Vec2(-myInnerRadius,myInnerRadius),
            new Vec2(-myOuterRadius,0),
            new Vec2(-myInnerRadius,-myInnerRadius),
            new Vec2(0,-myOuterRadius),
            new Vec2(myInnerRadius,-myInnerRadius),
            new Vec2(myOuterRadius,0)
        ];
        return verts.map(v=>{
            return v.plus(location);
        });

    }

    createHandle(location, handleIndex, handleSize){
        const sideLength = (handleSize!==undefined)? handleSize : this.handleSize;
        const context = this.getGraphicsContext();
        const handleVerts = this.getHandleVerts(location, sideLength);
        const handle = context.makePath(handleVerts);
        const color = '#aaaaaa';
        handle.setAttributes({
            fill: color,
            opacity: 0.8,
            stroke: 'black'
        });
        handle.handleIndex = handleIndex;
        handle.setStyle('cursor', 'grab');
        handle.addClass('shape-handle');
        handle.location = location;
        this.addGraphic(handle);
        // this.getController().addInteractionsToElement(handle);
        return handle;
    }


    getAxesVerts(corners){
        const mxy = corners[0];
        const mXY = corners[2];
        const cxy = new Vec2(mxy.x+mXY.x, mxy.y+mXY.y).times(0.5);
        return [
            new Vec2(mxy.x,cxy.y),
            new Vec2(mXY.x,cxy.y),
            new Vec2(cxy.x, mxy.y),
            new Vec2(cxy.x, mXY.y)
        ];
    }

    createAxes(corners){
        const context = this.getGraphicsContext();
        const averts = this.getAxesVerts(corners);
        const xaxis = context.makePath([averts[0],averts[1]], false);
        const yaxis = context.makePath([averts[2],averts[3]], false);
        xaxis.setAttributes({
            opacity: 0.2,
            linewidth: 1,
            stroke: '#558855',
            dashes: [1, 1]
        });
        yaxis.setAttributes({
            opacity: 0.2,
            linewidth: 1,
            stroke: '#885555',
            dashes: [1, 1]
        });
        xaxis.setStyle('pointer-events', 'none');
        xaxis.addClass('obj-xaxis');
        yaxis.setStyle('pointer-events', 'none');
        yaxis.addClass('obj-yaxis');
        this.addGraphic(xaxis);
        this.addGraphic(yaxis);
        return {xaxis:xaxis, yaxis:yaxis};


    }

    createBox(corners, linewidth){
        const boxThickness = (linewidth!==undefined)? linewidth : this.boxThickness;
        const context = this.getGraphicsContext();
        const boxVerts = this.getBoxVerts(corners);
        const box = context.makePath(boxVerts, false);

        box.setAttributes({
            linewidth: boxThickness,
            stroke: '#aaaaaa',
            dashes: [2*boxThickness, 2*boxThickness],
            fill: 'rgba(0,0,0,0)'
        });
        // box.noFill();
        // box.setStyle('pointer-events', 'stroke');
        // box.setStyle('cursor', 'nwse-resize');
        // this.getController().addInteractionsToElement(handle);
        box.addClass('shape-bounding-box');
        this.addGraphic(box);
        return box;
    }

    /** Get set topBoxLine */
    set topBoxLine(value){this.boxLines[0] = value;}
    get topBoxLine(){return this.boxLines[0];}
    /** Get set bottomBoxLine */
    set bottomBoxLine(value){this.boxLines[1] = value;}
    get bottomBoxLine(){return this.boxLines[1];}

    /** Get set leftBoxLine */
    set leftBoxLine(value){this.boxLines[2] = value;}
    get leftBoxLine(){return this.boxLines[2];}

    /** Get set rightBoxLine */
    set rightBoxLine(value){this.boxLines[3] = value;}
    get rightBoxLine(){return this.boxLines[3];}

    setBoxLineAttributes(attributes){
        for (let boxLine of this.boxLines) {
            boxLine.setAttributes(attributes);
        }
    }

    createBoxLines(corners){
        const context = this.getGraphicsContext();
        this.boxLines = [null, null, null, null];
        this.bottomBoxLine = context.makePath([
            corners[0],
            corners[1]
        ]);
        this.bottomBoxLine.addClass('boxline');

        this.topBoxLine= context.makePath([
            corners[2],
            corners[3]
        ]);
        this.topBoxLine.addClass('boxline');

        this.leftBoxLine= context.makePath([
            corners[3],
            corners[0]
        ]);
        this.leftBoxLine.addClass('boxline');

        this.rightBoxLine=context.makePath([
            corners[1],
            corners[2]
        ]);
        this.rightBoxLine.addClass('boxline');

        this.addGraphic(this.boxLines[0]);
        this.addGraphic(this.boxLines[1]);
        this.addGraphic(this.boxLines[2]);
        this.addGraphic(this.boxLines[3]);
        this.updateBoxLines(corners);
        return this.boxLines;
    }

    updateBoxLines(corners){
        this.bottomBoxLine.setVertices([
            corners[0],
            corners[1]
        ]);
        this.topBoxLine.setVertices([
            corners[2],
            corners[3]
        ]);
        this.leftBoxLine.setVertices([
            corners[3],
            corners[0]
        ]);
        this.rightBoxLine.setVertices([
            corners[1],
            corners[2]
        ]);


        const hcursor = 'ns-resize';
        const hclass = 'h-bounding-box';
        this.topBoxLine.setStyle('cursor', hcursor);
        this.topBoxLine.addClass(hclass);
        this.bottomBoxLine.setStyle('cursor', hcursor);
        this.bottomBoxLine.addClass(hclass);

        const vcursor = 'ew-resize';
        const vclass = 'v-bounding-box';
        this.leftBoxLine.setStyle('cursor', vcursor);
        this.leftBoxLine.addClass(vclass);
        this.rightBoxLine.setStyle('cursor', vcursor);
        this.rightBoxLine.addClass(vclass);

        const boxThickness =3;
        const attributes = {
            opacity: 1.0,
            linewidth: boxThickness,
            stroke: '#aaaaaa',
            dashes: [10, 10]
        };
        this.setBoxLineAttributes(attributes);
    }


    createAnchor(location, outerRadius=50, innerRadius=3){
        const context = this.getGraphicsContext();
        const verts = this.getAnchorVerts(location, outerRadius, innerRadius);
        const element = context.makePath(verts, true);
        element.setAttributes({
            opacity: 0.25,
            linewidth: 3,
            fill: 'black',
            stroke: '#FFFFFF',
        });
        element.setStyle('cursor', 'all-scroll');
        this.addGraphic(element);
        element.addClass('shape-anchor');
        return element;
    }

    getCorners(){
        return this.getController() && this.getController().getBoundingBoxCorners()? this.getController().getBoundingBoxCorners() : [
            new Vec2(-100,-100),
            new Vec2(-99,-100),
            new Vec2(-99,-99),
            new Vec2(-100,-99)
        ];
    }

    initViewElements(){

        const corners = this.getCorners();
        const model = this.getController().getModel();
        const anchor = model.getWorldPosition();

        // const axes = this.createAxes(corners);
        // this.xaxis = axes.xaxis;
        // this.yaxis = axes.yaxis;
        if(this.isGroupBound) {
            this.box = this.createBox(corners);
        }
        this.createBoxLines(corners);

        this.anchor = this.createAnchor(anchor);
        this.handles = [];
        this.handles.push(this.createHandle(corners[0], 0));
        this.handles.push(this.createHandle(corners[1], 1));
        this.handles.push(this.createHandle(corners[2], 2));
        this.handles.push(this.createHandle(corners[3], 3));
    }

    initGraphics() {
        super.initGraphics();
    }

    updateViewElements(){
        const model = this.getController().getModel();
        // const corners = this.getModel()? this.getModel().calcWorldSpaceBBoxCorners() : [
        const corners = this.getCorners();

        // this.updateAxes(corners);
        if(this.isGroupBound) {
            this.updateBox(corners);
        }
        this.updateBoxLines(corners);

        this.updateAnchor();
        this.updateHandles(corners);
    }

    updateAxes(corners){
        const averts = this.getAxesVerts(corners);
        this.xaxis.setVertices(averts.slice(0,2));
        this.yaxis.setVertices(averts.slice(2));
    }

    updateBox(corners){
        this.box.setVertices(this.getBoxVerts(corners));
    }

    updateAnchor(){
        const anchor = this.getModel().getWorldPosition();
        this.anchor.setVertices(this.getAnchorVerts(anchor));
    }

    updateHandles(corners){
        for(let c=0;c<corners.length;c++){
            this.handles[c].setVertices(this.getHandleVerts(corners[c]));
            // this,handles[c].handleIndex = c;c
        }
    }

    onModelUpdate(args) {
        super.onModelUpdate(args);
    }

}
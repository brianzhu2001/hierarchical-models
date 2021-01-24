import AGraphicsContext from "./AGraphicsContext";
import ASVGElement from "../aweb/svg/ASVGElement";
import ASVGGroup from "../aweb/svg/ASVGGroup";
import AWebElement from "../aweb/AWebElement";


export default class AGraphicsContext2D extends AGraphicsContext{
    constructor(args){
        super(args);
        const passArgs = args ? args : {};
        passArgs.type = Two.Types['svg'];
        this.two = new Two(passArgs);
        this.two.scene.id = 'anigraph-root-group';
            this._rootGroup = new ASVGGroup({
            twoJSObject: this.two.scene,
        });
        this.rootGroup.setContext(this);
        this.registerDOMItem(this.rootGroup);
    }

    /** Get set sceneRootGroup */
    // set sceneRootGroup(value){this._sceneRootGroup = new ASVGGroup();}
    // get sceneRootGroup(){return this._sceneRootGroup;}

    /** Get set rootGroup */
    get rootGroup(){return this._rootGroup;}

    setWidth(width){this.two.width = width;}
    getWidth(){return this.two.width;}
    setHeight(height){this.two.height = height;}
    getHeight(){return this.two.height;}

    makeElement(twoJSObject) {
        const graphic =  new ASVGElement({
            twoJSObject: twoJSObject,
        });
        graphic.setContext(this);

        this.update();
        // graphic.setTwoJSShape(twoJSShape);
        // graphic.context = this;
        this.registerDOMItem(graphic);
        return graphic;
    }

    makeGroup(){
        const group = new ASVGGroup({
                twoJSObject: this.two.makeGroup(...arguments),
                context: this,
            }
        );
        this.registerDOMItem(group);
        return group;
        // return this.two.makeGroup(...arguments);
    }

    makeRectangle(x,y, width, height){
        const graphic = this.makeElement(
            this.two.makePath(
                [new Two.Anchor(x-width*0.5, y-height*0.5),
                new Two.Anchor(x-width*0.5, y+height*0.5),
                new Two.Anchor(x+width*0.5, y+height*0.5),
                new Two.Anchor(x+width*0.5, y-height*0.5)],
                false
            )
        );
        return graphic;
    }

    makePath(verts){
        const graphic = this.makeElement(
            this.two.makePath(verts.map(v=> new Two.Anchor(v.x, v.y)))
        );
        return graphic;
    }

    makeCircle(x,y,radius){
        const graphic = this.makeElement(this.two.makeEllipse(x,y, radius*2, radius*2));
        return graphic;
    }

    makeEllipse(){
        const graphic = this.makeGraphic(this.two.makeEllipse(...arguments));
        return graphic;
    }

    update(){
        const two = this.two;
        two.update(...arguments);
    }

    appendTo(){
        super.appendTo(...arguments);
        this.two.appendTo(...arguments);
        this.update();
        const contextElement = new AWebElement({
            context: this
        });
        contextElement.setDOMItem(this.two.renderer.domElement);
        this.setElement(contextElement);
    }

    getDOMItem() {
    }

    getSVGDOMItem(){
        return this.two.renderer.domElement;
    }

    saveSVG(){
        console.log("Saving SVG...");
        var svgData = this.getSVGDOMItem().outerHTML;
        var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "AGraphicsContext2D_SVG.svg";
        downloadLink.click();
    }
}
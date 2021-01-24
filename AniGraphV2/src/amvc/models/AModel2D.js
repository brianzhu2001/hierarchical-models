import AModel from "./AModel";
import Vec2 from "../../amath/Vec2";
import Vec3 from "../../amath/Vec3";
import Matrix3x3 from "../../amath/Matrix3x3";
import AObject from "../../aobject/AObject";
import Precision from "../../amath/Precision";

/**
 * Class represents a 2D graphical element. Extends the AModel class, which has properties and listeners.
 * This will be the base class for creating your own elements.
 */
export default class AModel2D extends AModel{
    //##################//--Getters & Setters--\\##################
    //<editor-fold desc="Getters & Setters">
    set matrix(value){this.modelProperties.matrix = value;}
    get matrix(){return this.modelProperties.matrix;}
    set objectVertices(value){this.setProperty('objectVertices', value);}
    get objectVertices(){return this._modelProperties['objectVertices'];}

    /**
     * This is only correct for A1 style situations where models are not in a hierarchy. Students need to extend this for A2.
     * @returns {*}
     */
    getObjectToWorldMatrix(){
        return this.matrix;
    }
    getWorldToObjectMatrix(){return this.getObjectToWorldMatrix().getInverse();}
    /** Get set objectSpaceBounds */
    get objectSpaceBounds(){return [this.objectSpaceCorners[0], this.objectSpaceCorners[2]];}

    /** Get set attributes */
    set attributes(value){this._modelProperties['attributes'] = value;}
    get attributes(){return this._modelProperties['attributes'];}

    /***/
    set objectSpaceCorners(value){this._objectSpaceCorners = value;}
    get objectSpaceCorners(){return this._objectSpaceCorners;}
    //</editor-fold>
    //##################\\--Getters & Setters--//##################


    /**
     * Default properties include:
     * @param args An object containing the properties:
     * <p><b> position </b>: the center of the graphic's coordinate system.</p>
     * <p><b> position </b>: the position of the graphic relative to its parent's coordinate system.</p>
     * <p><b> scale </b>: the scale of the graphic's coordinate system</p>
     * <p><b> rotation </b>: the rotation of the graphic's coordinate system</p>
     * @returns GraphicElement2D object
     */
    constructor(args) {
        super(args);
        // this._modelProperties will be filled with defaults from super class and populated with
        // anything in arge.modelProperties

        const verts = [];

        const defaultProps = {
            matrix: new Matrix3x3(),
            position: new Vec2(0,0),
            anchorshift: new Vec2(0,0),
            scale: new Vec2(1,1),
            rotation: 0,
            objectVertices: verts,
            attributes: {
                fill: '#9ECFFF',
                opacity: 1.0,
                stroke: '#000000',
                linewidth: 2
            }
        }
        // update any defaults not set explicitly with arguments
        this.setDefaultProperties(defaultProps);
        this.matrix = Matrix3x3.Identity();
        this.objectSpaceCorners = [];
        this.initModel(args);
    }

    initModel(args){
        //set any props based on args that aren't in args.modelProperties here
    }

    /**
     * In case anything needs to be recalculated or reinitialized after loading from a serialized representation
     * @param args
     */
    afterLoadFromJSON(args) {
        super.afterLoadFromJSON(args);
        this.setAttributes(this.getAttributes());
    }

    //##################//--The Object Matric--\\##################
    //<editor-fold desc="The Object Matric">
    setMatrix(value){
        this.setProperty('matrix', value);
        this.updateMatrixProperties();
    }

    setMatrixAndPosition(matrix, position){
        this.setPosition(position, false);
        this.setMatrix(matrix);
    }


    /**
     * Set the current matrix based on the current matrix properties.
     * This will be called when a matrix property is set directly.
     * It should take the current matrix properties and set the current matrix
     * based on those properties.
     */
    updateMatrix(){
        this.matrix = Matrix3x3.FromProperties({
            position: this.getPosition(),
            rotation: this.getRotation(),
            scale: this.getScale(),
            anchorshift: this.getAnchorShift()
        });
    }

    /**
     * Set the matrix properties based on the current matrix.
     * This will be called after the matrix is changed directly,
     * so you can assume that the matrix is accurate and the matrix properties
     * should be updated to reflect the current matrix.
     * The same matrix could be the result of different combinations of
     * anchor and position, or of scale and rotation, so by default we will assume that the
     * position property is accurate and only uodate anchor shift.
     * Similarly, we will assume that the current value of rotation is correct by default,
     * though we can override this wirth an additional argument, in which case rotation will
     * be calculated using atan2.
     */
    updateMatrixProperties(updateRotation = true){
        const ex = new Vec3(1,0,0);
        const ey = new Vec3(0,1,0);

        if(updateRotation) {
            const Mex = this.matrix.times(ex);
            this.setRotation(Math.atan2(Mex.y, Mex.x), false);
        }
        const noRo = Matrix3x3.Rotation(-this.getRotation()).times(this.matrix);
        const scaleX = noRo.times(ex);
        const scaleY = noRo.times(ey);
        this.setScale(new Vec2(Precision.signedTiny(scaleX.x), Precision.signedTiny(scaleY.y)), false);

        var ORSinv = Matrix3x3.Translation(this.getPosition()).times(
            Matrix3x3.Rotation(this.getRotation()).times(
                Matrix3x3.Scale(this.getScale())
            )
        ).getInverse();

        if(ORSinv===null){
            console.warn("tried to compute inverse when determinant was zero");
        }

        const anchorM = ORSinv.times(this.matrix);
        const anchor = anchorM.times(new Vec2(0,0));

        this.setAnchorShift(anchor, false);
        this.notifyPropertySet();
    }


    /**
     * Set one of the matrix properties, update the object matrix, and notify listeners
     * @param name
     * @param value
     * @param update
     */
    setMatrixProperty(name, value, update=true){
        this.modelProperties[name] = value;
        if(update) {
            this.updateMatrix();
            this.notifyPropertySet({name: value});
        }
    }

    /**
     * AModel property [position] setter
     * @param position Value to set position
     * @param update Whether or not to update listeners
     */
    setPosition(position, update=true){
        this.setMatrixProperty('position', position, update);
    }
    getPosition(){return this.getProperty('position');}

    /**
     * AModel property [anchor] setter
     * @param shift Value to set anchor shift to (Vec2)
     * @param update Whether or not to update listeners
     */
    setAnchorShift(anchor, update=true){
        this.setMatrixProperty('anchorshift', anchor, update);
    }
    getAnchorShift(){return this.getProperty('anchorshift');}

    /**
     * AModel property [scale] setter
     * @param scale Value to set scale
     * @param update Whether or not to update listeners
     */
    setScale(scale, update=true){
        if(Array.isArray(scale)){
            this.setMatrixProperty('scale', scale, update);
            return;
        }
        if(scale.elements){
            this.setMatrixProperty('scale', scale, update);
            return;
        }
        if(typeof scale == 'number'){
            this.setMatrixProperty('scale', new Vec2(scale, scale), update);
            return;
        }
        this.setMatrixProperty('scale', scale, update);
    }
    getScale(scale){return this.getProperty('scale');}

    /**
     * AModel property [rotation] setter in radians
     * @param rotation Value to set rotation in radians
     * @param update Whether or not to update listeners
     */
    setRotation(rotation, update=true){
        this.setMatrixProperty('rotation', rotation, update);
    }
    getRotation(rotation){return this.getProperty('rotation');}

    /**
     * AModel property [rotation] setter in degrees
     * @param rotation Value in degrees to set rotation
     * @param update Whether or not to update listeners
     */
    setRotationDegrees(rotation, update=true){
        this.setRotation(rotation*Math.PI/180, update);
    }
    getRotationDegrees(rotation){return this.getRotation()*180/Math.PI;}


    /**
     * This is only correct in A1-Style situations where everything is a direct child of the root node and the root node
     * has the identity matrix.
     * @param position
     * @param update
     */
    setWorldPosition(position, update=true){
        this.setMatrixProperty('position', position, update);
    }


    /**
     * This is only correct in A1-Style situations where everything is a direct child of the root node and the root node
     * has the identity matrix.
     * @returns {*}
     */
    getWorldPosition(){
        return this.getProperty('position');
    }

    getAnchorMatrix(){
        //Anchor matrix is PRSA.times(A.getInverse());
        return this.matrix.times(Matrix3x3.Translation(this.getAnchorShift().times(-1)));
    }


    //</editor-fold>
    //##################\\--The Object Matric--//##################

    //##################//--Vertices--\\##################
    //<editor-fold desc="Vertices">
    /** Get set vertices */
    getVertices() {
        if(this.objectVertices){
            return this.getObjectToWorldMatrix().applyToPoints(this.objectVertices);
        }
    }
    /**
     * setVertices should take vertices in world coordinates and use them to set geometry in object coordinates.
     * Transform the provided vertices into object coordinates, and assign objectVertices to these transformed values.
     * Update the objectSpaceCorners for our object (since we're changing the geometry, the bounds of that geometry might change).
     * @param value
     */
    setVertices(value) {
        const mat=this.getWorldToObjectMatrix();
        const point0 = Matrix3x3.Multiply(mat, value[0]);
        const bounds = [point0.dup(),point0.dup()];
        this.objectVertices = value.map(vi=>{
            var v = mat.times(vi);
            for(let d=0;d<point0.elements.length;d++){
                if(v.elements[d]<bounds[0].elements[d]){
                    bounds[0].elements[d]=v.elements[d];
                }
                if(v.elements[d]>bounds[1].elements[d]){
                    bounds[1].elements[d]=v.elements[d];
                }
            }
            return v;
        });
        this.objectSpaceCorners = [
            bounds[0],
            new Vec2(bounds[1].x, bounds[0].y),
            bounds[1],
            new Vec2(bounds[0].x, bounds[1].y)
        ];
    }

    //</editor-fold>
    //##################\\--Vertices--//##################

    //##################//--Object Bounds--\\##################
    //<editor-fold desc="Object Bounds">

    /* setter for objectSpaceCorners, a list of Vec2 for the 4 corners of the object's bounding box.
     * Should be in the form:
     * [Vec2(minX, minY),
     * Vec2(maxX, minY),
     * Vec2(maxX, maxY),
     * Vec2(minX, maxY)]
     */
    setObjectSpaceCorners(vertList){
        this.objectSpaceCorners=vertList;
    }

    getWorldSpaceBBoxCorners(){
        return this.getObjectToWorldMatrix().applyToPoints(this.objectSpaceCorners);
    }

    _calcWorldSpaceBBoxCorners(){
        const wbounds = this._calcWorldBounds();
        return [wbounds[0], new Vec2(wbounds[1].x, wbounds[0].y), wbounds[1], new Vec2(wbounds[0].x, wbounds[1].y)];
    }
    _calcWorldBounds(){
        return Vec2.GetPointBounds(this.getVertices());
    }


    //</editor-fold>
    //##################\\--Object Bounds--//##################


    //##################//--Attributes--\\##################
    //<editor-fold desc="Attributes">
    /**
     * Get an SVG attribute. These have significant overlap with CSS properties.
     * @param name
     * @returns {*}
     */
    getAttribute(name){
        return this.attributes[name];
    }

    /**
     * Set an SVG attribute. These have significant overlap with CSS properties
     * @param name
     * @param value
     */
    setAttribute(name, value, update=true){
        this.attributes[name]=value;
        if(update){
            var passargs = {};
            passargs[name]=value;
            this.notifyListeners({
                type: "setAttributes",
                args: passargs
            });
        }
    }

    getAttributes(){
        return this.attributes;
    }

    /**
     * Set multiple attributes at once using a dictionary
     * @param attrs - a dictionary of attributes
     * @param update - whether to update listeners
     */
    setAttributes(attrs, update){

        if(attrs === undefined){return;}
        this.attributes = Object.assign(this.attributes, attrs);
        if(update){
            this.notifyListeners({
                type: "setAttributes",
                args: attrs
            });
        }

    }

    //</editor-fold>
    //##################\\--Attributes--//##################

    /**
     * Renormalize vertices should:
     * - translate and scale the model's objectVertices so that their bounding box is the -0.5,0,5 box.
     * - adjust the model's matrix so that the return value of getVertices is not changes by the anchor/scaling.
     * - adjust the models
     * - call updateMatrixProperties() to update matrix properties to reflect the new matrix.
     *
     * If the centerOrigin argument is true, this will reset the position to the center of the object's bounding box,
     * and set anchor to be zero.
     *
     * This function should work even if matrix properties have not been set or initialized.
     * You should only need the current matrix and vertices.
     * You may assume that this.objectSpaceCorners is accurate, as it should be updated whenever vertices are set.
     */
    renormalizeVertices(centerOrigin=false){
        // We will assume that objectSpaceBounds is already up to date
        // first, let's get the anchor and scaling we need to transform the bounding box to -0.5, 0,5
        const oldVerts = this.objectVertices;
        if(oldVerts===undefined || oldVerts.length<2){return;}
        const oldBounds = this.objectSpaceBounds;
        const oldCenter = oldBounds[0].plus(oldBounds[1]).times(0.5);
        const oldScale = oldBounds[1].minus(oldBounds[0]);

        // We will play some precision tricks to avoid trouble if, for example, all of the points match in one coordinate.
        var scaleX = Math.abs(oldScale.x);
        scaleX = Precision.signedTiny(scaleX, 1);
        var scaleY = Math.abs(oldScale.y);
        scaleY = Precision.signedTiny(scaleY, 1);

        // Calculate a matrix that centers and scales appropriately
        const adjust = Matrix3x3.Multiply(
            Matrix3x3.Scale(1/scaleX, 1/scaleY),
            Matrix3x3.Translation(-oldCenter.x, -oldCenter.y)
        );

        //apply it to the objectVertices
        this.objectVertices = adjust.applyToPoints(this.objectVertices);

        //and apply the inverse to the model matrix to keep everything the same in world coordinates
        this.matrix = Matrix3x3.Multiply(this.matrix, adjust.getInverse());

        // update objectSpaceCorners
        this.objectSpaceCorners = [
            new Vec2(-(0.5*oldScale.x/scaleX), -(0.5*oldScale.y/scaleY)),
            new Vec2((0.5*oldScale.x/scaleX), -(0.5*oldScale.y/scaleY)),
            new Vec2(0.5*oldScale.x/scaleX, 0.5*oldScale.y/scaleY),
            new Vec2(-(0.5*oldScale.x/scaleX), (0.5*oldScale.y/scaleY))
        ];
        if(centerOrigin){
            this.setPosition(this.matrix.times(new Vec2(0,0)), false);
            this.setAnchorShift(new Vec2(0,0), false);
        }
        // update matrix properties
        this.updateMatrixProperties();
    }

    getViewGroupClassName(){
        return this.getAttribute("viewGroupClassName");
    }
    setViewGroupClassName(value){
        this.setAttribute("viewGroupClassName", value);
    }

    removeFromParent() {
        this._removeFromParent();
        this.notifyPropertySet();
    }

    attachToNewParent(newParent) {
        this._attachToNewParent(newParent);
        this.notifyPropertySet();
    }


}

AObject.RegisterClass(AModel2D);
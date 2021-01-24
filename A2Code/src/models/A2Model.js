import {
    Vec2,
    Matrix3x3,
    AModel2D,
    AObject
} from "AniGraph"

/**
 * this class represents a model and its geometry, including functionality for transformation hierarchies.
 * in use, a tree is constructed with the scene as the root, and all elements of the scene are children.
 * any transformations applied to a particular model are also applied to its children, though if that is
 * not your intent there exist workarounds involving A2ModelGroups at the bottom of this file.
 */
export default class A2Model extends AModel2D{

    /**
     * returns matrix transforming this node's parent's object space to world space
     * @returns {Matrix3x3}
     */
    getParentSpaceMatrix(){
        if(this.getParent()){
            return this.getParent().getObjectToWorldMatrix();
        }else{
            return Matrix3x3.Identity();
        }
    }

    /**
     * returns world coordinates of vertices or undefined if there are no vertices to return
     * @returns {*|undefined}
     */
    getVertices() {
        return this.objectVertices? this.getObjectToWorldMatrix().applyToPoints(this.objectVertices): undefined;
    }

    /**
     * sets vertices to provided positions in object space
     * @param value
     */
    setVertices(value) {
        return super.setVertices(value);
    }

    /**
     * provides bounding box corners of this model's vertices in world space
     * does not take into account the rest of the model's subtree
     * @returns {*}
     */
    getWorldSpaceBBoxCorners(){
        return this.getObjectToWorldMatrix().applyToPoints(this.objectSpaceCorners);
    }

    /**
     * provides bounding box corners of this model and its children in world space
     * returns them in format
     * [Vec2(minX, minY),
     *  Vec2(maxX, minY),
     *  Vec2(maxX, maxY),
     *  Vec2(minX, maxY)]
     * if this model's subtree has no vertices, returns undefined
     * @returns {*}
     */
    getChildTreeWorldSpaceBoundingBox(){
        const objectSpaceBoxPoints = this.getChildTreeObjectSpaceBoundingBox();
        if(objectSpaceBoxPoints) {
            return this.getObjectToWorldMatrix().applyToPoints(objectSpaceBoxPoints);
        }
    }

    /**
     * finds the closest manipulable model to the root and returns the world space bounding box
     * containing it and all its children
     * @returns {*}
     */
    getGroupWorldSpaceBoundingBox(){
        function groupRoot(m){
            if(m.getParent() && m.getParent().getParent()){
                return groupRoot(m.getParent());
            }else{
                return m;
            }
        }
        return groupRoot(this).getChildTreeWorldSpaceBoundingBox();
    }

    /**
     * detaches a subtree from its parent and reattaches it as the child of another node
     * @param newParent
     */
    reparent(newParent){
        this.removeFromParent();
        this.attachToNewParent(newParent);
    }

    /**
     * collects all this node's children into a group and sets that group as this node's only child
     * @return {A2ModelGroup} the new group containing this model's previous children
     */
    groupChildren(){
        const newGroup = this.constructor.CreateGroup();
        const childList = this.getChildrenList();
        this.addChild(newGroup);
        for(let c of childList){
            c.reparent(newGroup);
        }
        newGroup.recenterAnchorInSubtree();
        return newGroup;
    }


    /**
     * remove this node's children and make them its siblings (children to the same node)
     * @returns {A2Model} the modified node (this)
     */
    ungroupChildren(){
        // can't ungroup children of root node
        if(!this.getParent()){
            return;
        }
        const childList = this.getChildrenList();
        for(let c of childList){
            c.reparent(this.getParent());
        }
        return this;
    }


    /**
     * returns the matrix transforming object coordinates to world (screen) coordinates
     * @returns {*}
     */
    getObjectToWorldMatrix(){
        if(!this.getParent()){
            return super.getObjectToWorldMatrix();
        }
        return this.getParent().getObjectToWorldMatrix().times(super.getObjectToWorldMatrix());
    }

    // inverse of above
    getWorldToObjectMatrix(){return this.getObjectToWorldMatrix().getInverse();}


    /**
     * removes a node from its parent and sets its new parent to the root
     */
    removeFromParent() {
        let parent = this.getParent()
        this.setMatrixAndPosition(Matrix3x3.Multiply(parent.getObjectToWorldMatrix(), this.matrix), 
            Matrix3x3.Multiply(parent.getObjectToWorldMatrix(), this.getPosition()));
        super.removeFromParent();
    }

    /**
     * sets a node's parent to a given node. if the node's parent is currently the root (which 
     * it should always be when calling this), the vertex world positions will be unchanged.
     * @param newParent
     */
    attachToNewParent(newParent) {
        this.setMatrixAndPosition(Matrix3x3.Multiply(newParent.getObjectToWorldMatrix().getInverse(), this.matrix), 
            Matrix3x3.Multiply(newParent.getObjectToWorldMatrix().getInverse(), this.getPosition()));
        super.attachToNewParent(newParent);
    }

    /**
     * returns world (screen) position of this model's position attribute
     * @returns {*}
     */
    getWorldPosition() {
        if(!this.getParent())
            return this.getPosition();
        return this.getParentSpaceMatrix().times(this.getPosition())
    }

    /**
     * sets this model's position attribute to match a given world position
     * the position attribute is the point around which transformations occur
     * @param position
     * @param update
     */
    setWorldPosition(position, update = false){        
        let new_pos = this.getParentSpaceMatrix().getInverse().times(position)
        let pp_r_s_inv = Matrix3x3.Translation(new_pos).times(
            Matrix3x3.Rotation(this.getRotation()).times(
                Matrix3x3.Scale(this.getScale())
            )).getInverse()
        let new_a_mat = pp_r_s_inv.times(this.matrix)
        this.setPosition(new_pos, update)
        this.setAnchorShift(new Vec2(new_a_mat.m02, new_a_mat.m12))
        this.updateMatrixProperties()
    }

    /**
     * this function sets the center ( (0,0) in object space) of the group to the center of the union of the group and its
     * children. this doesn't affect the worldspace positions of any vertex, so there should be no visual changes.
     * 
     * if the group model contains no vertices, it sets the center to the position of its parent, or (0,0) for the root.
     */
    recenterAnchorInSubtree(){
        if(!this.getChildrenList().length){
            this.setWorldPosition(this.getParent().getWorldPosition())
            return
        }
        let bbox = this.getChildTreeObjectSpaceBoundingBox()
        let new_center = new Vec2((bbox[0].x+bbox[2].x)/2, (bbox[0].y+bbox[2].y)/2)
        // console.log(new_center)
        this.setWorldPosition(this.getObjectToWorldMatrix().times(new_center))
    }


    /**
     * returns bounding box containing this object and its children in format
     * [Vec2(minX, minY),
     *  Vec2(maxX, minY),
     *  Vec2(maxX, maxY),
     *  Vec2(minX, maxY)]
     * 
     * coordinates are returned in object space
     * 
     * @returns {Vec2[]}
     */
    getChildTreeObjectSpaceBoundingBox(){
        let minx = Number.MAX_SAFE_INTEGER
        let maxx = Number.MIN_SAFE_INTEGER
        let miny = Number.MAX_SAFE_INTEGER
        let maxy = Number.MIN_SAFE_INTEGER

        let cornerslist = this.objectSpaceCorners
        if(cornerslist.length > 0){
            minx = Math.min(minx, cornerslist[0].x, cornerslist[1].x, cornerslist[2].x, cornerslist[3].x)
            maxx = Math.max(maxx, cornerslist[0].x, cornerslist[1].x, cornerslist[2].x, cornerslist[3].x)
            miny = Math.min(miny, cornerslist[0].y, cornerslist[1].y, cornerslist[2].y, cornerslist[3].y)
            maxy = Math.max(maxy, cornerslist[0].y, cornerslist[1].y, cornerslist[2].y, cornerslist[3].y)
        }

        let children = this.getChildrenList()
        var child, childcorners
        for(child of children){
            childcorners = child.matrix.applyToPoints(child.getChildTreeObjectSpaceBoundingBox())
            // console.log(childcorners)
            if(childcorners.length > 0){
                minx = Math.min(minx, childcorners[0].x, childcorners[1].x, childcorners[2].x, childcorners[3].x)
                maxx = Math.max(maxx, childcorners[0].x, childcorners[1].x, childcorners[2].x, childcorners[3].x)
                miny = Math.min(miny, childcorners[0].y, childcorners[1].y, childcorners[2].y, childcorners[3].y)
                maxy = Math.max(maxy, childcorners[0].y, childcorners[1].y, childcorners[2].y, childcorners[3].y)
            }
        }

        // console.log("x from "+minx+" to "+maxx)
        // console.log("y from "+miny+" to "+maxy)
        return [new Vec2(minx, miny),
            new Vec2(maxx, miny),
            new Vec2(maxx, maxy),
            new Vec2(minx, maxy)]
    }

    /**
     * creates an A2ModelGroup object as below
     * @param args
     * @returns {A2ModelGroup}
     * @constructor
     */
    static CreateGroup(args){
        return new this.GroupClass(args);
    }
}


/**
 * this class's main purposes are to provide a way to add transformations to 
 * the hierarchy without adding additional geometry, and to provide a mechanism 
 * for adding transformations to an object that its children should not inherit
 */
export class A2ModelGroup extends A2Model{
    /**
     * Convenience accessor to see if a model is an A2ModelGroup. So, `model.isModelGroup` will be
     * true if model is an AModelGroup
     * @return {boolean}
     * */
    get isModelGroup(){return true;}

    getWorldSpaceBBoxCorners() {
        if(!this.getChildrenList().length){
            return;
        }
        return this.getChildTreeWorldSpaceBoundingBox();
    }

    /**
     * groups cannot have their own vertices
     * @param value
     */
    setVertices(value) {
        return;
    }

    /**
     * this works similarly to ungroupChildren on nongroups, 
     * but it removes the empty group afterwards
     * @returns {*}
     */
    ungroupChildren() {
        const parent = this.getParent();
        if(!parent){
            return;
        }
        super.ungroupChildren();
        this.release();
        return parent;
    }
}

A2Model.GroupClass = A2ModelGroup

AObject.RegisterClass(A2Model);
AObject.RegisterClass(A2ModelGroup);
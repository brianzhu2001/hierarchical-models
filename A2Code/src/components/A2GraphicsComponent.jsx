import {A2DShapeEditorComponent, A2DShapeController, AView2D, ABoundingBox2DController} from "AniGraph";
import A2Model from "../models/A2Model";
import {AIDragToScaleAroundModelAnchor, AIDragToMovePosition, AIDragToMoveAnchorPoint,} from "../interactions/SceneGraphElementInteractions";
import {AIDragToScaleAroundModelAnchorAssignment1, AIDragToMovePositionAssignment1, AIDragToMoveAnchorPointAssignment1} from "../interactions/ReferenceA1InteractionImplementations";


export default class A2GraphicsComponent extends A2DShapeEditorComponent{
    // Our A2GraphicsComponent class is a React Component that manages an mvc hierarchy with the following classes.
    static ModelClassMap = {
        default: {
            controllerClass: A2DShapeController,
            viewClass: AView2D,
            modelClass: A2Model
        }
    };

    /**
     * In this function, you will initialize the controllers representing different edit modes.
     * These controllers will show up as options that the user can select from a drop down menu,
     * with only one controller being active at a time.
     *
     * In Anigraph V2 we can create different bounding box controllers by simply providing different
     * AInteraction subclasses to a constructor (see below). For each AInteraction subclass, callbacks
     * are defined in the `static Create(args)` function.
     */
    initEditModes(){

        // The first edit mode we define is a reference implementation of the Transform controller you
        // implemented in Assignment 1. You can look at the code in
        // `../interactions/ReferenceA1InteractionImplementations` to see the controller's implementation.
        this.addSelectionController('A1Transform', new ABoundingBox2DController({
            component: this,
            handleInteractionClasses: [AIDragToScaleAroundModelAnchorAssignment1],
            anchorInteractionClasses: [AIDragToMoveAnchorPointAssignment1],
            hostViewInteractionClasses: [AIDragToMovePositionAssignment1]
        }));

        // Once you reach the A2Model checkpoint, the `A1Transform` controller should let you
        // move objects around and safely transform direct children of our scene graph's root.
        // However, you will notice that, for example, if you make one leaf node the child of
        // another and attempt to scale each of them separately, strange things begin to happen.
        // This is because our controllers in A1 assumed that a model's matrix mapped object
        // coordinates to screen (world) corrdinates, which may no longer be the case.
        // You will write the interactions for a new version of the Transform controller from
        // A1 that works with hierarchies. The starter code for these interactions can be
        // found in [`../interactions/SceneGraphElementInteractions`](../interactions/SceneGraphElementInteractions)
        //
        this.addSelectionController('Transform', new ABoundingBox2DController({
            component: this,
            handleInteractionClasses: [AIDragToScaleAroundModelAnchor],
            anchorInteractionClasses: [AIDragToMoveAnchorPoint],
            hostViewInteractionClasses: [AIDragToMovePosition],
            groupBoxInteractionClasses: [AIDragToMovePosition]
        }));

        // Here you can set the default edit mode to whichever one you are currently working on
        this.switchToEditMode('A1Transform');
        // this.switchToEditMode('Transform');
        // this.switchToEditMode('Isolation Mode');

        this.setCurrentSelectionMode("Single");
    }


    initSelectionModes(){
        super.initSelectionModes();
        const component = this;
        this.defineSelectionMode('Descendants', {
            getWorldSpaceBoundingBox: function(){
                return component.getSelectedModel().getChildTreeWorldSpaceBoundingBox();
            }
        });

        this.defineSelectionMode('Group', {
            getWorldSpaceBoundingBox: function(){
                return component.getSelectedModel().getGroupWorldSpaceBoundingBox();
            },
            selectController: function(controller){
                function groupsearch(c){
                    if(c.getModel().isModelGroup || (!c.getParent().getModel().getParent())){
                        return c;
                    }else{
                        return groupsearch(c.getParent());
                    }
                }
                return groupsearch(controller);
            }
        });
    }




}
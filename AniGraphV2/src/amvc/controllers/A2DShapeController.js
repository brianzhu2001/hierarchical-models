import AController2D from "./AController2D";
import AIDragShapePosition from "../interactions/shape/AIDragShapePosition";
import AIClickShape from "../interactions/shape/AIClickShape";

export default class A2DShapeController extends AController2D{
    static DefaultViewElementInteractionClasses=[AIClickShape];
    activate(args) {
        super.activate(args);
    }

    clickShape(args){
        this.getComponent().handleContextClick(args);
    }

    // /**
    //  * Create the view and add interactions to its elements
    //  */
    // createView() {
    //     super.createView();
    // }
    //
    // /**
    //  * This function adds the relevant interactions to an element. For basic shapes, host controllers will just
    //  * add interactions once when the view is created. If we did this, the code here could just be put in createView().
    //  * However, if the number of elements in the view can change over time, we will need to add interactions each time
    //  * a new element is created. For this reason, it's good practice to factor out the code that adds interactions to
    //  * an individual elements. This will make it easier to implement views that dynamically create elements later on.
    //  * For an example of this, see A2DShapeVertexEditController, which must add interactions to new handles as they
    //  * are created.
    //  * @param element
    //  */
    // addInteractionsToElement(element){
    //     super.addInteractionsToElement(element);
    //     // this.addClickInteraction(element)
    //     // AIDragShapePosition.Create({
    //     //     element: element,
    //     //     controller: this
    //     // })
    // }
    //
    // /**
    //  * Add a click interaction to an SVG element
    //  * @param graphicElement an ASVGElement
    //  * @returns {AInteraction}
    //  */
    // addClickInteraction(graphicElement){
    //     //We create a new interaction on the given element, which in this case will be an ASVGElement
    //     const clickInteraction = graphicElement.createInteraction('click-element');
    //
    //     //Remember to add the interaction to the controller
    //     //this way, we will be able to activate/deactivate interactions by name from the controller
    //     this.addInteraction(clickInteraction);
    //
    //
    //     // You can also access the interaction from the element using the name you gave it
    //     // So the following assert should always pass:
    //     console.assert(clickInteraction === graphicElement.getInteraction('click-element'));
    //
    //     // Now let's add an event listener
    //     // Remener that the <this> variable may be different when the callback executes.
    //     // Therefore, if we want to access this controller, we should alias it first:
    //     const thisController = this;
    //
    //     // Now let's add an event listener that just tells the component we've clicked on this shape
    //     clickInteraction.addEventListener('click', function(event){
    //         event.preventDefault();
    //         if(!clickInteraction.elementIsTarget(event)){
    //             return;
    //         }
    //         thisController.clickShape({controller: thisController});
    //     });
    //
    //     //and let's return the interaction in case someone wants to do something with it
    //     return clickInteraction;
    // }
    //
    //

    //
    // activate(args){
    //     super.activate(args);
    // }
    //
    // deactivate(args) {
    //     super.deactivate(args);
    // }
    //
    //
    // /**
    //  * Can modify response to a model update.
    //  * Should return whether or not the given update is accounted for---meaning some code
    //  * that expected its type ended up processing the update.
    //  * @param args
    //  * @returns {boolean|*}
    //  */
    // onModelUpdate(args) {
    //     return super.onModelUpdate(args);
    // }
}
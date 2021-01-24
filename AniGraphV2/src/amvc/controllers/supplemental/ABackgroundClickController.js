import ASupplementalComponentController2D from "./ASupplementalComponentController2D";


export default class ABackgroundClickController extends ASupplementalComponentController2D{

    /**
     * initialize interactions that go on the host.
     * @param args
     */
    initHostViewInteractions(args) {
        super.initHostViewInteractions(args);
        this.addClickInteraction(this.hostController.getContextElement());
    }

    addClickInteraction(graphicElement){
        //We create a new interaction on the given element, which in this case will be an ASVGElement
        const clickInteraction = graphicElement.createInteraction('click-background');

        //Remember to add the interaction to the controller
        //this way, we will be able to activate/deactivate interactions by name from the controller
        this.addInteraction(clickInteraction);


        // You can also access the interaction from the element using the name you gave it
        // So the following assert should always pass:
        console.assert(clickInteraction === graphicElement.getInteraction('click-background'));

        // Now let's add an event listener
        // Remener that the <this> variable may be different when the callback executes.
        // Therefore, if we want to access this controller, we should alias it first:
        const thisController = this;
        const hostController = this.hostController;

        // Now let's add an event listener that just tells the component we've clicked on this shape
        clickInteraction.addEventListener('click', function(event){
            event.preventDefault();
            if(!clickInteraction.elementIsTarget(event)){
                return;
            }
            // thisController.clickShape({controller: hostController});
            thisController.clickShape({controller: undefined});
        });

        //and let's return the interaction in case someone wants to do something with it
        return clickInteraction;
    }

    clickShape(args){
        this.getComponent().handleContextClick(args);
    }

    activate(args){
        super.activate(args);
    }

    deactivate(args) {
        super.deactivate(args);
    }


    /**
     * Can modify response to a model update.
     * Should return whether or not the given update is accounted for---meaning some code
     * that expected its type ended up processing the update.
     * @param args
     * @returns {boolean|*}
     */
    onModelUpdate(args) {
        return super.onModelUpdate(args);
    }
}
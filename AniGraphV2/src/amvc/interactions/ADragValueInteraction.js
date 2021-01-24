import ADragInteraction from "./ADragInteraction";



export default class ADragValueInteraction extends ADragInteraction{
    /**
     * Creates a drag interaction controlling the value set by setValue,
     * based on the value returned by getValue (in general, we assume these
     * represent the same value, but they need not necessarily).
     * Example args dictionary:
     * ``` javascript
     * args = {
     *     name: 'drag-position',
     *     element: myShape,
     *     controller: myController,
     *     getValue: ()=>{myController.getModel().getWorldPosition();}
     *     setValue: (value)=>{myController.getModel().setPosition(value);}
     * }
     * ```
     * @param args
     * @returns {*}
     * @constructor
     */
    static Create(args){
        const interaction = super.Create(args);
        const setValue = (args && args.setValue)? args.setValue : interaction.setValueFunction;
        const getValue = (args && args.getValue)? args.getValue : interaction.getValueFunction;
        console.assert(getValue, {msg:`Must provide getValue in args dictionary for ${this.name}.Create(args)}`});
        console.assert(setValue, {msg:`Must provide setValue in args dictionary for ${this.name}.Create(args)}`});
        interaction.getValue = getValue;
        interaction.setValue = setValue;

        //define the drag start callback
        interaction.setDragStartCallback(event=>{
            if(!interaction.elementIsTarget(event)){return;}
            event.preventDefault();
            //we can set state related to this interaction in our interaction object
            interaction.dragStartCursorPosition = interaction.getEventPositionInContext(event);
            interaction.dragStartPropertyValue = interaction.getValue();
        });

        //now define a drag move callback
        interaction.setDragMoveCallback(event=> {
            event.preventDefault();
            const newCursorLocation = interaction.getEventPositionInContext(event);
            const valueChange = newCursorLocation.minus(interaction.dragStartCursorPosition);
            interaction.setValue(interaction.dragStartPropertyValue.plus(valueChange));
        });
        //we can optionally define a drag end callback
        interaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return interaction;
    }

    bindMethods() {
        super.bindMethods();
        if(this.getValueFunction){
            this.getValueFunction = this.getValueFunction.bind(this);
        }
        if(this.setValueFunction){
            this.setValueFunction = this.setValueFunction.bind(this);
        }
    }

}






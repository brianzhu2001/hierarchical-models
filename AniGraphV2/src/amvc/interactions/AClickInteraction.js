import AInteraction from "./AInteraction";

export default class AClickInteraction extends AInteraction{
    static Create(args){
        const interaction = super.Create(args);
        interaction.addEventListener("click", interaction.clickCallback);
    }

    clickCallback(event){
        console.warn("No click callback specified");
    }

    bindMethods() {
        super.bindMethods();
        this.clickCallback = this.clickCallback.bind(this);
    }
}
import AClickInteraction from "../AClickInteraction";


export default class AIClickShape extends AClickInteraction{

    activate() {
        super.activate();
    }

    deactivate() {
        super.deactivate();
    }

    clickCallback(event) {
        this.requestingController.clickShape({controller: this.controller});
    }
}
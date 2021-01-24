import AController from "../controllers/AController"
import AGraphicsContext2D from "../../acontext/AGraphicsContext2D";
import AComponent from "../../acomponent/AComponent";

export function AControllerTest(aClass){
    return test('AController test for: '+aClass.constructor.name, () => {
        TestAControllerClass(aClass);
    });
}

export function TestAControllerClass(aClass){
    var ob = new aClass({component: new AComponent()});
    expect(1).toBe(1);
}


test('Test AController', () => {
    TestAControllerClass(AController);
});






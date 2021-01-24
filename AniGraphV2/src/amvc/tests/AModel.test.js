import AModel from "../models/AModel";
import AObject from "../../aobject/AObject";
import {AObjectJSONEqual} from "../../aobject/tests/AObject.test";
import AModelListener from "../models/AModelListener";

expect.extend(AObjectJSONEqual);

class TestAModelListener extends AModelListener{
    constructor(args) {
        super(args);
        if(args!==undefined && args.model!==undefined){
            this.setModel(args.model, true);
        }
        this.modelUpdates= [];
        this.properties = {};
        this.attributes;
    }

    onModelUpdate(args) {
        this.modelUpdates.push(args);
        switch (args.type) {
            case 'setProperties':
                this.properties = Object.assign(this.properties, args.args);
                break;
            case "setAttributes":
                this.attributes = Object.assign(this.attributes, args.args);
                break;
            default:
                return unanticipatedUpdate();
        }
    }
}



describe('Tests for AModel', ()=>{
    test('To JSON and back again without modification:', (done) => {
        const newob = new AModel();
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });

    test('To JSON and back again with some properties and attributes set:', (done) => {
        const newob = new AModel();
        newob.setProperty('prop1', 1);
        newob.setProperty('prop2', 24);
        newob.setProperty('prop3', 38);
        // newob.setAttribute('myattr', "WHOA!!!!!");
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });

    test('Checking to see if listener gets property updates:', (done) => {
        const newob = new AModel();
        const newoblistener = new TestAModelListener({model: newob});
        newob.setProperty('prop1', 1);
        newob.setProperty('prop2', 25);
        newob.setProperty('prop3', 36);
        // newob.setAttribute('myattr', "WHOA!!!!!");
        expect(newob.getProperty('prop1')).toBe(newoblistener.properties['prop1']);
        expect(newob.getProperty('prop2')).toBe(newoblistener.properties['prop2']);
        expect(newob.getProperty('prop3')).toBe(newoblistener.properties['prop3']);
        // expect(newob.getAttribute('myattr')).toBe(newoblistener.attributes['myattr']);
        done();
    });
});
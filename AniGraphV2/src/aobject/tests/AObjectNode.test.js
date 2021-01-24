import AObjectNode from "../AObjectNode";
import AObject from "../AObject";
import {AObjectJSONEqual} from "./AObject.test";

expect.extend(AObjectJSONEqual);

describe('AObjectNode Test', ()=>{
    test('To JSON and Back Outside:', (done) => {
        const newob = new AObjectNode();
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });
});

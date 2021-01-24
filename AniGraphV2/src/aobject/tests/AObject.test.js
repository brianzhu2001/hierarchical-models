import AObject from "../AObject";



export const AObjectJSONEqual = {
    AObjectJSONEqual(msg, objectA, objectB) {
        const pass = objectA.getJSONString()==objectB.getJSONString();
        if (pass) {
            return {
                message: () =>
                    `${objectA}.getJSONString() == ${objectB}.getJSONString()`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `${objectA}.getJSONString() != ${objectB}.getJSONString()`,
                pass: false,
            };
        }
    }
}

expect.extend(AObjectJSONEqual);

export function AObjectTest(aClass){
    const name = aClass.constructor.name;
    TestAObjectClass(aClass);
}

export function TestAObjectClass(aClass){
    return describe(`AObject Test for ${aClass.name}`, ()=>{
        AObject.RegisterClass(aClass);
        const name = aClass.constructor.name;
        var newob = new aClass({name: name});
        expect(newob.name).toBe(name);
        test('To JSON and Back:', (done) => {
            const newobB = aClass.NewFromJSON(newob.getJSONString());
            expect().AObjectJSONEqual(newob, newobB);
            done();
        });
    });
}

AObjectTest(AObject);

describe('AObject Test', ()=>{
    test('To JSON and Back Outside:', (done) => {
        const newob = new AObject();
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });
});

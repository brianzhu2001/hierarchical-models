import AObject from "../../aobject/AObject";
import AEventCallbackDict from "../../aobject/events/AEventCallbackDict";



test('AEventCallbackDict test | checks to see if signaled events add their arguments to a counter in a callback...', () => {
    const name = AEventCallbackDict.constructor.name;
    var newob = new AEventCallbackDict({name: name});

    var counter = 0;

    function addToCounter(amount){
        counter = counter+amount;
    }
    newob.addCallback(addToCounter);

    newob.signalEvent(1);
    newob.signalEvent(10);
    newob.signalEvent(100);
    newob.signalEvent(1000);
    expect(counter).toBe(1111);
});


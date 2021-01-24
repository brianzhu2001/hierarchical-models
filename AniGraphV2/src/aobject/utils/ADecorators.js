export default function ADecorator(classMethods) {
    return function(target) {
        var elnames = {};
        for(let el of target.elements){
            elnames[el.key]=el;
        }
        for(let methodname in classmethods){
            if(elnames[methodname]===undefined) {
                target.elements.push({
                    kind: 'method',
                    key: methodname,
                    placement: 'prototype',
                    descriptor: {
                        value: classmethods[methodname],
                        writable: false,
                        configurable: false,
                        enumerable: false,
                    }
                });
            }
        }
        // const requiredFunctions = ['onModelUpdate'];
        // for(let rfuncname of requiredFunctions){
        //     if(elnames[rfuncname]===undefined){
        //         console.assert(elnames[rfuncname] !== undefined, "Class decorated with AModelListener must define method "+rfuncname);
        //     }
        // }
        return target;
    }
}
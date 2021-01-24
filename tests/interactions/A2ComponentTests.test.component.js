import React from 'react';
import { shallow, mount, render } from 'enzyme';
// import 'two.js';

//
import {A2GraphicsComponent, A2Model} from "A2Code";
//

var fs = require("fs");


//////////////////////////////////////////////
import {
    AppState,
    Vec2,
    Matrix3x3,
    VecListToBeCloseTo,
    SquareVerts,
    AComponentTest
} from "AniGraph"
expect.extend(VecListToBeCloseTo)
//////////////////////////////////////////////

const DOCDIV = document.createElement('div');
DOCDIV.id = 'doctestdiv';
document.body.appendChild(DOCDIV);
function clearJSDOM(){
    DOCDIV.innerHTML='';
}

var TestCase = null;

beforeEach(() => {
    clearJSDOM();
    TestCase = new AComponentTest({
        attachTo: DOCDIV,
        expect: expect,
        modelClass: A2Model,
        componentClass: A2GraphicsComponent
    });
});

afterEach(() => {
    TestCase.detach();
});


describe('Basic Tests', function() {
    test('Test that component test runs', function () {
        //const test=NewComponentTest();
        TestCase.expect(1).toBe(1);
        //TestCase.detach();
    });
    test('Test that shape can be added with box vertices', function () {
        const boxShape = TestCase.createShape('boxshape', SquareVerts(new Vec2(300, 300), 100));
        TestCase.testShapeWorldVertices(boxShape, SquareVerts(new Vec2(300, 300), 100));
    });
    test('Save SVG of shape unselected and selected', function () {
        const boxShape = TestCase.createShape('boxshape', SquareVerts(new Vec2(300, 300), 100));
        TestCase.testShapeWorldVertices(boxShape, SquareVerts(new Vec2(300, 300), 100));
        TestCase.activateTransformController();
        TestCase.saveContextToSVG('shapeNotSelected.svg');
        TestCase.selectShape(boxShape);
        TestCase.saveContextToSVG('shapeSelected.svg');
    });
});


describe('A1TransformController', function() {
    test('Test transform w anchor controller on corner opposite origin, scale down', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        // get the far handle
        const handle = TestCase.getHandles()[2];

        var startPoint = boxVerts[2];
        var endPoint = boxVerts[2].times(0.6).plus(boxVerts[0].times(0.4));
        var opposite = boxVerts[2].times(0.4).plus(boxVerts[0].times(0.6));
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, [
            new Vec2(opposite.x, opposite.y),
            new Vec2(endPoint.x, opposite.y),
            new Vec2(endPoint.x, endPoint.y),
            new Vec2(opposite.x, endPoint.y),
        ]);
        //TestCase.detach();
    });

    test('Test transform w anchor controller on corner opposite origin, flip', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        // get the far handle
        const handle = TestCase.getHandles()[2];

        // Scale Down
        var startPoint = boxVerts[2];
        var endPoint = boxVerts[2].times(0.6).plus(boxVerts[0].times(0.4));
        var opposite = boxVerts[2].times(0.4).plus(boxVerts[0].times(0.6));
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, [
            new Vec2(opposite.x, opposite.y),
            new Vec2(endPoint.x, opposite.y),
            new Vec2(endPoint.x, endPoint.y),
            new Vec2(opposite.x, endPoint.y),
        ]);

        // flip
        startPoint = endPoint;
        endPoint = boxVerts[0].times(0.6).plus(boxVerts[2].times(0.4));
        opposite = boxVerts[0].times(0.4).plus(boxVerts[2].times(0.6));
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, [
            new Vec2(opposite.x, opposite.y),
            new Vec2(endPoint.x, opposite.y),
            new Vec2(endPoint.x, endPoint.y),
            new Vec2(opposite.x, endPoint.y),
        ]);
        //TestCase.detach();
    });

    test('Test transform w anchor controller on corner near origin, with flip', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        // get the far handle
        const handle = TestCase.getHandles()[0];

        // Scale Down
        var startPoint = boxVerts[0];
        var endPoint = boxVerts[0].times(0.6).plus(boxVerts[2].times(0.4));
        var opposite = boxVerts[0].times(0.4).plus(boxVerts[2].times(0.6));
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, [
            new Vec2(endPoint.x, endPoint.y),
            new Vec2(opposite.x, endPoint.y),
            new Vec2(opposite.x, opposite.y),
            new Vec2(endPoint.x, opposite.y),
        ]);

        // flip
        startPoint = endPoint;
        endPoint = boxVerts[2].times(0.6).plus(boxVerts[0].times(0.4));
        opposite = boxVerts[2].times(0.4).plus(boxVerts[0].times(0.6));
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, [
            new Vec2(endPoint.x, endPoint.y),
            new Vec2(opposite.x, endPoint.y),
            new Vec2(opposite.x, opposite.y),
            new Vec2(endPoint.x, opposite.y),
        ]);
        //TestCase.detach();
    });
});
//

describe('A1TransformController with moved origin', function() {
    test('Test on corner opposite origin, scale down then up', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        const centerPoint = boxVerts[0].plus(boxVerts[2]).times(0.5);
        TestCase.clickAndDragAnchor(centerPoint, new Vec2(0.0,0.0));

        // get the far handle
        const handle = TestCase.getHandles()[2];
        var startPoint = boxVerts[2];
        var endPoint = boxVerts[2].times(0.55);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55).applyToPoints(boxVerts));

        var startPoint = endPoint;
        var endPoint = endPoint.times(2);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55*2).applyToPoints(boxVerts));
        //TestCase.detach();
    });

    test('Test on corner near origin, scale down then up', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        const centerPoint = boxVerts[0].plus(boxVerts[2]).times(0.5);
        TestCase.clickAndDragAnchor(centerPoint, new Vec2(0.0,0.0));

        // get the far handle
        const handle = TestCase.getHandles()[0];
        var startPoint = boxVerts[0];
        var endPoint = boxVerts[0].times(0.55);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55).applyToPoints(boxVerts));

        // var startPoint = endPoint;
        // var endPoint = endPoint.times(2);
        // TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        // TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55*2).applyToPoints(boxVerts));
        // //TestCase.detach();
    });

    test('Test on corner [1], scale down then up', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        const centerPoint = boxVerts[0].plus(boxVerts[2]).times(0.5);
        TestCase.clickAndDragAnchor(centerPoint, new Vec2(0.0,0.0));

        // get the far handle
        const handle = TestCase.getHandles()[1];
        var startPoint = boxVerts[1];
        var endPoint = boxVerts[1].times(0.55);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55).applyToPoints(boxVerts));

        var startPoint = endPoint;
        var endPoint = endPoint.times(2);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.55*2).applyToPoints(boxVerts));
        //TestCase.detach();
    });

    test('Test on corner [3], scale down then up', function() {
        //const test=NewComponentTest();
        const boxVerts = SquareVerts(new Vec2(300,300), 100);
        const boxShape = TestCase.createShape('boxshape', boxVerts);
        TestCase.testShapeWorldVertices(boxShape, boxVerts);
        TestCase.activateTransformController();
        TestCase.selectShape(boxShape);
        const centerPoint = boxVerts[0].plus(boxVerts[2]).times(0.5);
        TestCase.clickAndDragAnchor(centerPoint, new Vec2(0.0,0.0));

        // get the far handle
        const handle = TestCase.getHandles()[3];
        var startPoint = boxVerts[3];
        var endPoint = boxVerts[3].times(0.57);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.57).applyToPoints(boxVerts));

        var startPoint = endPoint;
        var endPoint = endPoint.times(1.88);
        TestCase.clickAndDragHandle(handle, startPoint, endPoint);
        TestCase.testShapeWorldVertices(boxShape, Matrix3x3.Scale(0.57*1.88).applyToPoints(boxVerts));
        //TestCase.detach();
    });
});



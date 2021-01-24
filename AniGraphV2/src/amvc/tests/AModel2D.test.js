import AModel2D from "../models/AModel2D";
import AObject from "../../aobject/AObject";
import {AObjectJSONEqual} from "../../aobject/tests/AObject.test";
import AModelListener from "../models/AModelListener";

expect.extend(AObjectJSONEqual);


import Vec2 from "../../amath/Vec2";
import Matrix3x3 from "../../amath/Matrix3x3";
import {VecEqual} from "../../amath/Testing";
import {MatrixEqual} from "../../amath/Testing";


// custom expect jest test... for vectors
expect.extend(VecEqual);
// custom expect jest test... for matrices
expect.extend(MatrixEqual);

const VecListToBeCloseTo = {
    VecListToBeCloseTo(received, other, msg) {
        let temp = true
        received.forEach((vec, index) => {
            const otherVec = other[index];
            temp &= vec.equalTo(otherVec);
        })
        const pass = temp
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n` + msg,
                pass: false,
            };
        }
    },
}
expect.extend(VecListToBeCloseTo)



class TestAModel2DListener extends AModelListener{
    constructor(args) {
        super(args);
        if(args!==undefined && args.model!==undefined){
            this.setModel(args.model, true);
        }
        this.modelUpdates= [];
        this.properties = {};
        this.attributes = {};
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



describe('Tests for AModel2D', ()=>{
    test('To JSON and back again without modification:', (done) => {
        const newob = new AModel2D();
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });

    test('To JSON and back again with some properties and attributes set:', (done) => {
        const newob = new AModel2D();
        newob.setProperty('prop1', 1);
        newob.setProperty('prop2', 24);
        newob.setProperty('prop3', 38);
        newob.setAttribute('myattr', "WHOA!!!!!");
        const newobB = AObject.NewFromJSON(newob.getJSONString());
        expect().AObjectJSONEqual(newob, newobB);
        done();
    });

    test('Checking to see if listener gets property updates:', (done) => {
        const newob = new AModel2D();
        const newoblistener = new TestAModel2DListener({model: newob});
        newob.setProperty('prop1', 1);
        newob.setProperty('prop2', 25);
        newob.setProperty('prop3', 36);
        newob.setAttribute('myattr', "WHOA!!!!!");
        expect(newob.getProperty('prop1')).toBe(newoblistener.properties['prop1']);
        expect(newob.getProperty('prop2')).toBe(newoblistener.properties['prop2']);
        expect(newob.getProperty('prop3')).toBe(newoblistener.properties['prop3']);
        expect(newob.getAttribute('myattr')).toBe(newoblistener.attributes['myattr']);
        done();
    });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/***
 * This function converts the input angle to the angle in the range in [0,2pi]. This may be needed as
 * tests for rotation have the expected angle always be in the range [-pi, pi] to be consistent with the solutions
 * but students may potentially store angles in any range.
 * @param: angle in radians
 * @return: angle in radians in the range [0, 2pi]
 */
function normalizeAngle(angle) {
    return (angle % (2*Math.PI)+2*Math.PI) % Math.PI //based on Number.prototype.mod
}

// "describe()" is used to group blocks of related tests.
describe('Tests for updateMatrixProperties', () => {
    const testModel = new AModel2D();

    test('Test only anchor', () => {
        let position = new Vec2(0, 0);
        let rotation = 0;
        let scale = new Vec2(1, 1);
        let translate = new Vec2(4, -4);

        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        );

        //position property should be set first
        testModel.setPosition(position, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(position);
        expect(testModel.getRotation()).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Test only scale', () => {
        let position = new Vec2(0, 0);
        let rotation = 0;
        let scale = new Vec2(0.5, -0.5);
        let translate = new Vec2(0, 0);

        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //position property should be set first
        testModel.setPosition(position, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(position);
        expect(testModel.getRotation()).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Test Rotation in quadrant 1', () => {
        let position = new Vec2(0, 0);
        let rotation = Math.PI * 45 / 180;
        let scale = new Vec2(1, 1);
        let translate = new Vec2(0, 0);

        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )
        //position property should be set first
        testModel.setPosition(position, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(position);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });


    test('Test Rotation in quadrant 2', () => {
        let position = new Vec2(0, 0)
        let rotation = Math.PI * 135 / 180
        let scale = new Vec2(1, 1)
        let translate = new Vec2(0, 0)


        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //position property should be set first
        testModel.setPosition(position, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(position);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Test Rotation in quadrant 3', () => {
        //NOTE: The reason we compare to -Math.PI*135/180 is because the solutions store rotation from [-Math.PI, Math.PI]
        //However, it is fine to store in [0, 2*Math.PI]
        let position = new Vec2(0, 0)
        let rotation = Math.PI * 225 / 180
        let scale = new Vec2(1, 1)
        let translate = new Vec2(0, 0)


        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //position property should be set first
        testModel.setPosition(position, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(position);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(normalizeAngle(-Math.PI * 135 / 180));
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Test Rotation in quadrant 4', () => {
        //NOTE: The reason we compare to -Math.PI*45/180 is because the solutions store rotation from [-Math.PI, Math.PI]
        //However, it is fine to store in [0, 2*Math.PI]
        let position = new Vec2(0, 0)
        let rotation = Math.PI * 315 / 180
        let scale = new Vec2(1, 1)
        let translate = new Vec2(0, 0)

        let M = Matrix3x3.Translation(position).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //origin property should be set first
        testModel.setPosition(origin, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(origin);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(normalizeAngle(-Math.PI * 45 / 180));
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Test negative angle', () => {
        let origin = new Vec2(0, 0)
        let rotation = -Math.PI * 315 / 180
        let scale = new Vec2(1, 1)
        let translate = new Vec2(0, 0)


        let M = Matrix3x3.Translation(origin).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //origin property should be set first
        testModel.setPosition(origin, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(origin);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo((Math.PI * 45 / 180));
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Origin non-zero w/ rotation', () => {
        let origin = new Vec2(1, -1)
        let rotation = Math.PI * 45 / 180
        let scale = new Vec2(1, 1)
        let translate = new Vec2(0, 0)


        let M = Matrix3x3.Translation(origin).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //origin property should be set first
        testModel.setPosition(origin, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(origin);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

    test('Origin non-zero w/ rotation and scale', () => {
        let origin = new Vec2(1, -1)
        let rotation = Math.PI * 45 / 180
        let scale = new Vec2(0.5, 2)
        let translate = new Vec2(0, 0)


        let M = Matrix3x3.Translation(origin).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //origin property should be set first
        testModel.setPosition(origin, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(origin);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });
    test('Origin non-zero w/ rotation and scale and anchor', () => {
        let origin = new Vec2(1, -1)
        let rotation = Math.PI * 45 / 180
        let scale = new Vec2(0.5, 2)
        let translate = new Vec2(-5, 2.5)


        let M = Matrix3x3.Translation(origin).times(
            Matrix3x3.Rotation(rotation).times(
                Matrix3x3.Scale(scale).times(
                    Matrix3x3.Translation(translate)
                )
            )
        )

        //origin property should be set first
        testModel.setPosition(origin, false)
        //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
        testModel.setMatrix(M);

        expect(testModel.getPosition()).VecEqual(origin);
        expect(normalizeAngle(testModel.getRotation())).toBeCloseTo(rotation);
        expect(testModel.getScale()).VecEqual(scale);
        expect(testModel.getAnchorShift()).VecEqual(translate);
    });

});


describe('Tests for getVertices', () => {
    const testModel = new AModel2D();
    let origin = new Vec2(1, 1)
    let rotation = Math.PI * 90 / 180
    let scale = new Vec2(2, 2)
    let translate = new Vec2(1, 0)
    let M = Matrix3x3.Translation(origin).times(
        Matrix3x3.Rotation(rotation).times(
            Matrix3x3.Scale(scale).times(
                Matrix3x3.Translation(translate)
            )
        )
    )

    //origin property should be set first
    testModel.setPosition(origin, false)
    //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
    testModel.setMatrix(M);

    test('Empty vertex list', () => {
        expect(testModel.getVertices()).toEqual([])
    });

    test('(1,0) in local coordinates should go to (1,3) in world coordinates', () => {
        testModel.objectVertices = [new Vec2(0, 0)]
        expect(testModel.getVertices()).VecListToBeCloseTo([new Vec2(1, 3)])
    });
});

describe('Tests for setVertices', () => {
    const testModel = new AModel2D();
    let origin = new Vec2(1, 0)
    let rotation = Math.PI * 90 / 180
    let scale = new Vec2(2, 2)
    let translate = new Vec2(1, 0)
    let M = Matrix3x3.Translation(origin).times(
        Matrix3x3.Rotation(rotation).times(
            Matrix3x3.Scale(scale).times(
                Matrix3x3.Translation(translate)
            )
        )
    )

    //origin property should be set first
    testModel.setPosition(origin, false)
    //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
    testModel.setMatrix(M);

    test('Origin in world coordinates', () => {
        testModel.setVertices([new Vec2(0, 0)])
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(-1, 0.5)])
        expect(testModel.objectSpaceCorners).VecListToBeCloseTo([new Vec2(-1, 0.5), new Vec2(-1, 0.5), new Vec2(-1, 0.5), new Vec2(-1, 0.5)])
    });
    test('Test square', () => {
        testModel.setVertices([new Vec2(1, 1), new Vec2(-1, 1), new Vec2(1, -1), new Vec2(-1, -1)])
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(-0.5, 0), new Vec2(-0.5, 1), new Vec2(-1.5, 0), new Vec2(-1.5, 1)])
        expect(testModel.objectSpaceCorners).VecListToBeCloseTo([new Vec2(-1.5, 0), new Vec2(-0.5, 0), new Vec2(-0.5, 1), new Vec2(-1.5, 1)])
    });

    test('Test triangle', () => {
        testModel.setVertices([new Vec2(1, 1), new Vec2(-1, -1), new Vec2(2, -2)])
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(-0.5, 0), new Vec2(-1.5, 1), new Vec2(-2, -0.5)])
        expect(testModel.objectSpaceCorners).VecListToBeCloseTo([new Vec2(-2, -0.5), new Vec2(-0.5, -0.5), new Vec2(-0.5, 1), new Vec2(-2, 1)])

    });

    test('Test triangle with negative scale', () => {
        testModel.setScale(new Vec2(-2, -2,), true);
        testModel.setVertices([new Vec2(1, 1), new Vec2(-1, -1), new Vec2(2, -2)])
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(-1.5, 0), new Vec2(-0.5, -1), new Vec2(0, 0.5)])
        expect(testModel.objectSpaceCorners).VecListToBeCloseTo([new Vec2(-1.5, -1), new Vec2(0,-1), new Vec2(0, 0.5), new Vec2(-1.5, 0.5)])

    });

});

describe('Tests for renormalize', () => {
    const testModel = new AModel2D();
    let origin = new Vec2(1, 0)
    let rotation = Math.PI * 90 / 180
    let scale = new Vec2(2, 2)
    let translate = new Vec2(1, 0)
    let M = Matrix3x3.Translation(origin).times(
        Matrix3x3.Rotation(rotation).times(
            Matrix3x3.Scale(scale).times(
                Matrix3x3.Translation(translate)
            )
        )
    )

    //origin property should be set first
    testModel.setPosition(origin, false)
    //setMatrix also calls updateMatrixProperties which will update rotation, scale, and anchor property.
    testModel.setPosition(origin, false)
    testModel.setMatrix(M);

    test("No object vertices, shouldn't change anything", () => {
        testModel.renormalizeVertices()
        expect(testModel.objectVertices).VecListToBeCloseTo([])
    })

    test("One object vertices, shouldn't change anything", () => {
        //Reset M matrix.
        testModel.setPosition(origin, false)
        testModel.setMatrix(M);

        testModel.objectVertices = [new Vec2(1, 1)]
        testModel.renormalizeVertices()
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(1, 1)])
    })

    test("Scaled unit square should be scaled down to unit square. Also, coordinates not in same order as in objectSpaceCorners", () => {
        //Reset M matrix
        testModel.setPosition(origin, false)
        testModel.setMatrix(M);

        testModel.objectVertices = [new Vec2(10, 10), new Vec2(-10, 10), new Vec2(10, -10), new Vec2(-10, -10)]
        testModel.objectSpaceCorners = [new Vec2(-10, -10), new Vec2(10, -10), new Vec2(10, 10), new Vec2(-10, 10)]
        testModel.renormalizeVertices()
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5), new Vec2(0.5, -0.5), new Vec2(-0.5, -0.5)])
    })

    test("Test Normalization on triangle", () => {
        //Reset M matrix
        testModel.setPosition(origin, false)
        testModel.setMatrix(M);

        testModel.objectVertices = [new Vec2(1, 0), new Vec2(-1, 0), new Vec2(0, 1)]
        testModel.objectSpaceCorners = [new Vec2(-1, 0), new Vec2(1, 0), new Vec2(1, 1), new Vec2(-1, 1)]
        testModel.renormalizeVertices()
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(0.5, -0.5), new Vec2(-0.5, -0.5), new Vec2(0, 0.5)])
    })

    test("Test Normalization with more than 4 points", () => {
        //Reset M Matrix
        testModel.setPosition(origin, false)
        testModel.setMatrix(M);

        testModel.objectVertices = [new Vec2(0, 0), new Vec2(1, 1), new Vec2(2, -2), new Vec2(-2, 0.5), new Vec2(-1, -1)]
        testModel.objectSpaceCorners = [new Vec2(-2, -2), new Vec2(2, -2), new Vec2(2, 1), new Vec2(-2, 1)]
        testModel.renormalizeVertices()
        expect(testModel.objectVertices).VecListToBeCloseTo([new Vec2(0, 1 / 6), new Vec2(0.25, 0.5), new Vec2(0.5, -0.5), new Vec2(-0.5, 1 / 3), new Vec2(-0.25, -1 / 6)])
    })
});
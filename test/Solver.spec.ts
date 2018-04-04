import {ExhaustiveSolver} from "../src/Solver";
import {generateSampleCourses} from "./CourseParser";

/**
 * Created by Charlie on 2018-03-30.
 */

describe('ExhaustiveSolver', function () {
    let solver: ExhaustiveSolver;
    it('should be created', function () {
        solver = new ExhaustiveSolver(generateSampleCourses(5));
    });

    it('should solve for results', function () {

    });
});
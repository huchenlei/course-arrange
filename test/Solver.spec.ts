import {ExhaustiveSolver, StepHeuristicSolver} from "../src/Solver";
import {generateSampleCourses} from "./CourseParser";
import {TimeConflictConstraint} from "../src/Constraint";
import {expect} from "chai";
import log = require("loglevel");

log.enableAll();

/**
 * Created by Charlie on 2018-03-30.
 */

const sampleCourses = generateSampleCourses(6, 2, 3);

const constraints = [
    new TimeConflictConstraint()
];

describe('ExhaustiveSolver', function () {
    let solver: ExhaustiveSolver;
    it('should be created', function () {
        solver = new ExhaustiveSolver(sampleCourses);
    });

    it('should solve for results', function () {
        console.time("Exhaustive Solve");
        const result = solver.solve(constraints, 1);
        console.timeEnd("Exhaustive Solve");

        expect(result.length).to.be.equal(1);
    });
});

describe('StepHeuristicSolver', function () {
    let solver: StepHeuristicSolver;
    it('should be created', function () {
        solver = new StepHeuristicSolver(sampleCourses);
    });

    it('should solve for results', function () {
        console.time("HeuristicSolver");
        const result = solver.solve(constraints, 1);
        console.timeEnd("HeuristicSolver");

        expect(result.length).to.be.equal(1);
    });
});
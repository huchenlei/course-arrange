import {ExhaustiveSolver, StepHeuristicSolver} from "../src/Solver";
import {generateSampleCourses} from "./CourseParser";
import {TimeConflictConstraint} from "../src/Constraint";
import {expect} from "chai";
import log = require("loglevel");

log.enableAll();

/**
 * Created by Charlie on 2018-03-30.
 */

const sampleCourses = generateSampleCourses(5, 1, 3);

const constraints = [
    new TimeConflictConstraint()
];

describe('ExhaustiveSolver', function () {
    let solver: ExhaustiveSolver;
    it('should be created', function () {
        solver = new ExhaustiveSolver(sampleCourses);
    });

    it('should solve for results', function () {
        const resultNum = 10;
        console.time("Exhaustive Solve");
        const result = solver.solve(constraints, resultNum);
        console.timeEnd("Exhaustive Solve");

        expect(result.length).to.be.equal(resultNum);
        let prev = null;
        for (let r of result) {
            if (prev != null)
                expect(r.score <= prev.score).to.be.true;
            prev = r;
        }

        console.log(result);
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
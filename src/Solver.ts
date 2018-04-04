/**
 * On average the user would choose 5 courses, each course typically
 * has 3 course units, and the course unit typically has 3 possible time slots
 * which results in 3^15 possible combinations (Around 14M)
 *
 * Created by Charlie on 2018-03-30.
 */
import {Course, CourseComponent, CourseSolution} from "./Course";
import {Constraint} from "./Constraint";
import Collections = require("typescript-collections");
import log = require("loglevel");

export abstract class Solver {
    protected courses: Course[];
    protected components: CourseComponent[];

    protected constructor(courses: Course[]) {
        log.info("Solver with following courses");
        courses.forEach(c => log.info(c.name));
        this.courses = courses;
        this.components = [];
        for (let course of courses) {
            for (let component of course.components) {
                this.components.push(component);
            }
        }
    }

    public abstract solve(constraints: Constraint[], resultNum: number)
        : CourseSolution[];
}

export class ExhaustiveSolver extends Solver {
    constructor(courses: Course[]) {
        super(courses);
    }

    solve(constraints: Constraint[], resultNum: number = 10): CourseSolution[] {
        log.info(`${this.components.length} components to consider`);
        log.info(`components has respective number of optional section ${
            this.components.map(c => c.sections.length)}`);

        const rootSolution = new CourseSolution();
        const components = this.components;
        const solutions = new Collections.PriorityQueue<CourseSolution>(
            (a, b) => {
                if (a.score == b.score) {
                    return 0;
                } else if (a.score < b.score) {
                    return -1;
                } else {
                    return 1;
                }
            }
        );
        let solutionCount = 0;

        function _solve(solution: CourseSolution, componentIndex: number) {
            if (componentIndex == components.length) {
                solutionCount++; // Count every possible solution found
                // End of recursion
                if (solutions.size() < resultNum) {
                    solutions.add(solution);
                } else if ((<CourseSolution>solutions.peek()).score < solution.score) {
                    solutions.dequeue();
                    solutions.add(solution);
                }
                return;
            }

            for (let section of components[componentIndex].sections) {
                let newSolution = solution.addCourseSection(constraints, section);
                _solve(newSolution, componentIndex + 1);
            }
        }

        _solve(rootSolution, 0);
        log.info(`${solutionCount} solution(s) found in total`);

        const _solution: CourseSolution[] = [];
        solutions.forEach(s => {
            _solution.push(s);
        });
        return _solution;
    }
}

export class StepHerusticSolver extends Solver {
    solve(constraints: Constraint[], resultNum: number = 10): CourseSolution[] {
        return [];
    }
}
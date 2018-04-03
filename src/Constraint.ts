'use strict';
import {CourseSection, CourseSolution} from "./Course";

/**
 * Created by Charlie on 2018-04-02.
 */

export abstract class Constraint {
    public name: string;
    public description: string;
    public priority: number;

    /**
     * Default constructor of constraint objects
     *
     * @param {string} name name of constraint
     * @param {number} priority ranges in [0, 10] where 1 means least significant
     * @param {string} description optional description string
     */
    protected constructor(name: string, priority: number = 1, description: string = "") {
        this.name = name;
        this.priority = priority;
        this.description = description;
    }

    public eval(solution: CourseSolution, toAdd: CourseSection) {
        return this._eval(solution, toAdd) * Math.pow(10, this.priority);
    }

    /**
     * The returned score change lies in range [-1, 1]
     *
     * @param {CourseSolution} solution current choices
     * @param {CourseSection} toAdd the course section to add to current choices
     * @return {number} the score change after adding the course to current choices
     */
    protected abstract _eval(solution: CourseSolution, toAdd: CourseSection): number;
}

export class TimeConflictConstraint extends Constraint {
    /**
     * By default NOT having a time conflict is the most important metric
     * for a valid solution
     *
     * @param {number} priority
     */
    constructor(priority: number = 10) {
        super("TimeConflictConstraint", priority);
    }

    public _eval(solution: CourseSolution, toAdd: CourseSection): number {
        let intersect = false;
        for (let choice of solution.choices) {
            intersect = intersect || toAdd.intersect(choice);
        }
        return intersect ? -1 : 0;
    }
}
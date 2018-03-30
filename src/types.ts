/**
 * This file defines models (beans) used in the whole project
 * Created by Charlie on 2018-03-30.
 */

/**
 * "ca" stands for course arrange
 */
namespace CourseArrange {
    export enum CourseUnitType {
        LEC, // Lecture
        TUT, // Tutorial
        PRA, // Lab
    }

    /**
     * Represent a continuous time slot which the course takes, e.g. 10:00 ~ 12:00
     */
    export interface CourseSection {
        start: number;
        end: number;
    }

    /**
     * Represent a particular part of the course, e.g. Lectures
     */
    export interface CourseUnit {
        type: CourseUnitType;
        sections: Array<CourseSection>;
    }

    export interface Course {
        name: string;
        units: Array<CourseUnit>;
    }

    export interface CourseSolution {
        course: Course;
        selection: Array<number>; // Corresponding to each course unit
    }

    interface _Constraint {
        (solution: Array<CourseSolution>): number;
    }

    export interface Constraint {
        name: string;
        description?: string;
        penalty: number;
        eval: _Constraint;
    }
}

import {Constraint} from "./Constraint";

/**
 * Created by Charlie on 2018-04-02.
 */
export class Time {
    day: number;
    start: number;
    end: number;

    constructor(day: number, start: number, end: number) {
        if (start > end)
            throw `Time ends(${end}) before start(${start})`;
        if (day < 1 || day > 7)
            throw `Invalid week day ${day}, must in range [1, 7]`;
        this.day = day;
        this.start = start;
        this.end = end;
    }

    intersect(a: Time): boolean {
        if (a.day != this.day)
            return false;
        else {
            return (a.start > this.end || this.start > a.end)
        }
    }
}

export class CourseSection {
    belongsTo: CourseComponent | null;
    times: Time[];

    constructor(times: Time[]) {
        this.belongsTo = null;
        this.times = times;
    }

    intersect(a: CourseSection): boolean {
        for (let time of this.times) {
            for (let otherTime of a.times) {
                if (time.intersect(otherTime)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export enum CourseComponentType {
    LEC, // Lecture
    TUT, // Tutorial
    PRA, // Lab
    UNKNOWN,
}

export class CourseComponent {
    belongsTo: Course | null;
    public type: CourseComponentType;
    public sections: Array<CourseSection>;

    public constructor(type: CourseComponentType,
                       sections: Array<CourseSection>) {
        this.type = type;
        this.sections = sections;
        sections.forEach(s => s.belongsTo = this);
        this.belongsTo = null;
    }

}

export class Course {
    public name: string;
    public components: Array<CourseComponent>;

    public constructor(name: string, components: Array<CourseComponent>) {
        this.name = name;
        this.components = components;
        components.forEach(c => c.belongsTo = this);
    }
}

export class CourseSolution {
    private readonly _score: number;
    public choices: CourseSection[];

    constructor(score: number = 0, choices: CourseSection[] = []) {
        this._score = score;
        // Deep copy the choices
        this.choices = Object().assign([], choices);
    }

    public addCourseSection(constraints: Constraint[], section: CourseSection) {
        let newScore = this._score;
        for (let constraint of constraints) {
            newScore += constraint.eval(this, section);
        }
        return new CourseSolution(newScore, this.choices.concat([section]));
    }

    get score(): number {
        return this._score;
    }
}

import {Constraint} from "./Constraint";

/**
 * Created by Charlie on 2018-04-02.
 */

export class CourseSection {
    belongsTo: CourseComponent | null;
    day: number;
    end: number;
    start: number;

    constructor(day: number, end: number, start: number) {
        if (start > end)
            throw `Course ends(${end}) before start(${start})`;
        if (day < 1 || day > 7)
            throw `Invalid week day ${day}, must in range [1, 7]`;

        this.day = day;
        this.end = end;
        this.start = start;
        this.belongsTo = null;
    }

    intersect(a: CourseSection): boolean {
        if (a.day != this.day)
            return false;
        else {
            return (a.start > this.end || this.start > a.end)
        }
    }
}

export enum CourseComponentType {
    LEC, // Lecture
    TUT, // Tutorial
    PRA, // Lab
}

export class CourseComponent {
    belongsTo: Course | null;
    public type: CourseComponentType;
    public sections: Array<CourseSection>;

    public constructor(type: CourseComponentType,
                       ...sections: Array<CourseSection>) {
        this.type = type;
        this.sections = sections;
        sections.forEach(s => s.belongsTo = this);
        this.belongsTo = null;
    }
}

export class Course {
    public name: string;
    public components: Array<CourseComponent>;

    public constructor(name: string, ...components: Array<CourseComponent>) {
        this.name = name;
        this.components = components;
        components.forEach(c => c.belongsTo = this);
    }
}

export class CourseSolution {
    private _score: number;
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

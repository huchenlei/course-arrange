import {Constraint} from "./Constraint";
import _ = require("lodash");

/**
 * Created by Charlie on 2018-04-02.
 */

export class Location {
    name: string;
    longitude: number;
    latitude: number;

    constructor(name: string = "UNKNOWN", longitude: number = 0, latitude: number = 0) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    static toRadian(degree: number): number {
        return Math.PI * degree / 180;
    }

    distanceTo(other: Location): number {
        const R = 6371; // Radius of earth
        const latDiff = Location.toRadian(this.latitude - other.latitude);
        const longDiff = Location.toRadian(this.longitude - other.longitude);
        const sinLatDiff = Math.sin(latDiff / 2);
        const sinLongDiff = Math.sin(longDiff / 2);

        const a = sinLatDiff * sinLatDiff
            + Math.cos(Location.toRadian(this.latitude))
            * Math.cos(Location.toRadian(other.latitude))
            * sinLongDiff * sinLongDiff;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // Convert to Meters
    }
}

export class Time {
    belongsTo: CourseSection | null;
    day: number;
    start: number;
    end: number;
    location: Location;

    constructor(day: number, start: number, end: number, location: Location = new Location("UNKNOWN", 0, 0)) {
        if (start > end)
            throw `Time ends(${end}) before start(${start})`;
        if (day < 1 || day > 7)
            throw `Invalid week day ${day}, must in range [1, 7]`;
        this.belongsTo = null;
        this.day = day;
        this.start = start;
        this.end = end;
        this.location = location;
    }

    intersect(a: Time): boolean {
        if (a.day != this.day)
            return false;
        else {
            return (this.start <= a.start && this.end > a.start) ||
                (this.start < a.end && this.end >= a.end) ||
                (this.start >= a.start && this.end <= a.end) ||
                (this.start <= a.start && this.end >= a.end)
        }
    }

    adjacent(a: Time): boolean {
        if (a.day != this.day)
            return false;
        else {
            return (a.start == this.end) || (this.start == a.end);
        }
    }

    toString(): string {
        return `{day: ${this.day}, start: ${this.start}, end: ${this.end}}`;
    }

    equals(other: Time): boolean {
        return (this.day == other.day)
            && (this.start == other.start)
            && (this.end == other.end);
    }
}

export class CourseSection {
    belongsTo: CourseComponent | null;
    sectionCode?: string;
    times: Time[];

    constructor(times: Time[], sectionCode?:string) {
        this.belongsTo = null;
        this.times = _.uniqBy(times, t => t.toString());
        for (let time of this.times) {
            time.belongsTo = this;
        }
        this.sectionCode = sectionCode;
    }

    intersect(a: CourseSection | Time): boolean {
        if (a instanceof Time) {
            for (let time of this.times)
                if (time.intersect(a))
                    return true;
            return false;
        } else {
            for (let time of this.times)
                for (let otherTime of a.times)
                    if (time.intersect(otherTime))
                        return true;
            return false;
        }
    }

    toString(): string {
        if (this.belongsTo == null || this.belongsTo.belongsTo == null) {
            return "";
        } else {
            return `course: ${this.belongsTo.belongsTo.name} type: ${
                this.belongsTo.type} times: ${
                this.times.map(t => t.toString())}`;
        }
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
        this.choices = Object.assign([], choices);
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

    compareTo(other: CourseSolution): number {
        if (this.score == other.score) {
            return 0;
        } else if (this.score < other.score) {
            return -1;
        } else {
            return 1;
        }
    }
}

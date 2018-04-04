'use strict';
import {Course, CourseComponent, CourseComponentType, CourseSection, Time} from "../src/Course";
import fs = require("fs");
import Set from "typescript-collections/dist/lib/Set";
import _ = require("lodash");

const DATA_ROOT = './test/resources/courses/';

declare module UofT {
    export interface Time {
        day: string;
        start: number;
        end: number;
        duration: number;
        location: string;
    }

    export interface MeetingSection {
        code: string;
        instructors: string[];
        times: Time[];
        size: number;
        enrolment: number;
    }

    export interface Course {
        id: string;
        code: string;
        name: string;
        description: string;
        division: string;
        department: string;
        prerequisites: string;
        exclusions: string;
        level: number;
        campus: string;
        term: string;
        breadths: number[];
        meeting_sections: MeetingSection[];
    }
}

function parseCourseFromJson(file: string): Course {
    const rawCourse = <UofT.Course>JSON.parse(fs.readFileSync(file, 'utf-8'));

    function weekStringToNum(week: string): number {
        switch (week) {
            case "MONDAY":
                return 1;
            case "TUESDAY":
                return 2;
            case "WEDNESDAY":
                return 3;
            case "THURSDAY":
                return 4;
            case "FRIDAY":
                return 5;
            case "SATURDAY":
                return 6;
            case "SUNDAY":
                return 7;
            default:
                throw new Error("Invalid week string " + week);
        }
    }

    return new Course(rawCourse.id,
        _.toPairs(_.groupBy(rawCourse.meeting_sections,
            section => section.code.charAt(0)))
            .map(
                value => {
                    const type = value[0];
                    const sections = value[1];
                    let componentType;
                    switch (type) {
                        case 'L':
                            componentType = CourseComponentType.LEC;
                            break;
                        case 'T':
                            componentType = CourseComponentType.TUT;
                            break;
                        case 'P':
                            componentType = CourseComponentType.PRA;
                            break;
                        default:
                            componentType = CourseComponentType.UNKNOWN;
                    }
                    return new CourseComponent(componentType,
                        sections.map(section =>
                            new CourseSection(section.times.map(
                                time => {
                                    const start = Math.round(time.start / 3600);
                                    const end = Math.round(time.end / 3600);
                                    return new Time(weekStringToNum(time.day), start, end);
                                }
                            ))
                        ));
                }
            )
    );
}

export function generateSampleCourses(courseNum: number): Course[] {
    const files = fs.readdirSync(DATA_ROOT);
    const indexSet = new Set<number>();
    while (indexSet.size() < courseNum) {
        indexSet.add(Math.round(Math.random() * files.length));
    }

    let result: Course[] = [];
    indexSet.forEach(i => {
        result.push(parseCourseFromJson(DATA_ROOT + files[i]));
    });
    return result;
}
'use strict';
import {Course, CourseComponent, CourseComponentType, CourseSection, Time, Location} from "../src/Course";
import fs = require("fs");
import Collections = require("typescript-collections");
import _ = require("lodash");

const COURSE_DATA_ROOT = './test/resources/courses/';
const BUILDING_DATA_ROOT = './test/resources/buildings/';

export declare module UofT {
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

    export interface Address {
        street: string;
        city: string;
        province: string;
        country: string;
        postal: string;
    }

    export interface Building {
        id: string;
        code: string;
        name: string;
        short_name: string;
        campus: string;
        address: Address;
        lat: number;
        lng: number;
        polygon: number[][];
    }
}

const LOC_TABLE = new Collections.Dictionary<string, Location>();
{
    const files = fs.readdirSync(BUILDING_DATA_ROOT);
    for (let file of files) {
        const building = <UofT.Building>JSON.parse(
            fs.readFileSync(BUILDING_DATA_ROOT + file, 'utf-8'));
        LOC_TABLE.setValue(building.code, new Location(
            building.code,
            building.lat,
            building.lng
        ));
    }
}

export function parseCourse(rawCourse: UofT.Course) {
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
                                    const locationName = time.location.split(" ")[0];
                                    let location = LOC_TABLE.getValue(locationName);
                                    if (location == undefined)
                                        location = new Location();
                                    return new Time(weekStringToNum(time.day), start, end, location);
                                }
                            ))
                        ));
                }
            )
    );
}

export function parseCourseFromJsonString(jsonString: string): Course {
    const rawCourse = <UofT.Course>JSON.parse(jsonString);
    return parseCourse(rawCourse);
}

export function parseCourseFromJsonFile(file: string): Course {
    return parseCourseFromJsonString(fs.readFileSync(file, 'utf-8'));
}

export function generateSampleCourses(courseNum: number,
                                      minComponent: number = 1,
                                      minSection: number = 1): Course[] {
    const files = fs.readdirSync(COURSE_DATA_ROOT);
    const indexSet = new Collections.Set<number>();
    const result: Course[] = [];

    while (indexSet.size() < courseNum) {
        const index = Math.round(Math.random() * files.length);
        if (indexSet.contains(index))
            continue;
        const course = parseCourseFromJsonFile(COURSE_DATA_ROOT + files[index]);
        if (course.components.length < minComponent)
            continue;
        let hasViolation = false;
        for (let component of course.components) {
            if (component.sections.length < minSection) {
                hasViolation = true;
                break;
            }

            for (let section of component.sections) {
                if (section.times.length == 0) {
                    hasViolation = true;
                    break;
                }
            }
            if (hasViolation) break;
        }
        if (hasViolation) continue;
        indexSet.add(index);
        result.push(course);
    }
    return result;
}
import {generateSampleCourses} from "./CourseParser";
import {expect} from "chai";
import {CourseComponentType} from "../src/Course";

describe("CourseParser", function () {
    const GEN_NUM = 10;
    const courses = generateSampleCourses(GEN_NUM);
    it("should return exact number of courses", function () {
        expect(courses.length).to.be.equal(GEN_NUM);
    });

    it("should generate valid data structure", function () {
        for (let course of courses) {
            console.log(course.name);
            expect(course.name.length).greaterThan(0);

            for (let component of course.components) {
                expect(component.type).to.not.be.equal(CourseComponentType.UNKNOWN);
                expect(component.belongsTo).to.be.equal(course);

                for (let section of component.sections) {
                    expect(section.belongsTo).to.be.equal(component);
                }
            }
        }
    });
});
import { Router, type Request, type Response } from "express";
import { courses } from "../db/db.js";
import type { Course } from "../libs/types.js"
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody
} from "../schemas/courseValidator.js";

const course_router: Router = Router();


// READ all
course_router.get("/courses", ( req: Request, res: Response ) => {
    return res.json({ 
        data: courses 
    });
});

// Params URL 
course_router.get("/courses/:courseId", ( req: Request, res: Response ) => {
    const courseId = Number(req.params.courseId);
    const result = zCourseId.safeParse(courseId);

    if (!result.success) {
    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
    });
    }

    const foundIndex = courses.findIndex((course) => course.courseId === courseId);

    if (foundIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
    }

    res.set("Link", `/courses/${courseId}`);
    return res.json({
        success: true,
        message: `Get course ${courseId} successfully`,
        data: courses[foundIndex],
    });
});

course_router.post("/courses", ( req: Request, res: Response ) => {
    const body = req.body as Course;
    const result = zCoursePostBody.safeParse(body);

    if (!result.success) {
    return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
    });
    }

    const found = courses.find((course) => course.courseId === body.courseId);
    if (found) {
    return res.status(409).json({
        success: false,
        message: "Course already exists",
    });
    }

    const newCourse = body;
    courses.push(newCourse);

    res.set("Link", `/courses/${newCourse.courseId}`);
    return res.status(201).json({
        success: true,
        data: newCourse,
    });
});

course_router.put("/courses", ( req: Request, res: Response ) => {
    const body = req.body as Course;
    const result = zCoursePutBody.safeParse(body);

    if (!result.success) {
    return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
    });
    }

    const foundIndex = courses.findIndex((course) => course.courseId === body.courseId);

    if (foundIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
    }

    courses[foundIndex] = { ...courses[foundIndex], ...body };

    res.set("Link", `/courses/${body.courseId}`);
    return res.json({
        success: true,
        message: `Course ${body.courseId} updated successfully`,
        data: courses[foundIndex],
    });
});

course_router.delete("/courses", ( req: Request, res: Response ) => {
    const body = req.body as { courseId: number };
    const result = zCourseDeleteBody.safeParse(body);

    if (!result.success) {
    return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
    });
    }

    const foundIndex = courses.findIndex((course) => course.courseId === body.courseId);

    if (foundIndex === -1) {
    return res.status(404).json({
        success: false,
        message: "Course not found",
    });
    }

    courses.splice(foundIndex, 1);

    return res.status(204).send();
});

export default course_router;

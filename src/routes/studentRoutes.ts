import { Router, type Request, type Response } from "express";
import {
    zStudentId,
} from "../schemas/studentValidator.js";
import type { Student } from "../libs/types.js"
import { students, courses } from "../db/db.js";

const student_router = Router();

student_router.get("/students/:studentId/courses", (req: Request, res: Response) => {
  const { studentId } = req.params;

  const result = zStudentId.safeParse(studentId);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues[0]?.message,
    });
  }

  const student = students.find((s) => s.studentId === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student does not exist",
    });
  }

  res.set("Link", `/students/${studentId}`);

  const studentCourseIds = student.courses || [];
  const studentCourses = courses
    .filter((c) => studentCourseIds.includes(c.courseId))
    .map((c) => ({
      courseId: c.courseId,
      courseTitle: c.courseTitle,
    }));

  return res.json({
    success: true,
    message: `Get courses detail of student ${studentId}`,
    data: {
      studentId: student.studentId,
      courses: studentCourses,
    },
  });
});

export default student_router;

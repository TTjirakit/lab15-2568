import express, { type Request, type Response } from "express";
import morgan from 'morgan';

import student_router from "./routes/studentRoutes.js"
import course_router from "./routes/courseRoutes.js"


const app: any = express();
const port  = 3000;

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "lab 15 API service successfully",
  });
});

app.get("/me", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Student information",
    data: {
      studentId: "670610681",
      firstName: "Jeerakit",
      lastName: "Attaittiruj",
      program: "CPE",
      section: "001",
    },
  });
});

app.use("/api/v2",student_router);
app.use("/api/v2",course_router);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;

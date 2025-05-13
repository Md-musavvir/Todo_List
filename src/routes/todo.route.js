import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  getAllTodo,
  updateTodo,
} from "../controllers/todo.controller.js";

const router = Router();
router.use(verifyJwt);

router.post("/createTodo", createTodo);
router.get("/getAll", getAllTodo);
router.put("/update/:todoId", updateTodo);
router.delete("/delete/:todoId", deleteTodo);

export default router;

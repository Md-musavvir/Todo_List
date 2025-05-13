import { Todo } from "../models/todo.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import { json } from "express";
import ApiResponse from "./../utils/ApiResponse.js";

const createTodo = asyncHandler(async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !dueDate) {
    throw new ApiError(400, "data is required");
  }
  const todo = await Todo.create({
    title,
    completed: false,
    dueDate,
    userId: req.user._id,
  });
  res.status(200).json(new ApiResponse(200, todo, "todo created successfully"));
});
const getAllTodo = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id });
  if (!todos || todos.length === 0) {
    throw new ApiError(404, "no todo's found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, todos, "All todos fetched successfully"));
});
const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  console.log("Requested Todo ID:", todoId);
  console.log("Authenticated User ID from Token:", req.user._id);

  if (!todoId) {
    throw new ApiError(400, "No todoId is present");
  }

  // Optional: Check if todo exists and belongs to this user
  const todoCheck = await Todo.findById(todoId);
  if (!todoCheck) {
    throw new ApiError(404, "Todo not found");
  }
  console.log("Found Todo:", todoCheck);
  console.log("Todo's userId:", todoCheck.userId);

  // Delete only if it belongs to the current user
  const todo = await Todo.findOneAndDelete({
    _id: todoId,
    userId: req.user._id,
  });

  if (!todo) {
    throw new ApiError(403, "Not authorized to delete this todo");
  }

  res.status(200).json(new ApiResponse(200, {}, "Todo deleted successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  try {
    const { todoId } = req.params;

    const { title, completed, dueDate } = req.body;

    if (!todoId) {
      console.log(req.params);

      throw new ApiError(400, "Todo ID is required");
    }

    if (
      title === undefined &&
      completed === undefined &&
      dueDate === undefined
    ) {
      throw new ApiError(400, "At least one field is required to update");
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { $set: { title, completed, dueDate } },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      throw new ApiError(404, "Todo not found or not authorized");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedTodo, "Todo updated successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "something went wrong");
  }
});
export { createTodo, deleteTodo, getAllTodo, updateTodo };

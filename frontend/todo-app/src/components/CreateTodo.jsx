import React, { useState } from "react";
import axios from "axios";

function CreateTodo() {
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
  const [ltodo, setltodo] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v2/todo/createTodo",
        {
          title: todo,
          dueDate: date,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setltodo((prev) => [
          ...prev,
          { title: todo, dueDate: date, _id: response.data.data._id },
        ]);
        setTodo("");
        setDate("");
      }
    } catch (error) {
      console.log("Error in creating Todo", error.message);
    }
  };

  const handleUpdateToggle = async (item) => {
    if (editingId === item._id) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/v2/todo/update/${item._id}`,
          {
            title: editData.title,
            dueDate: editData.dueDate,
            completed: false,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          const updatedTodos = ltodo.map((todo) =>
            todo._id === item._id ? { ...todo, ...editData } : todo
          );
          setltodo(updatedTodos);
          setEditingId(null);
          setEditData({});
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setEditingId(item._id);
      setEditData({ title: item.title, dueDate: item.dueDate });
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v2/todo/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setltodo((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create New Todo
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="todo" className="block text-gray-700 font-medium">
            Todo Title
          </label>
          <input
            type="text"
            id="todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter todo title"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-gray-700 font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Submit Todo
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-center mb-4">Todo List</h3>
        {ltodo.length === 0 ? (
          <p className="text-center text-gray-500">No todos added yet.</p>
        ) : (
          <div className="space-y-4">
            {ltodo.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 border p-3 rounded-md bg-gray-50"
              >
                <input
                  type="text"
                  value={editingId === item._id ? editData.title : item.title}
                  readOnly={editingId !== item._id}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className={`p-2 border rounded-md w-2/5 ${
                    editingId !== item._id ? "bg-gray-100" : ""
                  }`}
                />
                <input
                  type="date"
                  value={
                    editingId === item._id ? editData.dueDate : item.dueDate
                  }
                  readOnly={editingId !== item._id}
                  onChange={(e) => handleEditChange("dueDate", e.target.value)}
                  className={`p-2 border rounded-md w-1/3 ${
                    editingId !== item._id ? "bg-gray-100" : ""
                  }`}
                />
                <button
                  onClick={() => handleUpdateToggle(item)}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  {editingId === item._id ? "Submit" : "Update"}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow"
                  title="Delete Todo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTodo;

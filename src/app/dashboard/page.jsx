"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "../../lib/firebase";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setTasks(data);
  };

  const createTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    await addDoc(collection(db, "tasks"), {
      title,
      description,
      status: "Pending",
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const updateTask = async () => {
    await updateDoc(
      doc(db, "tasks", editingId),
      {
        title,
        description,
      }
    );

    setEditingId(null);
    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "tasks", id));

    fetchTasks();
  };

  const markCompleted = async (id) => {
    await updateDoc(
      doc(db, "tasks", id),
      {
        status: "Completed",
      }
    );

    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const chartData = [
    {
      name: "Pending",
      value: pendingTasks,
    },
    {
      name: "Completed",
      value: completedTasks,
    },
  ];

  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          TaskFlow Dashboard
        </h1>

        <p className="text-slate-400 mb-8">
          Logged in as {auth.currentUser?.email}
        </p>

        <div className="bg-slate-900 p-6 rounded-xl mb-8 shadow-lg">

          <h2 className="text-2xl font-semibold mb-4">
            {editingId
              ? "Edit Task"
              : "Add New Task"}
          </h2>

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 outline-none"
          />

          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-slate-800 mb-4 outline-none"
          />

          <div className="flex gap-3">

            <button
              onClick={
                editingId
                  ? updateTask
                  : createTask
              }
              className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingId
                ? "Update Task"
                : "Add Task"}
            </button>

            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                }}
                className="bg-slate-700 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-slate-400">
              Total Tasks
            </h3>
            <p className="text-4xl font-bold mt-2">
              {tasks.length}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-slate-400">
              Pending Tasks
            </h3>
            <p className="text-4xl font-bold mt-2">
              {pendingTasks}
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-slate-400">
              Completed Tasks
            </h3>
            <p className="text-4xl font-bold mt-2">
              {completedTasks}
            </p>
          </div>

        </div>

        <div className="bg-slate-900 rounded-xl p-6 mb-10">

          <h2 className="text-2xl font-semibold mb-4">
            Task Analytics
          </h2>

          <PieChart
            width={400}
            height={300}
          >
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>

        </div>

        <h2 className="text-2xl font-semibold mb-4">
          My Tasks
        </h2>

        {tasks.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-400">
            No tasks available
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900 rounded-xl p-6 mb-4"
            >
              <h3 className="text-xl font-semibold">
                {task.title}
              </h3>

              <p className="text-slate-400 mt-2">
                {task.description}
              </p>

              <p className="mt-3">
                Status:
                <span
                  className={`ml-2 font-semibold ${
                    task.status ===
                    "Completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {task.status}
                </span>
              </p>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => {
                    setEditingId(
                      task.id
                    );
                    setTitle(
                      task.title
                    );
                    setDescription(
                      task.description
                    );
                  }}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTask(
                      task.id
                    )
                  }
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

                {task.status !==
                  "Completed" && (
                  <button
                    onClick={() =>
                      markCompleted(
                        task.id
                      )
                    }
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    Complete
                  </button>
                )}

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}
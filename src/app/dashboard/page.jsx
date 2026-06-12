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
  const [generatedSubtasks, setGeneratedSubtasks] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

const fetchTasks = async () => {
  if (!auth.currentUser) return;

  setLoading(true);

  try {
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
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    setLoading(false);
  }
};

  const createTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

  await addDoc(collection(db, "tasks"), {
    title,
    description,
    subtasks: generatedSubtasks,
    status: "Pending",
    userId: auth.currentUser?.uid || "",
    createdAt: new Date(),
  });
    setGeneratedSubtasks("");
    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const generateSubtasks = async () => {
  if (!title.trim()) {
    alert("Please enter task title first");
    return;
  }

  try {
    setAiLoading(true);

    const response = await fetch(
      "/api/generate-subtasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: title,
        }),
      }
    );

    const data = await response.json();

    setGeneratedSubtasks(data.subtasks);
  } catch (error) {
    alert("AI generation failed");
  } finally {
    setAiLoading(false);
  }
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
    setGeneratedSubtasks("");
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
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      fetchTasks();
    }
  });

  return () => unsubscribe();
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
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-4">

  <h1 className="text-2xl md:text-4xl font-bold">
    TaskFlow Dashboard
  </h1>

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden bg-slate-800 px-3 py-2 rounded-lg"
  >
    ☰
  </button>

</div>

{
  menuOpen && (
    <div className="md:hidden bg-slate-900 rounded-lg p-4 mb-4">
      <p>Dashboard</p>
      <p>Analytics</p>
      <p>Tasks</p>
    </div>
  )
}

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

          {
  generatedSubtasks && (
    <div className="bg-slate-800 rounded-lg p-4 mb-4">

      <h3 className="font-semibold mb-2">
        AI Generated Subtasks
      </h3>

      <pre className="whitespace-pre-wrap text-sm">
        {generatedSubtasks}
      </pre>

    </div>
  )
}

          <div className="flex flex-col sm:flex-row gap-3">

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
              <button
  onClick={generateSubtasks}
  className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700"
>
  {
    aiLoading
      ? "Generating..."
      : "Generate AI Subtasks"
  }
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

          <div className="flex justify-center overflow-x-auto">

  <PieChart
    width={350}
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
        </div>

        {loading && (
  <div className="mb-4 text-blue-400">
    Loading tasks...
  </div>
)}

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
              {
  task.subtasks && (
    <div className="mt-3 bg-slate-800 p-3 rounded-lg">

      <p className="font-semibold mb-2">
        AI Subtasks
      </p>

      <pre className="whitespace-pre-wrap text-sm">
        {task.subtasks}
      </pre>

    </div>
  )
}

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

              <div className="flex flex-col sm:flex-row gap-3 mt-5">

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
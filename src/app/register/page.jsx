"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Register() {

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const router=useRouter();

  const register=async()=>{

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    router.push("/dashboard");
  };

 return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">

    <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-96">

      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Register
      </h1>

      <input
        className="w-full p-3 rounded bg-slate-800 text-white mb-4"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full p-3 rounded bg-slate-800 text-white mb-6"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        onClick={register}
        className="w-full bg-green-600 p-3 rounded hover:bg-green-700 text-white"
      >
        Register
      </button>

    </div>

  </div>
);
}
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Login(){

 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");

 const router=useRouter();

const login = async () => {
  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    console.log(userCredential.user);

    router.push("/dashboard");

  } catch (error) {
    console.error(error);
    alert(error.code);
  }
};

return (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">

    <div className="bg-slate-900 p-8 rounded-xl shadow-lg w-96">

      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Login
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
        onClick={login}
        className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700 text-white"
      >
        Login
      </button>

    </div>

  </div>
);
}
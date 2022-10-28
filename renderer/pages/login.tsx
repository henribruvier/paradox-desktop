import React, { useState } from "react";

import { User } from "@prisma/client";
import { useRouter } from "next/router";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onLogin = async () => {
    try {
      const user = await fetch("https://paradox-sand.vercel.app/api/user", {
        method: "POST",
        body: JSON.stringify({ name: username, password: password }),
      });
      if (user.status === 200) {
        user.json().then(async (data: User) => {
          if (data.role === "admin") {
            const jsonValue = JSON.stringify(data);
            console.log(jsonValue);
            localStorage.setItem("@user_obj", jsonValue);
            router.push("/home");
          }
        });
      }
    } catch (e) {
      //@ts-expect-error - this is a custom error
      setError(e.message);
    }
  };

  return (
    <div className="w-full h-screen items-center justify-center text-black">
      <div className="h-full flex items-center justify-center w-full px-2">
        <div className="flex flex-col gap-4">
          <p className="text-5xl font-bold mx-auto pb-10 ">Login as admin</p>
          <div>
            <input
              value={username}
              placeholder="Nom"
              color="black"
              style={{ color: "black" }}
              className="text-black "
              onChange={(e) => setUsername(() => e.target.value)}
            />
          </div>
          <div>
            <input
              value={password}
              placeholder="Password."
              style={{ color: "black" }}
              type="password"
              className="text-black"
              onChange={(e) => setPassword(() => e.target.value)}
            />
          </div>
          <button
            onClick={async () => await onLogin()}
            className="flex items-center justify-center bg-indigo-500 rounded-full py-2 px-4"
          >
            <p className="font-bold text-white">Login as admin</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

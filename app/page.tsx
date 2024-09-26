"use client";

import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { useEffect, useState } from "react";

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    console.log(WebApp.initData);
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      axios
        .post("https://x-roach-dev.up.railway.app/api/login", {
          authData: WebApp.initData,
        })
        .then((res) => {
          setRes(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [userData]);

  return (
    <main className="p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">User Data</h1>
          <ul>
            <li>
              ID:{" "}
              {userData.id
                .toString()
                .split("")
                .map((a) => "*")}
            </li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name || "N/A"}</li>
            <li>Username: {userData.username || "N/A"}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? "Yes" : "No"}</li>
            {res && <li>Response: {JSON.stringify(res, null, "\t")}</li>}
            {error && <li>Error: {JSON.stringify(error, null, "\t")}</li>}
          </ul>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}

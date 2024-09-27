"use client";

import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { useEffect, useState } from "react";
const client = axios.create({
  baseURL: "https://x-roach-dev.up.railway.app/api/",
  withCredentials: true,
});

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
  const [pinRes, setPinRes] = useState<string[]>([]);
  useEffect(() => {
    console.log(WebApp.initData);
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  useEffect(() => {
    const authData = {
      initData: WebApp.initData,
      initDataUnsafe: WebApp.initDataUnsafe,
    };
    console.log(authData);
    if (userData) {
      client
        .post("login", {
          authData,
        })
        .then((res) => {
          setRes(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [userData]);

  const pin = () => {
    client
      .post("pin")
      .then((res) => {
        console.log(res.data);
        setPinRes([...pinRes, res.data.message]);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  };

  return (
    <main
      className="p-4"
      style={{
        backgroundColor: "white",
      }}
    >
      {userData ? (
        <div
          className="max-w-full"
          style={{
            display: "flex",
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
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
            {res && <li>Login: {"Ok."}</li>}
            {error && <li>Error: {JSON.stringify(error, null, "\t")}</li>}
          </ul>
          <br />
          <button onClick={pin}>Pin</button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              flexWrap: "wrap",
              maxWidth: "100%",
            }}
          >
            {" "}
            {pinRes.map((pong, i) => {
              return <span key={i}>{pong}</span>;
            })}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}

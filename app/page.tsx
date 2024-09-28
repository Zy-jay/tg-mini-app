"use client";

import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { get } from "http";
import { useEffect, useState } from "react";
const client = axios.create({
  baseURL: "https://x-roach-dev.up.railway.app/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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

const Button = ({
  onClick,
  children,
}: {
  onClick: () => any | Promise<any>;
  children: any;
}) => {
  return (
    <button
      style={{
        padding: 10,
        border: "1px solid black",
        background: "green",
        borderRadius: 10,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [res, setRes] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [pinRes, setPinRes] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userRefs, setUserRefs] = useState<any[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [user, setUser] = useState<any>(null);
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
      client.defaults.headers[
        "Authorization"
      ] = `${authData.initDataUnsafe.hash}`;
      client
        .post("login", {
          authData,
        })
        .then((res) => {
          setRes(res.data);
          setUser(res.data);
          setDisplayValue(JSON.stringify(res.data, null, "\t"));
        })
        .catch((err) => {
          setError(err?.message || err);
          setDisplayValue(JSON.stringify(err, null, "\t"));
        });
    }
  }, [userData]);

  const pin = () => {
    client
      .get("pin")
      .then((res) => {
        console.log(res.data);
        setPinRes([...pinRes, res.data.message]);
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || err);
      });
  };
  const getTotalUsers = () => {
    client
      .get("getTotalPlayers")
      .then((res) => {
        console.log(res.data);
        setTotalUsers(res.data);
        setDisplayValue(JSON.stringify(res.data, null, "\t"));
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || err);
      });
  };
  const getUserRefs = () => {
    client
      .get("getRefferals?userId=" + user?.userId)
      .then((res) => {
        console.log(res.data);
        setUserRefs(res.data);
        setDisplayValue(JSON.stringify(res.data, null, "\t"));
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || err);
      });
  };
  const getUserBalance = () => {
    client
      .get("getTonWalletBalance?address=" + user?.wallet?.publicAddress)
      .then((res) => {
        console.log(res.data);
        setDisplayValue(
          `Wallet Address ${user?.wallet?.publicAddress} balance: ` +
            JSON.stringify(res.data, null, "\t") +
            " TON"
        );
      })
      .catch((err) => {
        console.log(err);
        setError(err?.message || err);
        setDisplayValue(JSON.stringify(err, null, "\t"));
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
            <br />
            <li>Login: {res ? "Ok." : "Err"}</li>
            {error && <li>Error: {JSON.stringify(error, null, "\n")}</li>}
          </ul>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              flexWrap: "wrap",
              maxWidth: "100%",
            }}
          >
            <Button onClick={pin}>Pin</Button>
            <Button onClick={getTotalUsers}>Total Users</Button>
            <Button onClick={getUserRefs}>Refs</Button>
            <Button onClick={getUserBalance}>Wallet Balance</Button>
          </div>

          {<div>{displayValue}</div>}
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

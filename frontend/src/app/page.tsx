'use client';

import type React from "react";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";


export default function Home({
  children,
  }: {
    children: React.ReactNode;
  }){
  
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      router.push("/dashboard");
    }
  },[router]);
  return (
    <>
      {token && (
        <></>
      )}
    </>
  );
}

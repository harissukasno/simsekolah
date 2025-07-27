'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {  

  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page when the user visits the home page
    router.push("/dashboard");
  }, []);  
  return (
    <div>

    </div>
  );
}

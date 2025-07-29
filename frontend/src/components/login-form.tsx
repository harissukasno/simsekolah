'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = event.currentTarget;
    const username = formData.username.value;
    const password_hash = formData.password.value;
    try {        
        const response = await fetch(`http://localhost:4000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password_hash }),
        });

        if (response.ok) {
            // PUT TOKEN IN LOCAL STORAGE
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);

            // Redirect to the profile page or wherever needed
            router.push('/dashboard');
            
        } else {
            setError('Invalid email or password');
            router.refresh();
        }        
        
    } catch (error) {
        
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="POST" onSubmit={handleFormSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                    autoFocus
                    id="username"
                    type="username"
                    placeholder="contoh1"
                    required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>                  
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Login
                </Button>                
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

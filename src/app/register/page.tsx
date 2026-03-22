'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

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
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { type User } from "@/lib/data"

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');


    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password || !phone) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Please fill in all fields.",
            });
            return;
        }

        const existingUsers: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
        if (existingUsers.some(u => u.email === email)) {
             toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "An account with this email already exists.",
            });
            return;
        }
        
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: `${firstName} ${lastName}`,
            email,
            phone,
            password,
            role: 'user',
        };

        existingUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(existingUsers));

        toast({
            title: "Account Created",
            description: "You have been successfully registered. Please log in.",
        });
        router.push('/login');
    };
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input 
                          id="first-name" 
                          placeholder="Rohan" 
                          required 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                      />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input 
                          id="last-name" 
                          placeholder="Sharma" 
                          required 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                      />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                      id="password" 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                Create an account
                </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

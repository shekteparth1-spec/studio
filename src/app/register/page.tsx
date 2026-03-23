'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

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
import { useAuth, useFirestore } from "@/firebase"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();
    const db = useFirestore();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();

        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password || !trimmedPhone) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Please fill in all fields correctly.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                email: trimmedEmail,
                phoneNumber: trimmedPhone, // Standardized field name
                registrationDate: new Date().toISOString(),
                role: 'Owner'
            });

            toast({
                title: "Account Created",
                description: "Welcome to Harvest Haven! You can now start listing properties.",
            });
            router.push('/dashboard');
        } catch (error: any) {
            let message = "An error occurred during registration.";
            if (error.code === 'auth/email-already-in-use') {
              message = "This email is already registered.";
            } else if (error.code === 'auth/weak-password') {
              message = "The password is too weak.";
            } else if (error.code === 'auth/invalid-email') {
              message = "The email address is invalid.";
            }

            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: message,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="mx-auto w-full max-w-md shadow-lg border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Create Account</CardTitle>
          <CardDescription>
            Join Harvest Haven to list your farmhouses or resorts.
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
                          disabled={isLoading}
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
                          disabled={isLoading}
                      />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number (For Bookings)</Label>
                  <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                  />
                  <p className="text-[10px] text-muted-foreground">Guests will use this to contact you.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold text-primary hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

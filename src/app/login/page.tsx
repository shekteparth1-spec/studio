'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"

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
import { useAuth } from "@/firebase"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Login Successful",
        description: "Welcome back to Harvest Haven!",
      })
      router.push('/dashboard')
    } catch (error: any) {
      console.error("Login error:", error)
      let errorMessage = "Invalid email or password."
      
      // auth/invalid-credential is the common error for both wrong pass and user not found in modern SDKs
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "No account found with these credentials. Please check your email/password or create a new account using the 'Sign up' link below."
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled."
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later."
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm shadow-lg border-none">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your owner dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    disabled={isLoading}
                  />
                   <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline font-semibold hover:text-primary transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type User } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setName(parsedUser.name || '');
      setPhone(parsedUser.phone || '');
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div className="flex items-center justify-center h-full">Loading profile...</div>;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update current session
    const updatedUser = { ...user, name, phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Update registered users list
    const registeredUsers: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], name, phone };
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    }

    window.dispatchEvent(new Event('storage'));

    toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
    });
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">My Profile</CardTitle>
        <CardDescription>View and manage your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1 pb-4 border-b">
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <Badge variant="outline" className="w-fit mt-2 capitalize">{user.role}</Badge>
        </div>
        
        <form className="space-y-4 max-w-lg" onSubmit={handleUpdate}>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email} readOnly className="bg-muted text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+91 9876543210"
                />
            </div>
             <Button type="submit" className="w-full sm:w-auto rounded-full px-8">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: any, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variant === 'outline' ? 'text-foreground' : 'bg-primary text-primary-foreground'} ${className}`}>
      {children}
    </div>
  )
}

'use client';

import React, { useState, useEffect } from 'react';
import { Pen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the user data in your backend.
    // For this demo, we'll just show a toast.
    toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
    });
  }
  
  const avatarSrc = avatarPreview || `https://i.pravatar.cc/150?u=${user.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Profile</CardTitle>
        <CardDescription>View and manage your profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
            >
              <Pen className="text-white h-6 w-6"/>
              <span className="sr-only">Change photo</span>
            </Label>
            <Input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange}/>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <form className="space-y-4 max-w-lg" onSubmit={handleUpdate}>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} readOnly />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue={user.phone || ''} />
            </div>
             <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}

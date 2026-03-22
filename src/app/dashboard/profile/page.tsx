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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Profile</CardTitle>
        <CardDescription>View and manage your profile details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
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

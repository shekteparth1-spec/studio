
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phoneNumber || '');
    }
  }, [profile]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        phoneNumber: phone,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">My Profile</CardTitle>
        <CardDescription>View and manage your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1 pb-4 border-b">
          <h2 className="text-3xl font-bold">{firstName} {lastName}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <Badge variant="outline" className="w-fit mt-2 capitalize">{profile?.role || 'User'}</Badge>
        </div>
        
        <form className="space-y-4 max-w-lg" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      disabled={isUpdating}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      disabled={isUpdating}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email || ''} readOnly className="bg-muted text-muted-foreground" />
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
                  disabled={isUpdating}
                />
            </div>
             <Button type="submit" className="w-full sm:w-auto rounded-full px-8" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Profile
             </Button>
        </form>
      </CardContent>
    </Card>
  );
}

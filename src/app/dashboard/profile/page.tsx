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
import { Loader2, Phone } from 'lucide-react';

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

    if (!phone || phone.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Phone Number Required",
        description: "Please enter your profile phone number so guests can contact you via WhatsApp or phone call.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        phoneNumber: phone.trim(),
      });

      toast({
        title: "Profile Updated",
        description: "Your information and profile phone number have been successfully updated.",
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
        <CardDescription>View and manage your account information and contact details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1 pb-4 border-b">
          <h2 className="text-3xl font-bold">{firstName} {lastName}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="capitalize">{profile?.role || 'User'}</Badge>
            {phone && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none">Contact Active</Badge>}
          </div>
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
                <Label htmlFor="phone">Profile Phone Number (For WhatsApp/Calls)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    className="pl-10"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91 9876543210"
                    disabled={isUpdating}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium text-primary">This number will be displayed on your listings for guests to contact you directly.</p>
            </div>
             <Button type="submit" className="w-full sm:w-auto rounded-full px-8 mt-4" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Profile
             </Button>
        </form>
      </CardContent>
    </Card>
  );
}

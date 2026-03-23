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
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Phone, CheckCircle2 } from 'lucide-react';

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
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    if (profile && !hasLoadedData) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phoneNumber || '');
      setHasLoadedData(true);
    }
  }, [profile, hasLoadedData]);

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

    const trimmedPhone = phone.trim();

    if (!trimmedPhone || trimmedPhone.length < 10) {
      toast({
        variant: "destructive",
        title: "Phone Number Required",
        description: "Please enter a valid phone number (at least 10 digits) so guests can contact you.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      
      await setDoc(docRef, {
        id: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: user.email,
        phoneNumber: trimmedPhone,
        registrationDate: profile?.registrationDate || new Date().toISOString(),
        role: profile?.role || 'Owner'
      }, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your contact information has been successfully saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "There was an error updating your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">My Profile</CardTitle>
        <CardDescription>View and manage your account information and contact details for property listings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1 pb-4 border-b">
          <h2 className="text-3xl font-bold">{firstName} {lastName}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="capitalize">{profile?.role || 'Owner'}</Badge>
            {phone ? (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Contact Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive border-none">Phone Required</Badge>
            )}
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
                      required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      disabled={isUpdating}
                      required
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email || ''} readOnly className="bg-muted text-muted-foreground cursor-not-allowed" />
                <p className="text-[10px] text-muted-foreground">Email is tied to your account and cannot be changed.</p>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="phone">Profile Phone Number (WhatsApp & Direct Call)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    className="pl-10"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g., 919876543210 (include country code)"
                    disabled={isUpdating}
                    required
                  />
                </div>
                <p className="text-[10px] text-primary font-medium">This number will be used for guests to contact you via WhatsApp and phone calls on all your listings.</p>
            </div>
             <Button type="submit" className="w-full sm:w-auto rounded-full px-8 mt-4" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Profile Details
             </Button>
        </form>
      </CardContent>
    </Card>
  );
}
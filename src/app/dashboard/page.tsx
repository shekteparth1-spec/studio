
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Edit, Eye, Trash, Loader2, Plus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc } from 'firebase/firestore';

export default function UserDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const propertiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'properties');
  }, [db, user]);

  const { data: userProperties, isLoading } = useCollection(propertiesQuery);

  const handleDelete = async (propertyId: string) => {
    if (!user || !db) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'properties', propertyId);
      await deleteDoc(docRef);

      toast({
        title: 'Property Deleted',
        description: 'The property has been removed from your listings.',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "Could not delete the property. Please try again.",
      });
    } finally {
      setPropertyToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold font-headline">Welcome back!</h2>
                <p className="text-muted-foreground">Manage your property listings and submissions.</p>
            </div>
            <Button asChild className="rounded-full">
                <Link href="/dashboard/submit-property">
                    <Plus className="mr-2 h-4 w-4" /> Add Listing
                </Link>
            </Button>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">My Properties</CardTitle>
            <CardDescription>
              A list of properties you have submitted for listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProperties && userProperties.length > 0 ? userProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title || property.name}</TableCell>
                    <TableCell>{property.city || property.location}</TableCell>
                    <TableCell>INR {property.pricePerNight}/night</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-property/${property.id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Property
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className='text-destructive'
                              onClick={() => setPropertyToDelete(property.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                          You haven't listed any properties yet.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              property and remove it from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => propertyToDelete && handleDelete(propertyToDelete)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

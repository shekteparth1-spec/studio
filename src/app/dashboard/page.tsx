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
import { properties as initialProperties, type Property, type User } from '@/lib/data';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useState, useEffect } from 'react';
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

export default function UserDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        setUser(currentUser);

        const storedPropertiesRaw = localStorage.getItem('properties');
        const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;

        const filteredProperties = allProperties.filter((p: Property) => p.ownerId === currentUser.id);
        setUserProperties(filteredProperties);
      }
    };
    
    loadData();
    
    window.addEventListener('storage', loadData);
    
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const handleDelete = (propertyId: string) => {
    const storedPropertiesRaw = localStorage.getItem('properties');
    const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
    const updatedProperties = allProperties.filter((p: Property) => p.id !== propertyId);
    
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    window.dispatchEvent(new Event('storage'));

    toast({
        title: 'Property Deleted',
        description: 'The property has been removed from your listings.',
    });
    setPropertyToDelete(null);
  };

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Properties</CardTitle>
            <CardDescription>
              A list of properties you have submitted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProperties.length > 0 ? userProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
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
                            <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}`)}>View Listing</DropdownMenuItem>
                            <DropdownMenuItem 
                              className='text-destructive'
                              onClick={() => setPropertyToDelete(property.id)}
                            >Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                          You haven't listed any properties yet.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {userProperties.length === 0 && (
            <div className="text-center p-8 border-dashed border-2 rounded-lg">
              <h3 className="font-headline text-lg">No properties found</h3>
              <p className="text-muted-foreground mt-1">Get started by listing your first property.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/submit-property">List a Property</Link>
              </Button>
            </div>
          )}
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

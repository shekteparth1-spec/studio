'use client';

import React, { useState, useEffect } from 'react';
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
import { properties as initialProperties, users as staticUsers, type Property } from '@/lib/data';
import { MoreHorizontal, Edit, Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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

export default function AdminPropertiesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = () => {
      const storedPropertiesRaw = localStorage.getItem('properties');
      setProperties(storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties);
    };

    loadProperties();
    window.addEventListener('storage', loadProperties);

    return () => {
      window.removeEventListener('storage', loadProperties);
    };
  }, []);

  const handleDelete = (propertyId: string) => {
    const storedPropertiesRaw = localStorage.getItem('properties');
    const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
    const updatedProperties = allProperties.filter((p: Property) => p.id !== propertyId);
    
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    
    setProperties(updatedProperties);
    window.dispatchEvent(new Event('storage'));
    
    toast({
        title: 'Stay Deleted',
        description: 'The stay has been successfully removed.',
    });
    setPropertyToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Stays</CardTitle>
          <CardDescription>
            Manage all stay listings on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => {
                const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
                const allUsers = [...staticUsers, ...registeredUsers];
                const owner = allUsers.find(u => u.id === property.ownerId);
                return(
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>
                    <span>{owner?.name}</span>
                  </TableCell>
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
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/edit-property/${property.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View Listing
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
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  stay from the platform.
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

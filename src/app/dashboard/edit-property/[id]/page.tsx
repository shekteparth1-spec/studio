'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2, Upload, X, ArrowLeft, AlertCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { getListingSuggestion } from '@/ai/flows/listingOptimizer';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const amenitiesList = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Pool' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'gym', label: 'Gym' },
  { id: 'spa', label: 'Spa' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'tv', label: 'TV' },
  { id: 'washer', label: 'Washer' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'garden', label: 'Garden' },
  { id: 'bbq', label: 'BBQ Grill' },
  { id: 'pets', label: 'Pet Friendly' },
  { id: 'workspace', label: 'Dedicated Workspace' },
];

const formSchema = z.object({
  name: z.string().min(5, 'Property name must be at least 5 characters.'),
  type: z.enum(['farmhouse', 'resort']),
  location: z.string().min(3, 'Location is required.'),
  contactNumber: z.string().min(10, 'Please enter a valid contact number.'),
  pricePerNight: z.coerce.number().min(10, 'Price must be at least 10 INR.'),
  bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
  squareFeet: z.coerce.number().min(100, 'Must be at least 100 sq ft.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  amenities: z.array(z.string()),
  photos: z.array(z.string()).max(8, 'Maximum 8 photos allowed.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userProfileRef);

  const propertyDocRef = useMemoFirebase(() => {
    if (!db || !user || !params.id) return null;
    return doc(db, 'users', user.uid, 'properties', params.id);
  }, [db, user, params.id]);

  const { data: property, isLoading } = useDoc(propertyDocRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'farmhouse',
      location: '',
      contactNumber: '',
      pricePerNight: 100,
      bedrooms: 1,
      squareFeet: 500,
      description: '',
      amenities: [],
      photos: [],
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        name: property.title || property.name || '',
        type: property.type as 'farmhouse' | 'resort' || 'farmhouse',
        location: property.location || '',
        contactNumber: property.ownerPhoneNumber || profile?.phoneNumber || '',
        pricePerNight: property.pricePerNight || 0,
        bedrooms: property.numberOfBedrooms || property.bedrooms || 1,
        squareFeet: property.squareFootage || property.squareFeet || 500,
        description: property.description || '',
        amenities: property.amenityIds || property.amenities || [],
        photos: property.photoUrls || property.imageUrls || [],
      });
      setImagePreviews(property.photoUrls || property.imageUrls || []);
    }
  }, [property, profile, form]);

  async function handleGenerateDescription() {
    setIsAiLoading(true);
    const details = form.getValues();
    try {
      const suggestion = await getListingSuggestion({
        name: details.name,
        location: details.location,
        squareFeet: details.squareFeet,
        amenities: details.amenities,
      });
      form.setValue('description', suggestion, { shouldValidate: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI suggestion.',
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotos = form.getValues('photos') || [];
    if (currentPhotos.length >= 8) {
      toast({ variant: "destructive", title: "Photo limit reached", description: "You can only upload up to 8 photos." });
      return;
    }

    const newFiles = Array.from(files).slice(0, 8 - currentPhotos.length);
    const filePromises = newFiles.map(file => {
      if (file.size > 3 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: `${file.name} is larger than 3MB.` });
        return null;
      }
      return new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(results => {
      const validResults = results.filter((r): r is string => r !== null);
      if (validResults.length === 0) return;
      const allPhotos = [...currentPhotos, ...validResults];
      form.setValue('photos', allPhotos, { shouldValidate: true });
      setImagePreviews(allPhotos);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedPhotos = (form.getValues('photos') || []).filter((_, index) => index !== indexToRemove);
    form.setValue('photos', updatedPhotos, { shouldValidate: true });
    setImagePreviews(updatedPhotos);
  };

  async function onFormSubmit(values: FormValues) {
    if (!property || !user || !db) return;

    const totalSize = values.photos.reduce((acc, p) => acc + p.length, 0);
    if (totalSize > 800000) {
      toast({
        variant: "destructive",
        title: "Photos too large",
        description: "Total size of all photos combined must be under 1MB. Use smaller images.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        id: property.id,
        ownerId: user.uid,
        ownerPhoneNumber: values.contactNumber,
        title: values.name,
        name: values.name,
        type: values.type,
        location: values.location,
        city: values.location.split(',')[0].trim() || 'Unknown',
        pricePerNight: values.pricePerNight,
        numberOfBedrooms: values.bedrooms,
        squareFootage: values.squareFeet,
        description: values.description,
        amenityIds: values.amenities,
        photoUrls: values.photos,
        listingStatus: 'Approved',
      };

      // Update in user collection
      const userDocRef = doc(db, 'users', user.uid, 'properties', property.id);
      await setDoc(userDocRef, updatedData, { merge: true });

      // Update in public collection
      const publicDocRef = doc(db, 'public_properties', property.id);
      await setDoc(publicDocRef, updatedData, { merge: true });

      toast({
        title: 'Property Updated',
        description: 'Your stay details and contact information have been successfully updated.',
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Update failed:", error);
      let errorMessage = 'There was an error updating your property.';
      if (error.message?.includes('longer than 1048487 bytes')) {
        errorMessage = 'Your listing is too large. Use fewer/smaller photos.';
      }
      toast({ variant: "destructive", title: 'Update Failed', description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Edit Property: {property?.title || property?.name}</CardTitle>
          <CardDescription>
            Update your property details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Cozy Farmstead" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="farmhouse">Farmhouse</SelectItem>
                          <SelectItem value="resort">Resort</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lonavala, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number (WhatsApp & Calls)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g., 919876543210" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>The number guests will use to reach you.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="pricePerNight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per night (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Description</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isAiLoading || isSubmitting}
                      >
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate with AI
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea placeholder="Describe your property..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base font-bold">Amenities</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {amenitiesList.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photos"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-bold">Photos (Max 8)</FormLabel>
                    <Alert variant="default" className="bg-muted/50 border-none mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold uppercase tracking-wider">Storage Limit</AlertTitle>
                      <AlertDescription className="text-xs">
                        Due to database limits, total size of all photos combined must be under **1MB**. Compressed images are recommended.
                      </AlertDescription>
                    </Alert>
                    <FormControl>
                      <div>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 hover:bg-muted/30 transition-colors">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80">
                                <span>Upload files</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} disabled={isSubmitting} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground/80">PNG, JPG up to 3MB each</p>
                          </div>
                        </div>
                        {imagePreviews.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {imagePreviews.map((src, index) => (
                              <div key={index} className="group relative aspect-video">
                                <Image src={src} alt={`Preview ${index + 1}`} fill className="rounded-md object-cover" />
                                <Button type="button" variant="destructive" size="icon" className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100" onClick={() => handleRemoveImage(index)}>
                                  <X className="h-4 w-4" /><span className="sr-only">Remove image</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full" disabled={isSubmitting || isAiLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Property
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

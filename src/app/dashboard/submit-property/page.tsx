'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
} from '@/components/ui/form';
import { getListingSuggestion } from '@/ai/flows/listingOptimizer';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const amenitiesList = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Pool' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'gym', label: 'Gym' },
  { id: 'spa', label: 'Spa' },
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
  pricePerNight: z.coerce.number().min(10, 'Price must be at least 10 INR.'),
  bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
  squareFeet: z.coerce.number().min(100, 'Must be at least 100 sq ft.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  amenities: z.array(z.string()),
  photos: z.array(z.string()).max(8, 'Maximum 8 photos allowed.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitPropertyPage() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'farmhouse',
      location: '',
      pricePerNight: 1000,
      bedrooms: 1,
      squareFeet: 500,
      description: '',
      amenities: ['wifi', 'kitchen'],
      photos: [],
    },
  });

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
      toast({
        variant: "destructive",
        title: "Photo limit reached",
        description: "You can only upload up to 8 photos.",
      });
      return;
    }

    const newFiles = Array.from(files).slice(0, 8 - currentPhotos.length);

    const filePromises = newFiles.map(file => {
      // 3MB individual file limit
      if (file.size > 3 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} is larger than 3MB.`,
        });
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
    if (!user || !db) {
      toast({
          variant: "destructive",
          title: 'Error',
          description: 'You must be logged in to submit a property.',
      });
      return;
    }

    // Calculate total size of photos array to prevent Firestore 1MB document limit error
    const totalSize = values.photos.reduce((acc, p) => acc + p.length, 0);
    // Firestore limit is 1MB. Base64 strings are larger. We aim for ~800KB total to be safe.
    if (totalSize > 800000) {
      toast({
        variant: "destructive",
        title: "Photos too large",
        description: "The combined size of your photos exceeds the database limit. Please use fewer photos or smaller images.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionDate = new Date().toISOString();
      const propertyData = {
        ownerId: user.uid,
        title: values.name,
        name: values.name,
        type: values.type,
        location: values.location,
        city: values.location.split(',')[0].trim() || 'Unknown',
        stateProvince: values.location.split(',')[1]?.trim() || '',
        zipPostalCode: '422001',
        country: 'India',
        pricePerNight: values.pricePerNight,
        numberOfBedrooms: values.bedrooms,
        squareFootage: values.squareFeet,
        description: values.description,
        amenityIds: values.amenities,
        photoUrls: values.photos,
        listingStatus: 'Approved',
        submissionDate: submissionDate,
        aiScore: 85,
        addressLine1: values.location,
        latitude: 19.9975,
        longitude: 73.7898,
        numberOfBathrooms: 1,
        maxGuests: 4,
        rating: 5.0,
      };

      const userPropertiesRef = collection(db, 'users', user.uid, 'properties');
      const docRef = await addDoc(userPropertiesRef, propertyData);

      await setDoc(doc(db, 'public_properties', docRef.id), {
        ...propertyData,
        id: docRef.id
      });

      toast({
        title: 'Property Submitted!',
        description: `Your property "${values.name}" is now live.`,
      });
      
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Submission failed:", error);
      let errorMessage = 'Could not submit your property.';
      if (error.message?.includes('longer than 1048487 bytes')) {
        errorMessage = 'Your listing is too large. Please use smaller photos (under 100KB each is best).';
      }
      toast({
          variant: "destructive",
          title: 'Submission Failed',
          description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Submit a Property</CardTitle>
        <CardDescription>
          Fill out the details below to list your property on Harvest Haven. 
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
                        <SelectTrigger className="rounded-md">
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
                      className="text-primary hover:text-primary/80"
                    >
                      {isAiLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your property in detail..."
                      className="min-h-[150px]"
                      {...field}
                    />
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
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
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
                  <FormLabel className="font-bold">Photos (Max 8, 3MB each)</FormLabel>
                  <Alert variant="default" className="bg-muted/50 border-none mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs font-bold uppercase tracking-wider">Storage Limit</AlertTitle>
                    <AlertDescription className="text-xs">
                      The total size of all photos combined must be under **1MB**. For best results, use compressed images (under 100KB each).
                    </AlertDescription>
                  </Alert>
                  <FormControl>
                    <div>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 hover:bg-muted/30 transition-colors">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                            >
                              <span>Upload files</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-muted-foreground/80">PNG, JPG up to 3MB</p>
                        </div>
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {imagePreviews.map((src, index) => (
                            <div key={index} className="group relative aspect-video">
                              <Image
                                src={src}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
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
              Submit Property
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

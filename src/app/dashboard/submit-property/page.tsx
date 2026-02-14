'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2, Upload, X } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { properties as initialProperties, type Property, type User } from '@/lib/data';

// Add this for Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const amenitiesList = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'pool', label: 'Pool' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'gym', label: 'Gym' },
  { id: 'spa', label: 'Spa' },
];

const formSchema = z.object({
  name: z.string().min(5, 'Property name must be at least 5 characters.'),
  type: z.enum(['farmhouse', 'resort']),
  location: z.string().min(3, 'Location is required.'),
  pricePerNight: z.coerce.number().min(10, 'Price must be at least 10 INR.'),
  bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
  squareFeet: z.coerce.number().min(100, 'Must be at least 100 sq ft.'),
  description: z.string().min(50, 'Description must be at least 50 characters.'),
  amenities: z.array(z.string()),
  photos: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

const YOUR_RAZORPAY_KEY_ID = 'SFdJ3T6vK0mthU'; // IMPORTANT: Replace with your Razorpay Test Key ID
const AMOUNT = 49; // One-time fee in INR

export default function SubmitPropertyPage() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // The dashboard layout handles redirection if the user is not logged in.
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'farmhouse',
      location: '',
      pricePerNight: 100,
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
    const newFiles = Array.from(files);

    const filePromises = newFiles.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newPhotoDataUrls => {
      const allPhotos = [...currentPhotos, ...newPhotoDataUrls];
      form.setValue('photos', allPhotos, { shouldValidate: true });
      setImagePreviews(allPhotos);
    }).catch(error => {
      console.error("Error reading files:", error);
      toast({
        variant: "destructive",
        title: "Error uploading images",
        description: "There was a problem processing your images.",
      });
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedPhotos = (form.getValues('photos') || []).filter((_, index) => index !== indexToRemove);
    form.setValue('photos', updatedPhotos, { shouldValidate: true });
    setImagePreviews(updatedPhotos);
  };


  async function handleFinalSubmit(values: FormValues, paymentId: string) {
    if (!user) {
      toast({
          variant: "destructive",
          title: 'Error',
          description: 'User data is missing. Please log in and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you would verify the payment on your backend.
      const newProperty: Property = {
        id: `prop-${Date.now()}`,
        name: values.name,
        type: values.type,
        location: values.location,
        pricePerNight: values.pricePerNight,
        bedrooms: values.bedrooms,
        squareFeet: values.squareFeet,
        rating: 0,
        description: values.description,
        amenities: values.amenities,
        imageUrls: values.photos,
        imageHints: [], // User-uploaded photos don't have hints
        ownerId: user.id,
        status: 'pending',
      };

      const storedPropertiesRaw = localStorage.getItem('properties');
      const currentProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
      currentProperties.unshift(newProperty);
      localStorage.setItem('properties', JSON.stringify(currentProperties));
      window.dispatchEvent(new Event('storage'));

      toast({
        title: 'Payment Successful!',
        description: `Your property has been submitted for review. Payment ID: ${paymentId}`,
      });
      
      router.push('/dashboard');

    } catch (error) {
      console.error("Submission failed:", error);
      toast({
          variant: "destructive",
          title: 'Submission Failed',
          description: 'There was an error submitting your property. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  function onFormSubmit(values: FormValues) {
    if (YOUR_RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_HERE' || YOUR_RAZORPAY_KEY_ID === '') {
      toast({
        variant: "destructive",
        title: 'Razorpay Key Not Configured',
        description: "Please provide a valid Razorpay key to enable payments.",
      });
      return;
    }
    
    if (!window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Razorpay Not Loaded",
        description: "Please check your internet connection or try refreshing the page.",
      });
      return;
    }

    const options = {
      key: YOUR_RAZORPAY_KEY_ID,
      amount: AMOUNT * 100, // Razorpay expects amount in the smallest currency unit (paise)
      currency: "INR",
      name: "Harvest Haven",
      description: "Property Listing Fee",
      image: "https://cdn.iconscout.com/icon/premium/png-256-thumb/leaf-7527637-6138942.png",
      handler: async (response: any) => {
        await handleFinalSubmit(values, response.razorpay_payment_id);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      notes: {
        property_name: values.name,
      },
      theme: {
        color: "#9A7B4F"
      }
    };
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any){
        toast({
            variant: "destructive",
            title: 'Payment Failed',
            description: response.error.description,
        });
        setIsSubmitting(false);
    });

    setIsSubmitting(true);
    rzp.open();
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Submit a Property</CardTitle>
        <CardDescription>
          Fill out the details below to list your property on Harvest Haven. A one-time fee of ₹{AMOUNT} is required.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {(YOUR_RAZORPAY_KEY_ID === 'rzp_test_YOUR_KEY_HERE' || YOUR_RAZORPAY_KEY_ID === '') && <Alert variant="destructive" className='mb-6'>
          <AlertTitle>Developer Note: Setup Required</AlertTitle>
          <AlertDescription>
            To enable payments, please provide a valid Razorpay Test Key ID in `src/app/dashboard/submit-property/page.tsx`.
          </AlertDescription>
        </Alert>}
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
                    <FormLabel className="text-base">Amenities</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            <FormLabel className="font-normal">
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
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                    <div>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
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
                          <p className="text-xs leading-5 text-muted-foreground/80">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                      {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {imagePreviews.map((src, index) => (
                            <div key={index} className="group relative aspect-square">
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

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || isAiLoading}>
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit & Pay with Razorpay
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

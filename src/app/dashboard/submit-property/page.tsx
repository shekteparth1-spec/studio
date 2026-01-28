'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2, Upload, X, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  photos: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const YOUR_GOOGLE_PAY_UPI_ID = 'parthshekte1-1@oksbi';
const YOUR_PAYEE_NAME = 'Parth Shekte';
const AMOUNT = 50;
const NOTE = 'Farmhouse Registration Fee';

export default function SubmitPropertyPage() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [submissionStep, setSubmissionStep] = useState<'form' | 'payment' | 'confirmation'>('form');
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [utr, setUtr] = useState('');

  const upiUrl = `upi://pay?pa=${YOUR_GOOGLE_PAY_UPI_ID}&pn=${encodeURIComponent(YOUR_PAYEE_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(NOTE)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;


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


  function onFormSubmit(values: FormValues) {
    setFormData(values);
    setSubmissionStep('payment');
  }

  async function handleFinalSubmit() {
    if (!utr || utr.trim().length < 12) {
        toast({
            variant: "destructive",
            title: 'Invalid UTR',
            description: 'Please enter a valid UPI Transaction ID (UTR).',
        });
        return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you would verify the UTR with your payment gateway.
      // Here we simulate a delay.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalData = {
          ...formData,
          paymentMode: "Google Pay UPI",
          paymentStatus: "submitted",
          transactionId: utr,
      };

      console.log("Listing property with payment confirmation:", finalData);
      // In a real application, you would save `finalData` to Firestore here.

      toast({
        title: 'Payment Confirmed!',
        description: 'Your property is now live on Harvest Haven!',
      });
      
      // Reset everything
      form.reset();
      setImagePreviews([]);
      setFormData(null);
      setUtr('');
      setSubmissionStep('form');

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

  if (submissionStep === 'payment') {
    return (
        <Card>
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <Button variant="ghost" size="icon" onClick={() => setSubmissionStep('form')}>
                        <ArrowLeft />
                    </Button>
                    <div>
                        <CardTitle className="font-headline">Complete Your Payment</CardTitle>
                        <CardDescription>Scan the QR code using any UPI app.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 text-center">
                 <Alert variant="destructive">
                  <AlertTitle>QR Code Not Working?</AlertTitle>
                  <AlertDescription>
                    If you see a &quot;payment account not registered&quot; error, it means the UPI ID in the code is incorrect. Please open `src/app/dashboard/submit-property/page.tsx`, find the `YOUR_GOOGLE_PAY_UPI_ID` variable, and replace the value with the correct UPI ID from your Google Pay app.
                  </AlertDescription>
                </Alert>
                <div className="p-4 bg-white rounded-lg border">
                    <Image src={qrCodeUrl} alt="UPI QR Code" width={250} height={250} />
                </div>
                <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>Or use the UPI ID:</p>
                    <p className='font-mono bg-muted px-3 py-1.5 rounded-md text-sm'>{YOUR_GOOGLE_PAY_UPI_ID}</p>
                </div>
                <div className="text-lg font-bold">Amount: ₹{AMOUNT}</div>
                <Alert variant="default" className="text-left">
                    <AlertTitle className="font-semibold">Important Information</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                            <li>Payment is non-refundable.</li>
                            <li>Your farmhouse will be listed only after successful payment and confirmation.</li>
                            <li>Please save the UPI Transaction ID (UTR) after payment.</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <Button size="lg" className="w-full" onClick={() => setSubmissionStep('confirmation')}>I Have Paid</Button>
            </CardFooter>
        </Card>
    );
  }

  if (submissionStep === 'confirmation') {
      return (
        <Card>
            <CardHeader>
                 <div className='flex items-center gap-4'>
                    <Button variant="ghost" size="icon" onClick={() => setSubmissionStep('payment')}>
                        <ArrowLeft />
                    </Button>
                    <div>
                        <CardTitle className="font-headline">Confirm Your Submission</CardTitle>
                        <CardDescription>Enter the transaction ID to finalize your listing.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="utr">UPI Transaction ID (UTR)</Label>
                    <Input 
                        id="utr" 
                        placeholder="Enter the 12-digit UTR"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                    />
                     <p className="text-xs text-muted-foreground">
                        You can find this in the transaction history of your UPI app.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full" onClick={handleFinalSubmit} disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm & List Property
                </Button>
            </CardFooter>
        </Card>
      )
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
              Proceed to Payment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

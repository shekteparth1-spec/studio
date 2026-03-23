'use client';

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import React from 'react';
import {
  Star,
  MapPin,
  BedDouble,
  Home,
  Wind,
  Wifi,
  ParkingCircle,
  Utensils,
  Sun,
  Sprout,
  Dumbbell,
  Waves,
  Map,
  Tv,
  WashingMachine,
  Sunset,
  TreePine,
  Flame,
  PawPrint,
  Laptop,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi size={20} />,
  pool: <Waves size={20} />,
  kitchen: <Utensils size={20} />,
  parking: <ParkingCircle size={20} />,
  fireplace: <Sun size={20} />,
  gym: <Dumbbell size={20} />,
  spa: <Sprout size={20} />,
  restaurant: <Utensils size={20} />,
  ac: <Wind size={20} />,
  tv: <Tv size={20} />,
  washer: <WashingMachine size={20} />,
  balcony: <Sunset size={20} />,
  garden: <TreePine size={20} />,
  bbq: <Flame size={20} />,
  pets: <PawPrint size={20} />,
  workspace: <Laptop size={20} />,
};

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();

  const propertyDocRef = useMemoFirebase(() => {
    if (!db || !params?.id) return null;
    return doc(db, 'public_properties', params.id);
  }, [db, params?.id]);

  const { data: property, isLoading } = useDoc(propertyDocRef);

  // If we're still waiting for params OR the database hook to start/finish
  const isFetching = isLoading || !params?.id;

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading stay details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Only call notFound() if we are definitely finished loading and have no data
  if (!property) {
    notFound();
  }

  const handleAction = (actionUrl: string) => {
    window.open(actionUrl, '_blank', 'noopener,noreferrer');
  };

  const photos = property.photoUrls || property.imageUrls || [];
  const title = property.title || property.name || 'Beautiful Stay';
  const type = property.type || 'farmhouse';
  const bedrooms = property.numberOfBedrooms || property.bedrooms || 0;
  const squareFeet = property.squareFootage || property.squareFeet || 0;
  const price = property.pricePerNight || 0;
  const location = property.city || property.location || 'Unknown Location';
  const description = property.description || 'No description provided.';
  const amenities = property.amenityIds || property.amenities || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-12 px-4">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-bold md:text-5xl">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              {property.rating && (
                <>
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-primary fill-primary" />
                    <span className="font-bold text-foreground">
                      {property.rating}
                    </span>
                    <span className="text-sm">(Verified Reviews)</span>
                  </div>
                  <span className="hidden sm:inline">·</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span className="font-medium">{location}, {property.stateProvince || property.country || 'India'}</span>
              </div>
            </div>
          </div>

          <div className="relative mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {photos.length > 0 ? (
                  photos.map((url: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-xl">
                        <Image
                          src={url}
                          alt={`${title} - image ${index + 1}`}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                   <CarouselItem>
                      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted/50 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted">
                        <Image
                          src={`https://picsum.photos/seed/${property.id}/1200/600`}
                          alt="Placeholder"
                          fill
                          className="object-cover opacity-40 grayscale"
                        />
                        <div className="relative z-10 text-center p-6 bg-background/80 backdrop-blur-sm rounded-lg">
                          <p className="font-medium">Experience the beauty of {title}</p>
                        </div>
                      </div>
                    </CarouselItem>
                )}
              </CarouselContent>
              {photos.length > 1 && (
                <>
                  <CarouselPrevious className="left-6 bg-white/80 hover:bg-white border-none shadow-md" />
                  <CarouselNext className="right-6 bg-white/80 hover:bg-white border-none shadow-md" />
                </>
              )}
            </Carousel>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-3xl font-semibold capitalize">
                    {type} Stay
                  </h2>
                  <Badge variant="secondary" className="px-4 py-1 text-sm capitalize bg-primary/10 text-primary border-none">
                    {type}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <BedDouble size={22} className="text-primary" />
                    <span className="font-medium text-foreground">{bedrooms} Bedrooms</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2.5">
                    <Home size={22} className="text-primary" />
                    <span className="font-medium text-foreground">{squareFeet} Sq Ft</span>
                  </div>
                  {property.maxGuests && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2.5 text-foreground">
                        <span className="font-medium">Up to {property.maxGuests} Guests</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">About this place</h3>
                <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-line">
                  {description}
                </p>
              </div>

              {amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-headline text-2xl font-semibold mb-6 text-primary">What this place offers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {amenities.map((amenity: string) => (
                        <div key={amenity} className="flex items-center gap-4 group">
                          <div className="text-primary bg-primary/5 p-3 rounded-xl transition-colors group-hover:bg-primary/10">
                            {amenityIcons[amenity] || <Star size={22} />}
                          </div>
                          <span className="capitalize font-medium text-foreground/80">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-2xl border-none overflow-hidden rounded-2xl">
                <div className="bg-primary p-4 text-center">
                   <p className="text-primary-foreground font-medium text-sm">Best Price Guaranteed</p>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-baseline gap-2 mb-8">
                    <p className="text-4xl font-bold text-primary">
                      INR {price.toLocaleString()}
                    </p>
                    <span className="text-muted-foreground font-medium">/night</span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button 
                      size="lg"
                      className="w-full rounded-full py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                      onClick={() => handleAction(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${location}`)}`)}
                    >
                      <Map className="mr-2 h-6 w-6" />
                      Get Directions
                    </Button>

                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full rounded-full py-7 text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-all"
                      onClick={() => toast({ title: "Booking Request", description: "Direct booking is coming soon. Please contact the owner for availability." })}
                    >
                      <MessageCircle className="mr-2 h-6 w-6" />
                      Inquire Availability
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground mt-4 italic">
                      No commitment required yet. Owners usually respond within 24 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
  Phone,
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
    if (!db || !params.id) return null;
    return doc(db, 'public_properties', params.id);
  }, [db, params.id]);

  const { data: property, isLoading } = useDoc(propertyDocRef);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  const handleAction = (actionUrl: string) => {
    window.open(actionUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-12">
          <div>
            <h1 className="font-headline text-4xl font-bold">{property.title || property.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              {property.rating && (
                <>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-primary" />
                    <span className="font-semibold text-foreground">
                      {property.rating}
                    </span>
                    <span>(reviews)</span>
                  </div>
                  <span className="hidden sm:inline">·</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{property.city}, {property.stateProvince || ''}, {property.country || 'India'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Carousel className="w-full">
              <CarouselContent>
                {property.photoUrls && property.photoUrls.length > 0 ? (
                  property.photoUrls.map((url: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                          src={url}
                          alt={`${property.title} - image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                   <CarouselItem>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        No photos available
                      </div>
                    </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-2xl font-semibold capitalize">
                  {property.type} Stay
                </h2>
                <Badge variant="secondary" className="capitalize">{property.type}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BedDouble size={20} />
                  <span>{property.numberOfBedrooms || property.bedrooms} bedrooms</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-2">
                  <Home size={20} />
                  <span>{property.squareFootage || property.squareFeet} sq ft</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-xl font-semibold">About this place</h3>
                <p className="mt-2 text-foreground/80 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.amenityIds && property.amenityIds.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-headline text-xl font-semibold">What this place offers</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {property.amenityIds.map((amenity: string) => (
                        <div key={amenity} className="flex items-center gap-3">
                          <div className="text-primary bg-primary/10 p-2 rounded-md">
                            {amenityIcons[amenity] || <Star size={20} />}
                          </div>
                          <span className="capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg border-none">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold text-primary">
                    INR {property.pricePerNight}
                    <span className="text-base font-normal text-muted-foreground">
                      /night
                    </span>
                  </p>
                  
                  <div className="mt-6 flex flex-col gap-4">
                    <Button 
                      size="lg"
                      className="rounded-full"
                      onClick={() => handleAction(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title} ${property.city}`)}`)}
                    >
                      <Map className="mr-2 h-5 w-5" />
                      Get Directions
                    </Button>

                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
                      onClick={() => toast({ title: "Booking Request", description: "This feature will be available after admin approval." })}
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Inquire Availability
                    </Button>
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

'use client'; // Make this a client component

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation'; // import useRouter
import React, { useState, useEffect } from 'react'; // import hooks
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
} from 'lucide-react';
import { properties as initialProperties, users, type Property } from '@/lib/data';
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
import { Skeleton } from '@/components/ui/skeleton';

const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi size={20} />,
  pool: <Waves size={20} />,
  kitchen: <Utensils size={20} />,
  parking: <ParkingCircle size={20} />,
  fireplace: <Sun size={20} />,
  gym: <Dumbbell size={20} />,
  spa: <Sprout size={20} />,
  restaurant: <Utensils size={20} />,
};

export default function PropertyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [property, setProperty] = useState<Property | null | undefined>(null);

  useEffect(() => {
    const loadProperty = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
      
      const storedPropertiesRaw = localStorage.getItem('properties');
      const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
      if (params.id) {
        const foundProperty = allProperties.find((p: Property) => p.id === params.id);
        setProperty(foundProperty);
      }
    };

    loadProperty();
    
    window.addEventListener('storage', loadProperty);
    
    return () => {
      window.removeEventListener('storage', loadProperty);
    };
  }, [params.id]);


  if (property === undefined) {
    notFound();
  }
  
  if (property === null) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto py-12">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="mt-2 h-6 w-1/2" />
            <Skeleton className="mt-6 aspect-video w-full rounded-lg" />
             <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-8 w-1/3" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-48 w-full sticky top-24" />
                </div>
             </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const owner = users.find((u) => u.id === property.ownerId);

  const handleBookingAction = (actionUrl: string, actionName: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: `You must be logged in to ${actionName}.`,
      });
      router.push('/login');
    } else {
      window.open(actionUrl, '_blank', 'noopener,noreferrer');
    }
  };


  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-12">
          {/* Header */}
          <div>
            <h1 className="font-headline text-4xl font-bold">{property.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              {property.rating > 0 && (
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
                <span>{property.location}</span>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="mt-6">
            <Carousel className="w-full">
              <CarouselContent>
                {property.imageUrls && property.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={url}
                        alt={`${property.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={property.imageHints?.[index] || 'property photo'}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16" />
              <CarouselNext className="mr-16" />
            </Carousel>
          </div>

          {/* Details & Booking */}
          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-2xl font-semibold">
                  {property.type === 'farmhouse' ? 'Farmhouse' : 'Resort'}{' '}
                  hosted by {owner?.name || 'Owner'}
                </h2>
                <Badge variant={property.type === 'farmhouse' ? 'secondary' : 'default'}>{property.type}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BedDouble size={20} />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-2">
                  {property.type === 'farmhouse' ? (
                    <Home size={20} />
                  ) : (
                    <Wind size={20} />
                  )}
                  <span>{property.squareFeet} sq ft</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-xl font-semibold">About this place</h3>
                <p className="mt-2 text-foreground/80">{property.description}</p>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-xl font-semibold">What this place offers</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      {amenityIcons[amenity] || <Star size={20} />}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold">
                    INR {property.pricePerNight}
                    <span className="text-base font-normal text-muted-foreground">
                      /night
                    </span>
                  </p>
                  <div className="mt-6 flex flex-col gap-4">
                    <Button 
                      size="lg"
                      onClick={() => handleBookingAction(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`, 'get directions')}
                    >
                      <Map className="mr-2 h-5 w-5" />
                      Get Directions
                    </Button>
                    {owner?.phone && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => handleBookingAction(`https://wa.me/${owner.phone}`, 'contact the owner')}
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Contact Owner
                      </Button>
                    )}
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

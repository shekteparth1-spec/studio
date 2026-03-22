'use client';

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { properties as initialProperties, users as staticUsers, type Property, type User } from '@/lib/data';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [property, setProperty] = useState<Property | null | undefined>(null);
  const [owner, setOwner] = useState<User | null>(null);

  useEffect(() => {
    const loadData = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
      
      const storedPropertiesRaw = localStorage.getItem('properties');
      const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
      
      if (params.id) {
        const foundProperty = allProperties.find((p: Property) => p.id === params.id);
        setProperty(foundProperty);

        if (foundProperty) {
          const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
          const allUsers = [...staticUsers, ...registeredUsers];
          const foundOwner = allUsers.find((u) => u.id === foundProperty.ownerId);
          setOwner(foundOwner || null);
        }
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
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
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
                  <Home size={20} />
                  <span>{property.squareFeet} sq ft</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-xl font-semibold">About this place</h3>
                <p className="mt-2 text-foreground/80 leading-relaxed">{property.description}</p>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-headline text-xl font-semibold">What this place offers</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="text-primary bg-primary/10 p-2 rounded-md">
                        {amenityIcons[amenity] || <Star size={20} />}
                      </div>
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                      onClick={() => handleBookingAction(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`, 'get directions')}
                    >
                      <Map className="mr-2 h-5 w-5" />
                      Get Directions
                    </Button>

                    {owner?.phone && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Contact Number</p>
                            <p className="text-sm font-bold">{owner.phone}</p>
                          </div>
                        </div>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="w-full rounded-full border-primary text-primary hover:bg-primary/10"
                          onClick={() => handleBookingAction(`https://wa.me/${owner.phone.replace(/\D/g, '')}`, 'contact the owner')}
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Chat on WhatsApp
                        </Button>
                      </div>
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

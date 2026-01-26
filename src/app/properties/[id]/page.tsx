import Image from 'next/image';
import { notFound } from 'next/navigation';
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
} from 'lucide-react';
import { properties } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

  const propertyImages = property.imageIds.map(
    (id) => PlaceHolderImages.find((img) => img.id === id)!
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-12">
          {/* Header */}
          <div>
            <h1 className="font-headline text-4xl font-bold">{property.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-primary" />
                <span className="font-semibold text-foreground">
                  {property.rating}
                </span>
                <span>(reviews)</span>
              </div>
              <span className="hidden sm:inline">·</span>
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
                {propertyImages.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
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
                  hosted by Owner
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

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold">
                    ${property.pricePerNight}
                    <span className="text-base font-normal text-muted-foreground">
                      /night
                    </span>
                  </p>
                  <div className="mt-4 grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkin" className="text-sm font-medium">Check-in</label>
                        <input type="date" id="checkin" className="mt-1 w-full rounded-md border p-2"/>
                      </div>
                      <div>
                        <label htmlFor="checkout" className="text-sm font-medium">Checkout</label>
                        <input type="date" id="checkout" className="mt-1 w-full rounded-md border p-2"/>
                      </div>
                    </div>
                     <div>
                        <label htmlFor="guests" className="text-sm font-medium">Guests</label>
                        <select id="guests" className="mt-1 w-full rounded-md border p-2">
                            <option>1 guest</option>
                            <option>2 guests</option>
                            <option>3 guests</option>
                            <option>4 guests</option>
                        </select>
                     </div>
                  </div>
                  <Button className="mt-6 w-full" size="lg">Reserve</Button>
                  <p className="mt-2 text-center text-sm text-muted-foreground">You won't be charged yet</p>
                
                  <Separator className="my-4"/>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>${property.pricePerNight} x 5 nights</span>
                        <span>${property.pricePerNight * 5}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>$75</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>$120</span>
                    </div>
                    <Separator className="my-2"/>
                     <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${property.pricePerNight * 5 + 75 + 120}</span>
                    </div>
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

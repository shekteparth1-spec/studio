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
                  <p className="mt-2 text-sm text-muted-foreground">
                    Contact the property owner to book your stay.
                  </p>
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

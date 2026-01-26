import Image from 'next/image';
import Link from 'next/link';
import {
  BedDouble,
  MapPin,
  Search,
  Star,
  Wind,
  Home as HomeIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { properties } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-barn');
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-5xl font-bold md:text-7xl">
              Harvest Haven
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Discover and book unique farmhouses and resorts for your next
              escape.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="#featured-properties">Explore Stays</Link>
            </Button>
          </div>
        </section>

        <section className="bg-background/80 py-8">
          <div className="container mx-auto -mt-20">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
                  <div className="space-y-2">
                    <label htmlFor="location" className="font-medium">
                      Location
                    </label>
                    <Input
                      id="location"
                      placeholder="e.g., Napa Valley"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="property-type" className="font-medium">
                      Property Type
                    </label>
                    <Select>
                      <SelectTrigger id="property-type" className="bg-background">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="guests" className="font-medium">
                      Guests
                    </label>
                     <Select>
                      <SelectTrigger id="guests" className="bg-background">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="h-10 w-full">
                    <Search className="mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="featured-properties" className="py-16">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center font-headline text-4xl font-bold">
              Featured Properties
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties
                .filter((p) => p.status === 'approved')
                .slice(0, 6)
                .map((property) => {
                  const image = PlaceHolderImages.find(
                    (img) => img.id === property.imageIds[0]
                  );
                  return (
                    <Card
                      key={property.id}
                      className="overflow-hidden transition-all hover:shadow-xl"
                    >
                      <CardHeader className="p-0">
                        <Link href={`/properties/${property.id}`}>
                          <div className="relative aspect-video w-full">
                            {image && (
                              <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                data-ai-hint={image.imageHint}
                              />
                            )}
                          </div>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-1 font-headline text-xl">
                              <Link href={`/properties/${property.id}`}>
                                {property.name}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <MapPin size={16} />
                              {property.location}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="whitespace-nowrap">
                            {property.type === 'farmhouse'
                              ? 'Farmhouse'
                              : 'Resort'}
                          </Badge>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <BedDouble size={16} />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2">
                           {property.type === 'farmhouse' ? <HomeIcon size={16} /> : <Wind size={16} />}
                            <span>{property.squareFeet} sq ft</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4 pt-0">
                        <p className="text-lg font-semibold">
                          ${property.pricePerNight}
                          <span className="text-sm font-normal text-muted-foreground">
                            /night
                          </span>
                        </p>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-primary" />
                          <span className="font-semibold">{property.rating}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                View All Properties
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

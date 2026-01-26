'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import {
  BedDouble,
  MapPin,
  Star,
  Wind,
  Home as HomeIcon,
  Crosshair,
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
import { properties as allProperties, type Property } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-barn');
  
  const approvedProperties = useMemo(() => allProperties.filter(p => p.status === 'approved'), []);

  const [properties, setProperties] = useState<Property[]>(approvedProperties);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('any');
  const [priceRange, setPriceRange] = useState([1000, 100000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [areaRange, setAreaRange] = useState([500, 5000]);
  const { toast } = useToast();

  const handleNearMe = () => {
    toast({
      title: 'Coming Soon!',
      description: 'The "Near Me" feature is under development.',
    });
  };

  useEffect(() => {
    let filtered = approvedProperties;

    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (propertyType !== 'any') {
      filtered = filtered.filter(p => p.type === propertyType);
    }
    
    filtered = filtered.filter(p => p.pricePerNight >= priceRange[0] && p.pricePerNight <= priceRange[1]);

    if (bedrooms !== 'any') {
      if (bedrooms === '5+') {
        filtered = filtered.filter(p => p.bedrooms >= 5);
      } else {
        filtered = filtered.filter(p => p.bedrooms === parseInt(bedrooms, 10));
      }
    }
    
    filtered = filtered.filter(p => p.squareFeet >= areaRange[0] && p.squareFeet <= areaRange[1]);

    setProperties(filtered);
  }, [location, propertyType, priceRange, bedrooms, areaRange, approvedProperties]);


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
              <Link href="#properties">Explore Stays</Link>
            </Button>
          </div>
        </section>

        <section id="filters" className="py-16 -mt-20">
          <div className="container mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Find Your Perfect Stay</CardTitle>
                <CardDescription>Use the filters below to narrow down your search.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="e.g., Napa Valley"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Button variant="outline" size="icon" onClick={handleNearMe} title="Near Me">
                        <Crosshair className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="property-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label>Price per night (INR)</Label>
                    <div className='text-sm text-muted-foreground flex justify-between'>
                      <span>INR {priceRange[0]}</span>
                      <span>INR {priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={1000}
                      max={100000}
                      step={500}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Area (sq ft)</Label>
                     <div className='text-sm text-muted-foreground flex justify-between'>
                      <span>{areaRange[0]} sq ft</span>
                      <span>{areaRange[1]} sq ft</span>
                    </div>
                    <Slider
                      value={areaRange}
                      onValueChange={setAreaRange}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="properties" className="py-16 pt-8">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center font-headline text-4xl font-bold">
              Available Properties
            </h2>
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => {
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
                            INR {property.pricePerNight}
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
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="font-headline text-2xl">No Properties Found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

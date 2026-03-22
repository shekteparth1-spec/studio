'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  MapPin,
  Star,
  Home as HomeIcon,
  Crosshair,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { properties as initialProperties, type Property } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [sourceProperties, setSourceProperties] = useState<Property[]>([]);
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
    const loadProperties = () => {
        const storedPropertiesRaw = localStorage.getItem('properties');
        const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
        // Only show approved properties for public view
        const approved = allProperties.filter((p: Property) => p.status === 'approved');
        setSourceProperties(approved);
    };
    
    loadProperties();
    window.addEventListener('storage', loadProperties);
    return () => window.removeEventListener('storage', loadProperties);
  }, []);

  useEffect(() => {
    let filtered = sourceProperties;

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
  }, [location, propertyType, priceRange, bedrooms, areaRange, sourceProperties]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-center font-headline text-4xl font-bold md:text-5xl">
              Find Your Perfect Stay
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              Explore our handpicked selection of unique farmhouses and luxury resorts across India.
            </p>
            
            <Card className="shadow-xl border-none max-w-5xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="location" className="text-primary font-semibold">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="e.g., Nashik"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="rounded-full px-4"
                      />
                      <Button variant="outline" size="icon" onClick={handleNearMe} title="Near Me" className="rounded-full shrink-0">
                        <Crosshair className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="property-type" className="text-primary font-semibold">Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="property-type" className="rounded-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="bedrooms" className="text-primary font-semibold">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger id="bedrooms" className="rounded-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Count</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4 Bedrooms</SelectItem>
                        <SelectItem value="5+">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-primary font-semibold">Price per night (INR)</Label>
                    <div className='text-xs text-muted-foreground flex justify-between font-medium'>
                      <span>INR {priceRange[0]}</span>
                      <span>INR {priceRange[1]}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={1000}
                      max={100000}
                      step={500}
                      className="py-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="properties" className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-headline text-2xl font-bold">
                {properties.length} {properties.length === 1 ? 'Stay' : 'Stays'} Found
              </h2>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => {
                  const imageUrl = property.imageUrls && property.imageUrls.length > 0
                    ? property.imageUrls[0]
                    : `https://picsum.photos/seed/${property.id}/600/400`;
                  const imageHint = property.imageHints && property.imageHints.length > 0
                    ? property.imageHints[0]
                    : 'property photo';
                    
                  return (
                    <Card
                      key={property.id}
                      className="overflow-hidden transition-all hover:shadow-2xl border-none shadow-md"
                    >
                      <CardHeader className="p-0">
                        <Link href={`/properties/${property.id}`}>
                          <div className="relative aspect-video w-full">
                              <Image
                                src={imageUrl}
                                alt={property.name}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-110"
                                data-ai-hint={imageHint}
                              />
                          </div>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-1 font-headline text-xl">
                              <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
                                {property.name}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-primary" />
                              {property.location}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                            {property.type === 'farmhouse'
                              ? 'Farmhouse'
                              : 'Resort'}
                          </Badge>
                        </div>

                        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-2">
                            <BedDouble size={16} className="text-primary" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2">
                           <HomeIcon size={16} className="text-primary" />
                            <span>{property.squareFeet} sq ft</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-5 pt-0">
                        <p className="text-xl font-bold text-primary">
                          INR {property.pricePerNight}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            /night
                          </span>
                        </p>
                        {property.rating > 0 && (
                          <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
                            <Star size={14} className="text-primary fill-primary" />
                            <span className="font-bold text-primary">{property.rating}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                    <h3 className="font-headline text-2xl font-bold">No stays match your filters</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters or searching for a different location.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setLocation('');
                        setPropertyType('any');
                        setPriceRange([1000, 100000]);
                        setBedrooms('any');
                        setAreaRange([500, 5000]);
                      }}
                      className="mt-4 text-primary"
                    >
                      Clear all filters
                    </Button>
                </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

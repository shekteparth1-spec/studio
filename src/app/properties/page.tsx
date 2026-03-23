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
  Loader2,
  Search,
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
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function PropertiesPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [propertyType, setPropertyType] = useState('any');
  const [priceRange, setPriceRange] = useState([1000, 100000]);
  const [bedrooms, setBedrooms] = useState('any');

  const publicPropertiesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'public_properties');
  }, [db]);

  const { data: properties, isLoading } = useCollection(publicPropertiesQuery);

  useEffect(() => {
    if (!properties) return;

    let filtered = [...properties];

    if (locationSearch) {
      const search = locationSearch.toLowerCase();
      filtered = filtered.filter(p => 
        (p.city || '').toLowerCase().includes(search) || 
        (p.location || '').toLowerCase().includes(search) ||
        (p.title || p.name || '').toLowerCase().includes(search)
      );
    }

    if (propertyType !== 'any') {
      filtered = filtered.filter(p => p.type === propertyType);
    }
    
    filtered = filtered.filter(p => (p.pricePerNight || 0) >= priceRange[0] && (p.pricePerNight || 0) <= priceRange[1]);

    if (bedrooms !== 'any') {
      const count = parseInt(bedrooms, 10);
      if (bedrooms === '5+') {
        filtered = filtered.filter(p => (p.numberOfBedrooms || p.bedrooms || 0) >= 5);
      } else {
        filtered = filtered.filter(p => (p.numberOfBedrooms || p.bedrooms || 0) === count);
      }
    }

    setFilteredProperties(filtered);
  }, [locationSearch, propertyType, priceRange, bedrooms, properties]);

  const handleNearMe = () => {
    toast({
      title: 'Location Service',
      description: 'The "Near Me" feature is under maintenance. Try searching by city name.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h1 className="mb-6 text-center font-headline text-4xl font-bold md:text-6xl text-primary">
              Find Your Perfect Stay
            </h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-lg">
              Handpicked farmhouses and luxury resorts for your next escape.
            </p>
            
            <Card className="shadow-2xl border-none max-w-5xl mx-auto overflow-hidden rounded-3xl">
              <CardContent className="p-8 md:p-10">
                <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="location" className="text-primary font-bold uppercase text-xs tracking-widest">Location</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="e.g., Nashik"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          className="rounded-full pl-10 h-12"
                        />
                      </div>
                      <Button variant="outline" size="icon" onClick={handleNearMe} title="Near Me" className="rounded-full h-12 w-12 shrink-0 border-2">
                        <Crosshair className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="property-type" className="text-primary font-bold uppercase text-xs tracking-widest">Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="property-type" className="rounded-full h-12 border-2">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">All Stays</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="bedrooms" className="text-primary font-bold uppercase text-xs tracking-widest">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger id="bedrooms" className="rounded-full h-12 border-2">
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
                  <div className="space-y-6">
                    <Label className="text-primary font-bold uppercase text-xs tracking-widest">Price Limit (INR)</Label>
                    <div className='text-xs text-muted-foreground flex justify-between font-bold'>
                      <span>{priceRange[0].toLocaleString()}</span>
                      <span>{priceRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={1000}
                      max={100000}
                      step={1000}
                      className="py-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="properties" className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-headline text-3xl font-bold border-l-4 border-primary pl-4">
                {isLoading ? 'Searching...' : `${filteredProperties.length} Matches Found`}
              </h2>
            </div>

            {isLoading ? (
               <div className="flex h-64 flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Fetching the best stays for you...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => {
                  const imageUrl = property.photoUrls && property.photoUrls.length > 0
                    ? property.photoUrls[0]
                    : (property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : `https://picsum.photos/seed/${property.id}/600/400`);
                  
                  const title = property.title || property.name || 'Beautiful Stay';
                  const city = property.city || property.location || 'Unknown';
                  const bedrooms = property.numberOfBedrooms || property.bedrooms || 0;
                  const sqft = property.squareFootage || property.squareFeet || 0;
                  const price = property.pricePerNight || 0;

                  return (
                    <Card
                      key={property.id}
                      className="overflow-hidden transition-all hover:shadow-2xl border-none shadow-lg group rounded-2xl"
                    >
                      <CardHeader className="p-0">
                        <Link href={`/properties/${property.id}`}>
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm border-none shadow-md capitalize font-bold px-3 py-1">
                                  {property.type}
                                </Badge>
                              </div>
                          </div>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <CardTitle className="mb-2 font-headline text-2xl truncate">
                            <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
                              {title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-muted-foreground font-medium">
                            <MapPin size={16} className="text-primary" />
                            {city}
                          </CardDescription>
                        </div>

                        <div className="flex items-center justify-between text-sm font-semibold text-foreground/70 bg-muted/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <BedDouble size={18} className="text-primary" />
                            <span>{bedrooms} Beds</span>
                          </div>
                          <Separator orientation="vertical" className="h-4 bg-muted-foreground/20" />
                          <div className="flex items-center gap-2">
                           <HomeIcon size={18} className="text-primary" />
                            <span>{sqft} Sq Ft</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-6 pt-0 border-t border-muted/50 mt-2 pt-4">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Per Night</span>
                           <p className="text-2xl font-bold text-primary">
                            INR {price.toLocaleString()}
                          </p>
                        </div>
                        {property.rating && (
                          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                            <Star size={16} className="text-primary fill-primary" />
                            <span className="font-bold text-primary">{property.rating}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
                <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted max-w-4xl mx-auto px-6">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                    <h3 className="font-headline text-3xl font-bold text-foreground">No stays match your criteria</h3>
                    <p className="text-muted-foreground mt-4 text-lg">Try widening your price range or searching for a different city.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setLocationSearch('');
                        setPropertyType('any');
                        setPriceRange([1000, 100000]);
                        setBedrooms('any');
                      }}
                      className="mt-8 rounded-full px-8 h-12 border-2 border-primary text-primary hover:bg-primary/5 font-bold"
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

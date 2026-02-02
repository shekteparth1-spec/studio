'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  MapPin,
  Star,
  Wind,
  Home as HomeIcon,
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
import { properties as initialProperties, type Property } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = () => {
        const storedPropertiesRaw = localStorage.getItem('properties');
        if (storedPropertiesRaw) {
            setProperties(JSON.parse(storedPropertiesRaw));
        } else {
            setProperties(initialProperties);
        }
    };
    
    loadProperties();

    window.addEventListener('storage', loadProperties);

    return () => {
      window.removeEventListener('storage', loadProperties);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16">
          <div className="container mx-auto">
            <h1 className="mb-8 text-center font-headline text-4xl font-bold">
              Explore Our Properties
            </h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {properties
                .map((property) => {
                  const imageUrl = property.imageUrls && property.imageUrls.length > 0
                    ? property.imageUrls[0]
                    : `https://picsum.photos/seed/${property.id}/600/400`;
                  const imageHint = property.imageHints && property.imageHints.length > 0
                    ? property.imageHints[0]
                    : 'property photo';
                    
                  return (
                    <Card
                      key={property.id}
                      className="overflow-hidden transition-all hover:shadow-xl"
                    >
                      <CardHeader className="p-0">
                        <Link href={`/properties/${property.id}`}>
                          <div className="relative aspect-video w-full">
                              <Image
                                src={imageUrl}
                                alt={property.name}
                                fill
                                className="object-cover transition-transform duration-300 hover:scale-105"
                                data-ai-hint={imageHint}
                              />
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
                        {property.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-primary" />
                            <span className="font-semibold">{property.rating}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

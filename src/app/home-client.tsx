'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  MapPin,
  Star,
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

export default function HomeClient() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = () => {
      const storedPropertiesRaw = localStorage.getItem('properties');
      const allProperties = storedPropertiesRaw ? JSON.parse(storedPropertiesRaw) : initialProperties;
      const approvedProperties = allProperties.filter((p: Property) => p.status === 'approved');
      setProperties(approvedProperties.slice(0, 6)); // Show only top 6 as featured
    };

    loadProperties();
    window.addEventListener('storage', loadProperties);
    return () => window.removeEventListener('storage', loadProperties);
  }, []);

  return (
    <section id="featured-properties" className="py-20 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-center font-headline text-4xl font-bold">
            Featured Stays
          </h2>
          <div className="h-1.5 w-24 bg-primary mt-4 rounded-full" />
          <p className="mt-6 text-muted-foreground text-center max-w-2xl">
            Escape the ordinary. Browse our handpicked selection of top-rated farmhouses and resorts.
          </p>
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
                  className="overflow-hidden transition-all hover:shadow-2xl border-none shadow-md group"
                >
                  <CardHeader className="p-0">
                    <Link href={`/properties/${property.id}`}>
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={property.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
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
                        <CardDescription className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin size={14} className="text-primary" />
                          {property.location}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {property.type === 'farmhouse' ? 'Farmhouse' : 'Resort'}
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
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
            <h3 className="font-headline text-2xl font-bold text-muted-foreground">No Stays Available</h3>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-flex h-11 items-center justify-center rounded-full border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            View All Stays
          </Link>
        </div>
      </div>
    </section>
  );
}

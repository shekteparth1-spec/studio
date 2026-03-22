import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import HomeClient from './home-client';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-barn');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[80vh] w-full">
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
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
            <h1 className="font-headline text-5xl font-bold md:text-7xl drop-shadow-lg">
              Harvest Haven
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-2xl font-medium drop-shadow-md">
              Discover and book unique farmhouses and resorts for your next escape into nature.
            </p>
            <div className="mt-10 flex gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/properties">Explore All Stays</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <HomeClient />

        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl font-bold mb-4">Are you a Property Owner?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
              List your farmhouse or resort on Harvest Haven and reach thousands of nature lovers looking for their next escape.
            </p>
            <Button asChild size="lg" variant="default" className="rounded-full px-10">
              <Link href="/dashboard/submit-property">Submit Your Property</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

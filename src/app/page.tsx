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
        
        <HomeClient />

      </main>
      <Footer />
    </div>
  );
}

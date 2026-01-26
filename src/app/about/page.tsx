import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find((img) => img.id === 'hero-barn');
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-16">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="font-headline text-5xl font-bold">
                About Harvest Haven
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Welcome to Harvest Haven, your premier destination for booking unique farmhouses and resorts. Our mission is to connect you with unforgettable countryside escapes where you can relax, recharge, and reconnect with nature.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Founded by a team of nature lovers and travel enthusiasts, Harvest Haven was born from a desire to make finding and booking rural retreats as easy as a city break. We handpick every property to ensure it meets our high standards of quality, comfort, and charm.
              </p>
            </div>
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                {aboutImage && (
                    <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={aboutImage.imageHint}
                    />
                )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

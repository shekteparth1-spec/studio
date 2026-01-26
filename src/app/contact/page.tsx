import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto py-16">
          <div className="text-center">
            <h1 className="font-headline text-5xl font-bold">Contact Us</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We'd love to hear from you. Reach out with any questions or feedback.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form and we'll get back to you shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-md bg-primary/10 p-3 text-primary">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold">Email</h3>
                        <p className="text-muted-foreground">General Inquiries</p>
                        <a href="mailto:info@harvesthaven.com" className="text-primary hover:underline">info@harvesthaven.com</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-md bg-primary/10 p-3 text-primary">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold">Phone</h3>
                        <p className="text-muted-foreground">Mon-Fri from 9am to 5pm</p>
                        <a href="tel:+911234567890" className="text-primary hover:underline">+91 123 456 7890</a>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 rounded-md bg-primary/10 p-3 text-primary">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold">Office</h3>
                        <p className="text-muted-foreground">123 Harvest Lane, Green Valley</p>
                        <p className="text-muted-foreground">India</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

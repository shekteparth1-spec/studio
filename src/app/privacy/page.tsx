import Header from '@/components/header';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="font-headline text-4xl font-bold md:text-5xl mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                Welcome to Harvest Haven. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at info@harvesthaven.com.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-foreground/80 leading-relaxed">
                We collect personal information that you voluntarily provide to us when registering on the platform, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/80">
                <li><strong>Account Information:</strong> Name, email address, password, and phone number.</li>
                <li><strong>Property Information:</strong> Address, descriptions, photos, and pricing provided by property owners.</li>
                <li><strong>Communications:</strong> Any correspondence you send to us directly or through the platform.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use the information we collect or receive:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-foreground/80">
                <li>To facilitate account creation and logon process.</li>
                <li>To enable property owners to list their properties and for guests to view them.</li>
                <li>To display owner contact information to authenticated guests for booking purposes.</li>
                <li>To improve our platform through AI-powered listing recommendations and analysis.</li>
                <li>To respond to user inquiries and offer support.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Property owner contact details are shared with registered users to facilitate bookings.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">5. Security of Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
              <p className="text-foreground/80 leading-relaxed">
                You may review, change, or terminate your account at any time by logging into your account settings. If you would like to request the deletion of your data, please contact our support team.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="font-headline text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have questions or comments about this policy, you may email us at info@harvesthaven.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

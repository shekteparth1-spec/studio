import Link from 'next/link';
import { Logo } from './logo';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 px-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your premium escape to the countryside. Experience nature with luxury.
            </p>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold">Explore</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/properties" className="text-sm text-muted-foreground hover:text-primary">
                  Explore All Stays
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard/submit-property" className="text-sm text-muted-foreground hover:text-primary">
                  List your Stay
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold">Account</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Harvest Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

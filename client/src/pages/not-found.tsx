import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm text-muted-foreground mb-4">404</p>
        <h1 className="text-5xl font-serif font-normal mb-4">Nothing here.</h1>
        <p className="text-muted-foreground mb-8">
          This page doesn't exist. Head back to the portfolio.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background h-11 px-6 text-sm font-medium">
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </div>
  );
}

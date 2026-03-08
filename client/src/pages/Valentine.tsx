import { Link } from "wouter";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Valentine() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-16">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
          <Heart className="text-red-400 w-8 h-8" fill="currentColor" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-8">Valentine</h1>
        <p className="text-xl text-muted-foreground mb-12 italic font-serif">A Personal Project</p>

        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed text-left max-w-lg mx-auto mb-16">
          <p className="text-lg">
            Not everything I build is for a course, a client, or a job application.
          </p>
          <p>
            This one was for my girlfriend. The technical skills are the same ones I use everywhere else in this portfolio — the difference is the reason. It's here because a portfolio that only contains serious work tells you less about a person than one that shows what they build when nobody's grading them.
          </p>
        </div>

        <a href="#" target="_blank" rel="noopener noreferrer">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 rounded-full text-lg shadow-lg shadow-primary/20">
            Open Project
          </Button>
        </a>
      </div>
    </div>
  );
}

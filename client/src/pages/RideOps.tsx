import { Link } from "wouter";
import { ArrowLeft, ExternalLink, PlaySquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RideOps() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      {/* Back Link */}
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      {/* Hero */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold tracking-wider rounded uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            Live Product
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif mb-4 text-white">RideOps</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">Campus Transportation Ops Platform</p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href="https://ride-ops.com" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-none w-full sm:w-auto text-base">
              Visit ride-ops.com <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="https://app.ride-ops.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-border hover:bg-white/5 h-12 px-6 rounded-none w-full sm:w-auto text-base">
              Open App Demo <PlaySquare className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Stats Strip */}
        <div className="bg-[#0A0F1C] border-y border-border py-4 font-mono text-xs md:text-sm text-primary overflow-hidden whitespace-nowrap relative">
          <div className="animate-[marquee_20s_linear_infinite] inline-block">
            29 analytics widgets <span className="opacity-30 mx-4">•</span> 
            21 notification types <span className="opacity-30 mx-4">•</span> 
            4 campuses <span className="opacity-30 mx-4">•</span> 
            650+ seeded rides <span className="opacity-30 mx-4">•</span> 
            6-state ride lifecycle
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-t-2 border-t-primary">
            <h3 className="text-xl font-serif mb-3">Admin</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full command center: ride board, analytics dashboard, scheduling, fleet management.
            </p>
          </div>
          <div className="glass-card p-6 border-t-2 border-t-secondary">
            <h3 className="text-xl font-serif mb-3">Driver</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mobile interface: clock in, pickup lifecycle, grace timer.
            </p>
          </div>
          <div className="glass-card p-6 border-t-2 border-t-white/20">
            <h3 className="text-xl font-serif mb-3">Rider</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Book in three taps.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-foreground mb-20">
        <p className="text-lg">
          USC's DART program — Disabled Access to Road Transportation — moves students with disabilities across campus by golf cart. When I joined as a student supervisor, the entire operation ran on Gmail and Google Calendar. Cancellations were deleted events. No-shows were strikethroughs nobody tracked. Drivers didn't know their schedules until the last minute. Managers couldn't answer basic questions without counting by hand.
        </p>
        <p className="text-xl font-medium text-white my-8 border-l-2 border-primary pl-6 py-2">
          The problem wasn't the people. It was the tools.
        </p>
        <p>
          I built RideOps to fix that. It's a white-labeled, multi-tenant SaaS platform purpose-built for university accessibility transportation programs. Three separate interfaces — dispatcher, driver, rider — share a single PostgreSQL backend and stay in sync in real time.
        </p>
        <p>
          The dispatcher gets a full command center: a real-time ride board, a 29-widget drag-and-drop analytics dashboard, shift scheduling, fleet management, and Excel report exports. The driver gets a focused mobile interface: clock in, see your rides, run the pickup lifecycle, and let the grace timer handle no-shows automatically. The rider books in three taps.
        </p>
        <p>
          Every university gets its own branded experience — colors, logos, program name — via tenant config, not forked codebases. USC DART, UCLA BruinAccess, Stanford ATS, and UCI AnteaterExpress each look native to their campus. The multi-tenant architecture means I add a new school by adding a config entry, not a new deployment.
        </p>
        <p>
          I showed a prototype to the USC Transportation General Manager in December 2025. He gave me a feature roadmap and told me schools at his conference network need this. UCLA, Stanford, and UCI have standing demo offers.
        </p>
      </section>

      {/* Technical & Attribution */}
      <section className="max-w-3xl mx-auto space-y-8 border-t border-border pt-12">
        <div>
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-mono">Technical Architecture</h3>
          <p className="text-sm text-foreground/80 leading-relaxed bg-white/5 p-4 rounded border border-white/10">
            Built for university IT: FERPA-compliant data handling, bcrypt session auth, RBAC, parameterized SQL, SECURITY.md for IT evaluators, and a full DPA framework.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-mono">Attribution</h3>
          <p className="text-sm text-foreground/80 flex items-center gap-2">
            Sole founder and developer — 100% of design, architecture, and code.
          </p>
        </div>
      </section>
    </div>
  );
}

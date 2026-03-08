import { Link } from "wouter";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlArd() {
  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <div className="mb-6">
            <p className="font-mono text-sm text-muted-foreground mb-2">MDES 401 — Media Studies, USC</p>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-6">Al-Ard — A Reading of Youssef Chahine's Film</h1>
            <div className="flex gap-2">
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 text-white/80 border border-white/10 rounded flex items-center w-fit">
                <FileText size={12} className="mr-1.5" /> Long-form Essay · 8 pages
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Cultural Criticism', 'Film Studies', 'Postcolonial Theory', 'MENA'].map(tag => (
              <span key={tag} className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg font-editorial max-w-none mb-12">
          <p>
            <span className="italic">Al-Ard</span> — The Earth — is a 1969 Egyptian film by Youssef Chahine. It's set against Nasser's agrarian reform policies and follows a village community fighting to hold on to its land. The film uses landscape as a political argument: soil, fields, and geography aren't backdrop — they're the subject.
          </p>
          <p>
            This essay is a close reading of the film. It moves between micro-textual analysis — specific scenes, framing choices, editing rhythm — and a broader argument about postcolonial cinema's relationship to place. The central claim is that Chahine uses landscape to figure collective dispossession: the land that is taken is not just agricultural, it is identity, inheritance, and sovereignty simultaneously.
          </p>
          <p>
            Writing this required a different kind of attention than econometrics or systems design. The evidence isn't data — it's a held shot, a cut, the weight of silence before a line of dialogue. Getting that kind of argument to hold together on the page is its own technical challenge.
          </p>
        </div>

        <div className="bg-secondary/5 border-l-2 border-secondary p-4 mb-12">
          <p className="text-sm text-secondary/80 font-serif italic">
            This piece shares a regional thread with MENA Rising (economic intelligence) and the ECON 305 slides (development policy) — the same region, engaged from a humanistic rather than quantitative angle.
          </p>
        </div>

        {/* PDF Viewer */}
        <iframe src="/pdfs/al-ard-review.pdf" className="w-full h-[80vh] rounded-lg border border-white/10 mb-8" title="Al-Ard Film Review PDF" />

        <div className="mb-8">
          <a href="/pdfs/al-ard-review.pdf" download>
            <Button variant="outline" className="border-border hover:bg-white/5">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </a>
        </div>

      </div>
    </div>
  );
}

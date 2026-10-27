import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Shot = { src: string; alt: string };

// Screenshots captured from the RideOps demo tenant before the hosted app was shut down.
const GROUPS: { title: string; phone?: boolean; shots: Shot[] }[] = [
  {
    title: "Dispatch",
    shots: [{ src: "usc-office-dispatch.png", alt: "Dispatch board with pending rides and the driver schedule" }],
  },
  {
    title: "Analytics",
    shots: [
      { src: "usc-office-analytics-dashboard.png", alt: "Analytics dashboard" },
      { src: "usc-office-analytics-hotspots.png", alt: "Pickup and drop-off hotspots" },
      { src: "usc-office-analytics-milestones.png", alt: "Ride milestones" },
      { src: "usc-office-analytics-attendance.png", alt: "Driver attendance" },
      { src: "usc-office-analytics-reports.png", alt: "Exportable reports" },
    ],
  },
  {
    title: "Admin",
    shots: [
      { src: "usc-office-staff-calendar.png", alt: "Staff and shift calendar" },
      { src: "usc-office-rides-filtered.png", alt: "Rides list filtered by status" },
      { src: "usc-office-ride-drawer.png", alt: "Ride detail drawer" },
      { src: "usc-office-ride-edit-modal.png", alt: "Ride edit modal" },
      { src: "usc-office-fleet-drawer.png", alt: "Fleet management drawer" },
    ],
  },
  {
    title: "Driver app",
    phone: true,
    shots: [
      { src: "usc-driver-home.png", alt: "Driver home with available rides" },
      { src: "usc-driver-grace-timer.png", alt: "No-show grace timer" },
      { src: "usc-driver-account-notifs.png", alt: "Driver notification settings" },
    ],
  },
  {
    title: "Rider app",
    phone: true,
    shots: [
      { src: "usc-rider-booking-where.png", alt: "Booking a ride: where" },
      { src: "usc-rider-booking-when.png", alt: "Booking a ride: when" },
      { src: "usc-rider-driver-otw.png", alt: "Driver on the way" },
      { src: "usc-rider-myrides.png", alt: "My rides" },
    ],
  },
];

export default function RideOpsArchive() {
  const [open, setOpen] = useState<Shot | null>(null);

  return (
    <div className="rounded-xl border border-dashed border-border p-6 md:p-10">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h4 className="text-2xl md:text-3xl font-serif font-normal">RideOps — Campus Transportation Ops Platform</h4>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
          Shelved
        </span>
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 mb-10">
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            A white-labeled, multi-tenant SaaS platform for university accessibility transportation. I built it from a
            problem I saw at my campus transportation job. It covered dispatch, staff shifts, fleet, analytics, and
            separate driver and rider apps, with branded tenants for 4 campuses.
          </p>
          <p className="font-mono text-xs text-secondary">
            29 analytics widgets · 21 notification types · 4 campus tenants · 6-state ride lifecycle
          </p>
        </div>
        <div className="border-l-2 border-primary/60 pl-5">
          <h5 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Why it ended</h5>
          <p className="text-foreground/85 leading-relaxed">
            RideOps was a passion project. Then I started a full-time job, had no bandwidth left for it, and it was
            barely making money, so I shelved it. The hosted app is shut down; these screenshots are what remains.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{group.title}</h5>
            <div
              className={
                group.phone
                  ? "flex gap-3 overflow-x-auto pb-2"
                  : group.shots.length === 1
                    ? "grid"
                    : "grid grid-cols-2 md:grid-cols-3 gap-3"
              }
            >
              {group.shots.map((shot) => (
                <button
                  key={shot.src}
                  onClick={() => setOpen(shot)}
                  className={`group text-left shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${group.phone ? "w-32 md:w-40" : ""}`}
                >
                  <img
                    src={`/images/rideops/${shot.src}`}
                    alt={shot.alt}
                    loading="lazy"
                    className={`w-full rounded-lg border border-border bg-card object-cover object-top transition-transform duration-300 group-hover:-translate-y-0.5 ${group.phone ? "aspect-[390/844]" : "aspect-video"}`}
                  />
                  <span className="block mt-1.5 text-[11px] text-muted-foreground leading-snug">{shot.alt}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null); }}>
        <DialogContent className="bg-card border-border max-w-[min(1200px,95vw)] p-3 sm:p-4">
          <DialogTitle className="sr-only">{open?.alt ?? "RideOps screenshot"}</DialogTitle>
          <DialogDescription className="sr-only">Full-size RideOps screenshot</DialogDescription>
          {open && (
            <img
              src={`/images/rideops/${open.src}`}
              alt={open.alt}
              className="w-full max-h-[85vh] object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

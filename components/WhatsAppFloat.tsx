import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/quote";

export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-plum text-cream shadow-[0_10px_30px_-10px_rgba(46,37,34,0.5)] ring-1 ring-cream/30 transition-colors duration-500 hover:bg-plum-deep md:end-8 md:bottom-8"
    >
      <WhatsAppIcon />
    </a>
  );
}

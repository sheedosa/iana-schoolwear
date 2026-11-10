import { useEffect, useState, type ReactNode } from "react";

/** Phone-width action bar. It slides up once the page's own button (`target`) has scrolled away upwards, and steps
    aside again when that button or the footer is on screen, so it never covers either. */
export function StickyBar({ target, label, children }: { target: HTMLElement | null; label: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!target) return;
    const footer = document.querySelector("footer");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const past = target.getBoundingClientRect().bottom < 0; // scrolled past, not merely still below the fold
      const footerOn = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
      setShow(past && !footerOn);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [target]);
  return (
    <div className="stickybar lg:hidden" data-show={show} role="region" aria-label={label}>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

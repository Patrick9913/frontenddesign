"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  recommendedIntent,
  SITE_SECTIONS,
  WHATSAPP_ACTIONS,
  type SiteSection,
} from "./whatsappContact";

const HINT_STORAGE_KEY = "portfolio-wsp-hint-seen";
const OPENED_STORAGE_KEY = "portfolio-wsp-opened";

function detectSection(): SiteSection {
  if (typeof window === "undefined") return "home";

  const probe = Math.min(140, window.innerHeight * 0.28);
  let current: SiteSection = "home";

  for (const id of SITE_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) {
      current = id;
    }
  }

  return current;
}

export const WhatsAppButton = () => {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [needsAttention, setNeedsAttention] = useState(true);
  const [section, setSection] = useState<SiteSection>("home");

  const dismissHint = useCallback(() => {
    setShowHint(false);
    sessionStorage.setItem(HINT_STORAGE_KEY, "1");
  }, []);

  const markOpened = useCallback(() => {
    setNeedsAttention(false);
    sessionStorage.setItem(OPENED_STORAGE_KEY, "1");
    dismissHint();
  }, [dismissHint]);

  useEffect(() => {
    if (sessionStorage.getItem(OPENED_STORAGE_KEY)) {
      setNeedsAttention(false);
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || sessionStorage.getItem(HINT_STORAGE_KEY)) return;

    const reveal = window.setTimeout(() => setShowHint(true), 4500);
    const hide = window.setTimeout(() => dismissHint(), 16000);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(hide);
    };
  }, [dismissHint]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setSection(detectSection());
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const highlight = recommendedIntent(section);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) markOpened();
      return next;
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 right-6 z-50 md:bottom-24 md:right-24"
    >
      <div
        className={`pointer-events-none absolute bottom-1/2 right-[calc(100%+0.75rem)] hidden max-w-[11rem] translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:block ${
          showHint && !open
            ? "translate-x-0 opacity-100"
            : "translate-x-2 opacity-0"
        }`}
        aria-hidden={!showHint || open}
      >
        <div className="relative border border-[#25D366]/30 bg-[#0a0a0a]/95 px-3 py-2.5 backdrop-blur-sm">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#25D366]">
            Disponible ahora
          </p>
          <p className="mt-1 text-[11px] font-light leading-snug text-white/75">
            Elegí cómo querés charlar en segundos.
          </p>
          <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-[#25D366]/30 bg-[#0a0a0a]/95" />
        </div>
      </div>

      <div
        id={panelId}
        role="region"
        aria-label="Opciones de contacto por WhatsApp"
        className={`absolute bottom-[calc(100%+0.75rem)] right-0 w-[min(100vw-3rem,17.5rem)] origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        <div className="overflow-hidden border border-white/10 bg-[#0a0a0a]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#25D366]">
              WhatsApp directo
            </p>
            <p className="mt-1 text-xs font-light text-white/70">
              {section === "works"
                ? "Viste proyectos — pedí demo o contame tu idea."
                : "Respuesta ágil. Elegí la opción que mejor te represente."}
            </p>
          </div>

          <ul className="flex flex-col p-2" role="list">
            {WHATSAPP_ACTIONS.map((action) => {
              const isRecommended = action.id === highlight;
              const href = buildWhatsAppUrl(
                buildWhatsAppMessage(section, action.id)
              );

              return (
                <li key={action.id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      markOpened();
                      setOpen(false);
                    }}
                    className={`group flex flex-col gap-0.5 rounded-sm border px-3 py-3 transition-colors duration-300 ${
                      isRecommended
                        ? "border-[#25D366]/35 bg-[#25D366]/[0.08] hover:bg-[#25D366]/[0.14]"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-light uppercase tracking-[0.14em] text-white/90">
                        {action.label}
                      </span>
                      {isRecommended ? (
                        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#25D366]">
                          Ideal
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[10px] font-light leading-snug text-white/45 transition-colors group-hover:text-white/60">
                      {action.description}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative flex h-14 justify-end">
        <span
          className={`whatsapp-pulse-ring pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-full ${
            open ? "opacity-0" : ""
          }`}
          aria-hidden
        />
        <span
          className={`whatsapp-pulse-ring whatsapp-pulse-ring--delay pointer-events-none absolute right-0 top-0 h-14 w-14 rounded-full ${
            open ? "opacity-0" : ""
          }`}
          aria-hidden
        />

        <button
          type="button"
          aria-label="Abrir opciones de WhatsApp"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggleOpen}
          className={`whatsapp-fab relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-[box-shadow,background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#2fe472] hover:shadow-[0_12px_44px_rgba(37,211,102,0.48)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] active:scale-[0.97] ${
            needsAttention && !open ? "whatsapp-fab--attention" : ""
          } ${open ? "rotate-[8deg] scale-105" : ""}`}
        >
          {needsAttention && !open ? (
            <span
              className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              aria-hidden
            />
          ) : null}

          {open ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppButton;

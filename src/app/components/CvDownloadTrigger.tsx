"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  getCvDownloadMeta,
  triggerCvDownload,
  type CvLanguage,
} from "./cvDownload";

type CvDownloadTriggerProps = {
  variant?: "button" | "link";
  className?: string;
  children?: ReactNode;
};

export function CvDownloadTrigger({
  variant = "button",
  className,
  children = "Descargar CV",
}: CvDownloadTriggerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handlePick = useCallback((lang: CvLanguage) => {
    triggerCvDownload(lang);
    setOpen(false);
  }, []);

  const triggerClassName =
    className ??
    (variant === "button"
      ? "w-fit border border-white/20 bg-transparent px-10 py-3 text-xs font-light uppercase tracking-[0.2em] text-white/80 transition-all duration-500 hover:border-white hover:bg-white hover:text-black"
      : "w-fit text-xs font-light tracking-widest text-white/60 transition-colors duration-300 hover:text-white");

  const modal =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 font-sans">
            <button
              type="button"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className="relative w-full max-w-md border border-white/10 bg-[#080808] p-8 shadow-[0_0_60px_-12px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <p
                id={titleId}
                className="text-[10px] font-light uppercase tracking-[0.35em] text-white/45"
              >
                Curriculum
              </p>
              <h2 className="mt-3 text-2xl font-extralight tracking-wide text-white md:text-3xl">
                Descargar CV
              </h2>
              <p
                id={descId}
                className="mt-4 text-sm font-light leading-relaxed text-white/60"
              >
                Elegí el idioma del archivo PDF.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {(["es", "en"] as const).map((lang) => {
                  const meta = getCvDownloadMeta(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handlePick(lang)}
                      className="group flex flex-1 flex-col items-start gap-1 border border-white/15 bg-white/[0.02] px-5 py-4 text-left transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-black/50">
                        {meta.shortLabel}
                      </span>
                      <span className="text-sm font-light uppercase tracking-[0.15em] text-white/90 transition-colors group-hover:text-black">
                        {meta.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-6 w-full border border-transparent py-2 text-[10px] font-light uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white/80"
              >
                Cancelar
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {children}
      </button>
      {modal}
    </>
  );
}

export default CvDownloadTrigger;

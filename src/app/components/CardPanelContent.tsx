"use client";

import type { CardItem } from "./cardStackData";

type CardPanelContentProps = {
  card: CardItem;
};

export function CardPanelContent({ card }: CardPanelContentProps) {
  const isHero = card.id === "hero";
  const Component = card.component;

  return (
    <>
      <header className="card-stack-header h-12 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#0a0a0a] select-none shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] font-light tracking-[0.2em] text-white/45">
            [ {card.index} ]
          </span>
          <span className="font-mono text-[10px] font-light tracking-[0.2em] uppercase text-white/75">
            {card.label}
          </span>
        </div>
        {!isHero && (
          <span className="card-stack-header-extra font-mono text-[9px] font-light tracking-[0.15em] text-white/30 uppercase">
            [ VER DETALLES ]
          </span>
        )}
      </header>

      {isHero ? (
        <div className="card-stack-body h-[calc(100%-3rem)] overflow-hidden bg-[#050505]">
          <Component />
        </div>
      ) : (
        <div className="card-stack-body h-[calc(100%-3rem)] flex flex-col justify-between p-8 md:p-12 text-left relative bg-gradient-to-b from-[#050505] to-[#000000]">
          <div
            className="absolute right-0 bottom-0 top-0 w-1/2 opacity-[0.03] pointer-events-none bg-cover bg-right bg-no-repeat"
            style={{ backgroundImage: `url('/wireone.png')` }}
            aria-hidden
          />
          <div className="max-w-xl relative z-10">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 block mb-6">
              Preview
            </span>
            <h2 className="text-4xl md:text-6xl font-light tracking-[-0.02em] text-[#F0F0F0] leading-[1.05] uppercase mb-4">
              {card.previewTitle}
              <br />
              <span className="font-medium text-white/40">{card.previewSubtitle}</span>
            </h2>
            <div className="w-8 h-px bg-white/[0.08] my-6" />
            <p className="text-sm md:text-base font-light text-white/50 leading-[1.75] tracking-wide">
              {card.previewDesc}
            </p>
          </div>
          <div className="flex justify-between items-end relative z-10">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/25">
              CLIC PARA AMPLIAR HOJA
            </span>
            <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5">
              <span className="text-white text-base">↗</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

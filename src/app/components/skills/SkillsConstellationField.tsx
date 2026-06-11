"use client";

import type { CSSProperties } from "react";
import { CONSTELLATION_NODES, RING_CLASS } from "./constellationData";
import { useConstellationProximity } from "./useConstellationProximity";

type SkillsConstellationFieldProps = {
  variant?: "preview" | "expanded";
  className?: string;
  interactive?: boolean;
};

export function SkillsConstellationField({
  variant = "preview",
  className = "",
  interactive = true,
}: SkillsConstellationFieldProps) {
  const rings: Array<1 | 2 | 3> = [1, 2, 3];
  const proximityRadius = variant === "expanded" ? 140 : 108;
  const { rootRef, registerLabel } = useConstellationProximity(proximityRadius);

  return (
    <div
      ref={interactive ? rootRef : undefined}
      className={`skills-constellation-field skills-constellation-field--${variant} ${className}`}
    >
      <div className="constellation-parallax-wrap absolute inset-0">
        <div className="constellation-field" aria-hidden />

        {rings.map((ring) => (
          <div key={ring} className={`constellation-ring ${RING_CLASS[ring]}`}>
            {CONSTELLATION_NODES.filter((node) => node.ring === ring).map((node) => (
              <span
                key={node.label}
                className="constellation-node"
                style={{ "--node-angle": `${node.angle}deg` } as CSSProperties}
              >
                <span
                  ref={interactive ? registerLabel(node.label) : undefined}
                  className="constellation-node-label"
                >
                  {node.label}
                </span>
              </span>
            ))}
          </div>
        ))}

        <div className="constellation-core" aria-hidden>
          <span className="constellation-core-ring" />
          <span className="constellation-core-dot" />
        </div>
      </div>
    </div>
  );
}

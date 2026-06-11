import type { CSSProperties } from "react";

const EXPERIENCE_MILESTONES = [
  { year: "2022", label: "UBA" },
  { year: "2023", label: "Web" },
  { year: "2024", label: "React" },
  { year: "2025", label: "Portfolio" },
] as const;

const PROJECT_WINDOWS = [
  { id: "a", title: "next-app", depth: "back", offset: "0" },
  { id: "b", title: "dashboard-ui", depth: "mid", offset: "1" },
  { id: "c", title: "design-sys", depth: "front", offset: "2" },
] as const;

const FOOTER_ORBIT = [
  { label: "GitHub", angle: 20 },
  { label: "LinkedIn", angle: 100 },
  { label: "Email", angle: 200 },
  { label: String(new Date().getFullYear()), angle: 290 },
] as const;

export function AboutSectionDecor() {
  return (
    <>
      <div className="about-panel-venn expanded-decor-about-venn">
        <div className="about-panel-orbit about-panel-orbit--code">
          <span className="about-panel-orbit-label">{"{ }"}</span>
          <span className="about-panel-orbit-label about-panel-orbit-label--alt">DATA</span>
        </div>
        <div className="about-panel-orbit about-panel-orbit--design">
          <span className="about-panel-orbit-label">◯</span>
          <span className="about-panel-orbit-label about-panel-orbit-label--alt">UX</span>
        </div>
        <div className="about-panel-intersect" />
      </div>
      <div className="about-panel-wire expanded-decor-about-wire" />
    </>
  );
}

export function ExperienceSectionDecor() {
  return (
    <div className="experience-panel-timeline expanded-decor-experience-timeline">
      <div className="experience-panel-timeline-axis" />
      {EXPERIENCE_MILESTONES.map((item, index) => (
        <div
          key={item.year}
          className="experience-panel-milestone"
          style={{ "--milestone-i": index } as CSSProperties}
        >
          <span className="experience-panel-milestone-dot" />
          <span className="experience-panel-milestone-year">{item.year}</span>
          <span className="experience-panel-milestone-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectsSectionDecor() {
  return (
    <div className="projects-panel-stack expanded-decor-projects-stack">
      {PROJECT_WINDOWS.map((win) => (
        <div
          key={win.id}
          className={`projects-panel-window projects-panel-window--${win.depth}`}
          style={{ "--win-i": win.offset } as CSSProperties}
        >
          <div className="projects-panel-window-bar">
            <span />
            <span />
            <span />
            <span className="projects-panel-window-title">{win.title}</span>
          </div>
          <div className="projects-panel-window-body">
            <div className="projects-panel-window-line" />
            <div className="projects-panel-window-line projects-panel-window-line--short" />
            <div className="projects-panel-window-block" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactSectionDecor() {
  return (
    <>
      <div className="contact-panel-radar expanded-decor-contact-radar">
        <div className="contact-panel-radar-ring contact-panel-radar-ring--1" />
        <div className="contact-panel-radar-ring contact-panel-radar-ring--2" />
        <div className="contact-panel-radar-ring contact-panel-radar-ring--3" />
        <div className="contact-panel-radar-sweep" />
        <div className="contact-panel-radar-core" />
      </div>
      <div className="contact-panel-terminal expanded-decor-contact-terminal">
        <span className="contact-panel-terminal-prompt">{">"}</span>
        <span className="contact-panel-terminal-text">open channel — contact.form</span>
        <span className="contact-panel-terminal-cursor" />
      </div>
    </>
  );
}

export function FooterSectionDecor() {
  return (
    <>
      <div className="footer-panel-watermark expanded-decor-footer-watermark">
        <span className="footer-panel-watermark-line">PATRICK</span>
        <span className="footer-panel-watermark-line footer-panel-watermark-line--accent">ORDOÑEZ</span>
      </div>
      <div className="footer-panel-orbit-wrap expanded-decor-footer-orbit">
        <div className="footer-panel-orbit">
          {FOOTER_ORBIT.map((link) => (
            <span
              key={link.label}
              className="footer-panel-orbit-node"
              style={{ "--orbit-angle": `${link.angle}deg` } as CSSProperties}
            >
              <span className="footer-panel-orbit-label">{link.label}</span>
            </span>
          ))}
          <span className="footer-panel-orbit-core" />
        </div>
      </div>
    </>
  );
}

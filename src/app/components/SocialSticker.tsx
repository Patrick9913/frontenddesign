import type { ComponentType, SVGProps } from "react";
import { Github } from "pixelarticons/react/Github";
import { GithubSolid } from "pixelarticons/react/GithubSolid";
import { Linkedin2 } from "pixelarticons/react/Linkedin2";
import { Linkedin2Solid } from "pixelarticons/react/Linkedin2Solid";
import { Mail } from "pixelarticons/react/Mail";
import { MailOpen } from "pixelarticons/react/MailOpen";

export type SocialName = "GitHub" | "LinkedIn" | "Email";

type PixelIcon = ComponentType<SVGProps<SVGSVGElement>>;

const FRAMES: Record<
  SocialName,
  { idle: PixelIcon; hover: PixelIcon; delay: string; brand: string }
> = {
  GitHub: {
    idle: Github,
    hover: GithubSolid,
    delay: "0ms",
    brand: "github",
  },
  LinkedIn: {
    idle: Linkedin2,
    hover: Linkedin2Solid,
    delay: "180ms",
    brand: "linkedin",
  },
  Email: {
    idle: Mail,
    hover: MailOpen,
    delay: "360ms",
    brand: "email",
  },
};

export const SOCIAL_BRAND_CLASS: Record<SocialName, string> = {
  GitHub: "social-link--github",
  LinkedIn: "social-link--linkedin",
  Email: "social-link--email",
};

type SocialStickerProps = {
  name: SocialName;
  size?: "sm" | "md";
};

export const SocialSticker = ({ name }: SocialStickerProps) => {
  const { idle: Idle, hover: Hover, delay, brand } = FRAMES[name];
  const px = 24;

  return (
    <span
      className={`social-pixel social-pixel--${brand}`}
      style={{ animationDelay: delay, width: px, height: px }}
      aria-hidden
    >
      <Idle
        width={px}
        height={px}
        className="social-pixel-frame social-pixel-frame--idle"
      />
      <Hover
        width={px}
        height={px}
        className="social-pixel-frame social-pixel-frame--hover"
      />
    </span>
  );
};

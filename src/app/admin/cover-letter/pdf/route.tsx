import { renderToBuffer } from "@react-pdf/renderer";
import { hasCoverLetterSession, COVER_LETTER_COOKIE } from "../../../cover-letter/access";
import { CoverLetterDocument } from "../../../cover-letter/CoverLetterDocument";
import { resolveHighlights } from "../../../cover-letter/highlights";
import type {
  CoverLetterFormState,
  CoverLetterPdfPayload,
} from "../../../cover-letter/types";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = CoverLetterFormState;

function sanitizePayload(body: RequestBody): CoverLetterPdfPayload {
  const language = body.language === "en" ? "en" : "es";
  const highlightIds = Array.isArray(body.highlightIds) ? body.highlightIds : [];

  return {
    language,
    company: String(body.company ?? "").slice(0, 200),
    role: String(body.role ?? "").slice(0, 200),
    recipientName: String(body.recipientName ?? "").slice(0, 120),
    opening: String(body.opening ?? "").slice(0, 4000),
    motivation: String(body.motivation ?? "").slice(0, 4000),
    highlights: resolveHighlights(language, highlightIds).slice(0, 8),
    closing: String(body.closing ?? "").slice(0, 2000),
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(COVER_LETTER_COOKIE)?.value;
  if (!(await hasCoverLetterSession(session))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = sanitizePayload(body);
  const buffer = await renderToBuffer(<CoverLetterDocument payload={payload} />);

  const slug = payload.company
    ? payload.company.replace(/[^\w\-]+/g, "-").replace(/^-|-$/g, "")
    : "cover-letter";
  const langSuffix = payload.language === "en" ? "-EN" : "";
  const filename = `Patrick-Ordonez-Cover-Letter${langSuffix}${slug ? `-${slug}` : ""}.pdf`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

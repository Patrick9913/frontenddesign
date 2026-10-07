import { renderToBuffer } from "@react-pdf/renderer";
import { hasCoverLetterSession, COVER_LETTER_COOKIE } from "../../../cover-letter/access";
import { CoverLetterDocument } from "../../../cover-letter/CoverLetterDocument";
import { resolvePdfParagraphs } from "../../../cover-letter/compose";
import type {
  CoverLetterFormState,
  CoverLetterPdfPayload,
} from "../../../cover-letter/types";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = CoverLetterFormState;

function sanitizeForm(body: RequestBody): CoverLetterFormState {
  const language = body.language === "en" ? "en" : "es";
  const modelId =
    body.modelId === "story" ||
    body.modelId === "ats" ||
    body.modelId === "consultative" ||
    body.modelId === "referral" ||
    body.modelId === "problem-solution"
      ? body.modelId
      : "problem-solution";

  return {
    language,
    modelId,
    company: String(body.company ?? "").slice(0, 200),
    role: String(body.role ?? "").slice(0, 200),
    recipientName: String(body.recipientName ?? "").slice(0, 120),
    hook: String(body.hook ?? "").slice(0, 800),
    context: String(body.context ?? "").slice(0, 800),
    referralName: String(body.referralName ?? "").slice(0, 120),
    opening: String(body.opening ?? "").slice(0, 4000),
    motivation: String(body.motivation ?? "").slice(0, 4000),
    highlightIds: Array.isArray(body.highlightIds)
      ? body.highlightIds.map(String).slice(0, 8)
      : [],
    closing: String(body.closing ?? "").slice(0, 2000),
  };
}

function sanitizePayload(body: RequestBody): CoverLetterPdfPayload {
  const form = sanitizeForm(body);
  const resolved = resolvePdfParagraphs(form);

  return {
    language: form.language,
    company: form.company,
    role: form.role,
    recipientName: form.recipientName,
    opening: resolved.opening,
    motivation: resolved.motivation,
    highlights: resolved.highlights,
    closing: resolved.closing,
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

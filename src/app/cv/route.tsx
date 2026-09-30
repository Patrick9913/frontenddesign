import { renderToBuffer } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";
import { cv, cvEn } from "./cvData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const english = new URL(request.url).searchParams.get("lang") === "en";
  const buffer = await renderToBuffer(
    <CVDocument data={english ? cvEn : cv} language={english ? "en" : "es"} />
  );
  const filename = english
    ? "Patrick-Ordonez-CV-EN.pdf"
    : "Patrick-Ordonez-CV.pdf";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

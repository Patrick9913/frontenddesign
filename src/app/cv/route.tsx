import { renderToBuffer } from "@react-pdf/renderer";
import { CVDocument } from "./CVDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const buffer = await renderToBuffer(<CVDocument />);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Patrick-Ordonez-CV.pdf"',
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

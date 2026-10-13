import DxfParser, { type IDxf } from "dxf-parser";

// Plain data only, so the result can cross a Web Worker boundary via postMessage
export type ParseDxfResult =
  | { ok: true; dxf: IDxf }
  | { ok: false; error: string };

export function parseDxf(text: string): ParseDxfResult {
  try {
    const dxf = new DxfParser().parseSync(text);
    if (!dxf) return { ok: false, error: "Not a DXF file" };
    return { ok: true, dxf };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

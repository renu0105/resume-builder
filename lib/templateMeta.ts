// Client-safe template metadata. Kept separate from generateResume.ts so client
// components (home gallery, builder form) can import it without pulling in pdf-lib.
// The `id`s here must stay in sync with the STYLES keys in lib/generateResume.ts.

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  accent: string; // hex, mirrors the PDF accent colour
  font: "sans" | "serif" | "mono";
  header: "left" | "center" | "band";
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif with bold blue accents.",
    accent: "#2563eb",
    font: "sans",
    header: "left",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Monospaced, code-inspired layout.",
    accent: "#16a34a",
    font: "mono",
    header: "left",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated serif with lots of whitespace.",
    accent: "#111827",
    font: "serif",
    header: "left",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered serif resume.",
    accent: "#1e3a8a",
    font: "serif",
    header: "center",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined burgundy serif, rule-free.",
    accent: "#881337",
    font: "serif",
    header: "center",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Bold teal banner header.",
    accent: "#0f766e",
    font: "sans",
    header: "band",
  },
];

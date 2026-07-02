import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type Color,
} from "pdf-lib";

// Resume data shape produced by the template builder form. Everything is
// optional so partially-filled forms still render.
export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[] | string;
  experience?: {
    company?: string;
    role?: string;
    start?: string;
    end?: string;
    bullets?: string[];
  }[];
  projects?: { name?: string; desc?: string; url?: string }[];
}

type TemplateId =
  | "modern"
  | "developer"
  | "minimal"
  | "classic"
  | "elegant"
  | "corporate";

interface Style {
  regular: StandardFonts;
  bold: StandardFonts;
  accent: [number, number, number]; // 0-255
  upperHeadings: boolean;
  headingPrefix: string;
  rule: boolean;
  centerHeader: boolean;
  headerBand: boolean; // filled accent banner with white name/contact
}

const STYLES: Record<TemplateId, Style> = {
  // Helvetica, blue, left-aligned header, ruled section headings.
  modern: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold,
    accent: [37, 99, 235],
    upperHeadings: true,
    headingPrefix: "",
    rule: true,
    centerHeader: false,
    headerBand: false,
  },
  // Monospace, green, code-style "// " heading prefix.
  developer: {
    regular: StandardFonts.Courier,
    bold: StandardFonts.CourierBold,
    accent: [22, 163, 74],
    upperHeadings: true,
    headingPrefix: "// ",
    rule: false,
    centerHeader: false,
    headerBand: false,
  },
  // Times, near-black, title-case headings, understated.
  minimal: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
    accent: [17, 24, 39],
    upperHeadings: false,
    headingPrefix: "",
    rule: true,
    centerHeader: false,
    headerBand: false,
  },
  // Times, navy, centered name — traditional/academic look.
  classic: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
    accent: [30, 58, 138],
    upperHeadings: true,
    headingPrefix: "",
    rule: true,
    centerHeader: true,
    headerBand: false,
  },
  // Times, burgundy, centered, rule-free — refined/elegant.
  elegant: {
    regular: StandardFonts.TimesRoman,
    bold: StandardFonts.TimesRomanBold,
    accent: [136, 19, 55],
    upperHeadings: false,
    headingPrefix: "",
    rule: false,
    centerHeader: true,
    headerBand: false,
  },
  // Helvetica, teal banner header — bold corporate look.
  corporate: {
    regular: StandardFonts.Helvetica,
    bold: StandardFonts.HelveticaBold,
    accent: [15, 118, 110],
    upperHeadings: true,
    headingPrefix: "",
    rule: true,
    centerHeader: false,
    headerBand: true,
  },
};

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 50;

// pdf-lib's standard fonts use WinAnsi encoding and THROW on characters they
// can't encode (emoji, CJK, etc.). Normalise common typographic chars and drop
// anything outside Latin-1 so user input can never crash the render.
function sanitize(value: unknown): string {
  return String(value ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/•/g, "-")
    .replace(/[^\x00-\xFF]/g, "");
}

export async function generateResume(
  templateName: string,
  data: ResumeData,
): Promise<Uint8Array> {
  const style = STYLES[templateName as TemplateId] ?? STYLES.modern;

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(style.regular);
  const bold = await pdf.embedFont(style.bold);

  const accent = rgb(
    style.accent[0] / 255,
    style.accent[1] / 255,
    style.accent[2] / 255,
  );
  const black = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.4, 0.4, 0.4);

  const left = MARGIN;
  const right = A4.w - MARGIN;
  const maxWidth = right - left;

  let page = pdf.addPage([A4.w, A4.h]);
  let y = A4.h - MARGIN;

  // Add a new page if `space` points won't fit before the bottom margin.
  function ensure(space: number) {
    if (y - space < MARGIN) {
      page = pdf.addPage([A4.w, A4.h]);
      y = A4.h - MARGIN;
    }
  }

  function wrap(text: string, font: PDFFont, size: number): string[] {
    const words = sanitize(text).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function paragraph(
    text: string,
    font: PDFFont,
    size: number,
    color: Color,
    gapAfter = 4,
    indent = 0,
  ) {
    for (const line of wrap(text, font, size)) {
      ensure(size + 3);
      page.drawText(line, { x: left + indent, y: y - size, size, font, color });
      y -= size + 3;
    }
    y -= gapAfter;
  }

  function heading(text: string) {
    ensure(26);
    const label = style.upperHeadings ? text.toUpperCase() : text;
    page.drawText(style.headingPrefix + label, {
      x: left,
      y: y - 11,
      size: 11,
      font: bold,
      color: accent,
    });
    y -= 16;
    if (style.rule) {
      page.drawLine({
        start: { x: left, y },
        end: { x: right, y },
        thickness: 1,
        color: accent,
      });
    }
    y -= 9;
  }

  // --- Header ---------------------------------------------------------------
  page.drawText(sanitize(data.name) || "Your Name", {
    x: left,
    y: y - 22,
    size: 24,
    font: bold,
    color: black,
  });
  y -= 30;

  const contact = [data.email, data.phone]
    .map((v) => sanitize(v).trim())
    .filter(Boolean)
    .join("   ·   "); // middot is Latin-1, survives sanitize
  if (contact) {
    page.drawText(contact, {
      x: left,
      y: y - 10,
      size: 9.5,
      font: regular,
      color: gray,
    });
    y -= 16;
  }
  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1.5,
    color: accent,
  });
  y -= 16;

  // --- Summary --------------------------------------------------------------
  if (sanitize(data.summary).trim()) {
    heading("Summary");
    paragraph(data.summary!, regular, 10, black, 10);
  }

  // --- Skills ---------------------------------------------------------------
  const skills = (
    Array.isArray(data.skills)
      ? data.skills
      : typeof data.skills === "string"
        ? data.skills.split(",")
        : []
  )
    .map((s) => sanitize(s).trim())
    .filter(Boolean);
  if (skills.length) {
    heading("Skills");
    paragraph(skills.join(", "), regular, 10, black, 10);
  }

  // --- Experience -----------------------------------------------------------
  if (data.experience?.length) {
    heading("Experience");
    for (const job of data.experience) {
      ensure(18);
      const title = [job.role, job.company]
        .map((v) => sanitize(v).trim())
        .filter(Boolean)
        .join(" - ");
      page.drawText(title, {
        x: left,
        y: y - 11,
        size: 10.5,
        font: bold,
        color: black,
      });

      const dates = [job.start, job.end]
        .map((v) => sanitize(v).trim())
        .filter(Boolean)
        .join(" - ");
      if (dates) {
        const w = regular.widthOfTextAtSize(dates, 9);
        page.drawText(dates, {
          x: right - w,
          y: y - 11,
          size: 9,
          font: regular,
          color: gray,
        });
      }
      y -= 16;

      for (const bullet of job.bullets ?? []) {
        paragraph(`·  ${sanitize(bullet)}`, regular, 9.5, black, 2, 8);
      }
      y -= 6;
    }
  }

  // --- Projects -------------------------------------------------------------
  if (data.projects?.length) {
    heading("Projects");
    for (const project of data.projects) {
      ensure(16);
      const name = sanitize(project.name).trim();
      if (name) {
        page.drawText(name, {
          x: left,
          y: y - 11,
          size: 10.5,
          font: bold,
          color: black,
        });
        y -= 15;
      }
      if (sanitize(project.desc).trim()) {
        paragraph(project.desc!, regular, 9.5, black, 2, 8);
      }
      if (sanitize(project.url).trim()) {
        paragraph(project.url!, regular, 9, accent, 4, 8);
      }
      y -= 4;
    }
  }

  return await pdf.save();
}

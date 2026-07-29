"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { TEMPLATES } from "@/lib/templateMeta";
import { generateResume } from "@/lib/generateResume";
import toast from "react-hot-toast";

interface ExperienceEntry {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string; // newline-separated in the form, split before sending
}

interface ProjectEntry {
  name: string;
  desc: string;
  url: string;
}

const emptyExperience: ExperienceEntry = {
  company: "",
  role: "",
  start: "",
  end: "",
  bullets: "",
};

const emptyProject: ProjectEntry = { name: "", desc: "", url: "" };

export default function ResumeBuilder() {
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] = useState(TEMPLATES[0]?.id ?? "modern");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
  });

  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { ...emptyExperience },
  ]);
  const [projects, setProjects] = useState<ProjectEntry[]>([
    { ...emptyProject },
  ]);

  // Revoke the previous blob URL whenever it changes or the component unmounts
  // so we don't leak object URLs.
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setField = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const updateExperience = (
    index: number,
    key: keyof ExperienceEntry,
    value: string,
  ) =>
    setExperience((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [key]: value } : e)),
    );

  const updateProject = (
    index: number,
    key: keyof ProjectEntry,
    value: string,
  ) =>
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );

  // Shape the form state into the ResumeData the API/generator expects.
  const buildResumeData = () => ({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    summary: formData.summary,
    skills: formData.skills,
    experience: experience
      .filter((e) => e.company || e.role || e.bullets)
      .map((e) => ({
        company: e.company,
        role: e.role,
        start: e.start,
        end: e.end,
        bullets: e.bullets
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean),
      })),
    projects: projects
      .filter((p) => p.name || p.desc || p.url)
      .map((p) => ({ name: p.name, desc: p.desc, url: p.url })),
  });

  const downloadResume = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const saveResume = async () => {
    const hasRequired = formData.name && formData.email && formData.phone;
    if (!hasRequired) {
      toast.error(
        "All fields are required. Please fill in the missing information.",
      );
      return;
    }

    try {
      // Persist the built resume. The structured form data is stored as JSON in
      // the resume's `content` column; the API scopes it to the signed-in user.
      await axios.post("/api/resume", {
        content: JSON.stringify({ template, data: buildResumeData() }),
      });

      // Log which template was used into the templates database.
      await axios.post("/api/templates", { name: template });

      toast.success("Resume saved successfully!");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error("Please sign in to save your resume.");
        return;
      }
      toast.error("Could not save your resume. Please try again.");
    }
  };
  // Live preview: regenerate the PDF automatically whenever the form changes.
  // Debounced so we don't hit the API on every keystroke, and the previous
  // request is cancelled/ignored if a newer one starts.
  useEffect(() => {
    const hasRequired = formData.name && formData.email && formData.phone;
    if (!hasRequired) {
      const timer = window.setTimeout(() => {
        setError(null);
        setPreviewUrl(null); // cleanup effect revokes the previous URL
      }, 0);
      return;
    }

    let ignore = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setPreviewing(true);
      setError(null);
      try {
        const res = await axios.post(
          "/api/resume/generate",
          { template, data: buildResumeData() },
          { responseType: "blob", signal: controller.signal },
        );
        if (ignore) return;
        const blob = new Blob([res.data], { type: "application/pdf" });
        setPreviewUrl(window.URL.createObjectURL(blob));
      } catch (err) {
        if (ignore || axios.isCancel(err)) return;
        console.error(err);
        setError("Could not generate the preview. Please try again.");
      } finally {
        if (!ignore) setPreviewing(false);
      }
    }, 600);

    return () => {
      ignore = true;
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, experience, projects, template]);

  return (
    <div className="grid max-w-7xl gap-8 mx-auto md:px-20 px-4 my-8 lg:grid-cols-2 ">
      {/* ---- Form ---- */}
      <div className="flex flex-col gap-4">
        <div className="flex md:flex-row flex-col justify-between items-center gap-2">
          <h1 className="md:text-3xl text-lg font-bold">Resume Builder</h1>

          <label className="flex flex-row gap-2 items-center text-md font-medium">
            Template :
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="rounded border p-2 font-normal w-44"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.description}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            placeholder="Name *"
            className="rounded border p-3"
            value={formData.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <input
            placeholder="Phone *"
            className="rounded border p-3"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>
        <input
          placeholder="Email *"
          className="rounded border p-3"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <textarea
          placeholder="Professional Summary"
          className="rounded border p-3"
          value={formData.summary}
          onChange={(e) => setField("summary", e.target.value)}
        />
        <textarea
          placeholder="Skills (comma separated)"
          className="rounded border p-3"
          value={formData.skills}
          onChange={(e) => setField("skills", e.target.value)}
        />

        {/* Experience */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Experience</h2>
            <button
              type="button"
              onClick={() =>
                setExperience((prev) => [...prev, { ...emptyExperience }])
              }
              className="self-start rounded border px-3 py-1 text-sm"
            >
              + Add experience
            </button>
          </div>
          {experience.map((exp, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Role"
                  className="rounded border p-2"
                  value={exp.role}
                  onChange={(e) => updateExperience(i, "role", e.target.value)}
                />
                <input
                  placeholder="Company"
                  className="rounded border p-2"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(i, "company", e.target.value)
                  }
                />
                <input
                  placeholder="Start (e.g. Jan 2022)"
                  className="rounded border p-2"
                  value={exp.start}
                  onChange={(e) => updateExperience(i, "start", e.target.value)}
                />
                <input
                  placeholder="End (e.g. Present)"
                  className="rounded border p-2"
                  value={exp.end}
                  onChange={(e) => updateExperience(i, "end", e.target.value)}
                />
              </div>
              <textarea
                placeholder="Bullet points (one per line)"
                className="rounded border p-2"
                value={exp.bullets}
                onChange={(e) => updateExperience(i, "bullets", e.target.value)}
              />
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setExperience((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="self-start text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projects</h2>
            <button
              type="button"
              onClick={() =>
                setProjects((prev) => [...prev, { ...emptyProject }])
              }
              className="self-start rounded border px-3 py-1 text-sm"
            >
              + Add project
            </button>
          </div>
          {projects.map((proj, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  placeholder="Project name"
                  className="rounded border p-2"
                  value={proj.name}
                  onChange={(e) => updateProject(i, "name", e.target.value)}
                />
                <input
                  placeholder="URL"
                  className="rounded border p-2"
                  value={proj.url}
                  onChange={(e) => updateProject(i, "url", e.target.value)}
                />
              </div>
              <textarea
                placeholder="Description"
                className="rounded border p-2"
                value={proj.desc}
                onChange={(e) => updateProject(i, "desc", e.target.value)}
              />
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setProjects((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="self-start text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={saveResume}
          className="rounded bg-blue-600 p-3 text-white"
        >
          Save
        </button>
        <button
          onClick={downloadResume}
          disabled={!previewUrl}
          className="rounded bg-green-600 p-3 text-white disabled:opacity-60"
        >
          Download PDF
        </button>
      </div>

      {/* ---- Preview ---- */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Preview</h2>
          {previewing && (
            <span className="text-sm text-gray-400">updating…</span>
          )}
        </div>
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Resume preview"
            className="h-[800px] w-full rounded border"
          />
        ) : (
          <div className="flex h-[800px] w-full items-center justify-center rounded border border-dashed text-gray-400">
            Fill in Name, Email and Phone to see a live preview.
          </div>
        )}
      </div>
    </div>
  );
}

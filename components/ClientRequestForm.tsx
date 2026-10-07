"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const rates = {
  HUMAN: 0.08,
  AI: 0.015,
  AI_HUMAN_REVIEW: 0.035,
};

export default function ClientRequestForm() {
  const router = useRouter();

  const [catalog, setCatalog] = useState<any>({
    languages: [],
    specializations: [],
  });

  const [form, setForm] = useState<any>({
    title: "",
    sourceLanguage: "ar",
    targetLanguage: "en",
    serviceType: "HUMAN",
    specialization: "General",
    wordCount: 1000,
    priority: "MEDIUM",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => {
        setCatalog({
          languages: [],
          specializations: [],
        });
      });
  }, []);

  const price = useMemo(() => {
    const serviceType = form.serviceType as keyof typeof rates;
    const rate = rates[serviceType] ?? 0;

    return Number(
      (Number(form.wordCount || 0) * rate).toFixed(2)
    );
  }, [form.wordCount, form.serviceType]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create request");
        setLoading(false);
        return;
      }

      router.push(`/client/projects/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold md:col-span-2">
          Project title
          <input
            required
            className="rounded-xl border p-3.5"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            placeholder="e.g. Website localization"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Source language
          <select
            className="rounded-xl border p-3.5"
            value={form.sourceLanguage}
            onChange={(e) =>
              setForm({
                ...form,
                sourceLanguage: e.target.value,
              })
            }
          >
            {catalog.languages.map((language: any) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Target language
          <select
            className="rounded-xl border p-3.5"
            value={form.targetLanguage}
            onChange={(e) =>
              setForm({
                ...form,
                targetLanguage: e.target.value,
              })
            }
          >
            {catalog.languages.map((language: any) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Service
          <select
            className="rounded-xl border p-3.5"
            value={form.serviceType}
            onChange={(e) =>
              setForm({
                ...form,
                serviceType: e.target.value,
              })
            }
          >
            <option value="HUMAN">
              Professional Human Translation — €0.08
            </option>
            <option value="AI_HUMAN_REVIEW">
              AI + Human Review — €0.035
            </option>
            <option value="AI">
              AI Translation — €0.015
            </option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Specialization
          <select
            className="rounded-xl border p-3.5"
            value={form.specialization}
            onChange={(e) =>
              setForm({
                ...form,
                specialization: e.target.value,
              })
            }
          >
            {catalog.specializations.map((specialization: any) => (
              <option
                key={specialization.name}
                value={specialization.name}
              >
                {specialization.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Word count
          <input
            type="number"
            min="1"
            className="rounded-xl border p-3.5"
            value={form.wordCount}
            onChange={(e) =>
              setForm({
                ...form,
                wordCount: Number(e.target.value),
              })
            }
          />
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Priority
          <select
            className="rounded-xl border p-3.5"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value,
              })
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold">
          Deadline
          <input
            type="datetime-local"
            className="rounded-xl border p-3.5"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,
                deadline: e.target.value,
              })
            }
          />
        </label>

        <label className="grid gap-2 text-sm font-bold md:col-span-2">
          Project details
          <textarea
            className="min-h-32 rounded-xl border p-3.5"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="Context, style guide, instructions, file notes..."
          />
        </label>
      </div>

      <div className="rounded-2xl bg-slate-950 p-6 text-white">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Estimated price
        </div>

        <div className="mt-2 text-4xl font-black">
          €{price.toFixed(2)}
        </div>

        <div className="mt-2 text-sm text-slate-300">
          Final quote can change for urgency, specialist work or
          additional files.
        </div>

        {form.serviceType === "AI" && (
          <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            AI translation is clearly labeled. Human review is not
            included in this plan.
          </div>
        )}

        {form.serviceType === "AI_HUMAN_REVIEW" && (
          <div className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            AI creates the first draft and a professional translator
            reviews the result.
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-950 px-6 py-4 font-bold text-white disabled:opacity-50"
      >
        {loading
          ? "Creating request..."
          : "Create translation request"}
      </button>
    </form>
  );
}
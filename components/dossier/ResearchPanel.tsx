"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { DossierStatus } from "@/lib/db/schema";
import type {
  PutDossierRequestBody,
  PutDossierItemInput,
  PutDossierQuestionInput,
} from "@/types/dossier";

export interface ResearchPanelProps {
  contractAddress: string;
  isAuthenticated?: boolean;
  initialThesis?: string | null;
  initialStatus?: DossierStatus | null;
  initialReason?: string | null;
  initialDecisionReason?: string | null;
  initialNotes?: string | null;
  initialItems?: PutDossierItemInput[];
  initialQuestions?: PutDossierQuestionInput[];
  onSave?: (body: PutDossierRequestBody) => Promise<boolean | void>;
}

export function ResearchPanel({
  contractAddress,
  isAuthenticated = false,
  initialThesis = "",
  initialStatus = "Watching",
  initialReason = "",
  initialDecisionReason = "",
  initialNotes = "",
  initialItems = [],
  initialQuestions = [],
  onSave,
}: ResearchPanelProps) {
  const [thesis, setThesis] = useState(initialThesis ?? "");
  const [status, setStatus] = useState<DossierStatus>(
    initialStatus ?? "Watching"
  );
  const [reason, setReason] = useState(initialReason ?? "");
  const [decisionReason, setDecisionReason] = useState(
    initialDecisionReason ?? ""
  );
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [items, setItems] = useState<PutDossierItemInput[]>(initialItems ?? []);
  const [questions, setQuestions] = useState<PutDossierQuestionInput[]>(
    initialQuestions ?? []
  );

  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newSource, setNewSource] = useState("");

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("saved");
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeSave = useCallback(
    async (payload: PutDossierRequestBody) => {
      setSaveStatus("saving");
      try {
        if (onSave) {
          await onSave(payload);
        } else if (typeof window !== "undefined") {
          const res = await fetch(`/api/dossier/${contractAddress}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Auto-save failed");
        }
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    },
    [contractAddress, onSave]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isAuthenticated) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const payload: PutDossierRequestBody = {
        thesis: thesis || null,
        status: status || null,
        reason: reason || null,
        decision_reason: decisionReason || null,
        notes: notes || null,
        items,
        questions,
      };
      executeSave(payload);
    }, 250);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    thesis,
    status,
    reason,
    decisionReason,
    notes,
    items,
    questions,
    isAuthenticated,
    executeSave,
  ]);

  if (!isAuthenticated) {
    return (
      <div className="border border-border bg-surface p-6 text-center shadow-sm">
        <div className="mx-auto max-w-md font-mono">
          <div className="text-sm font-bold text-ink">
            Dossier Research Workspace
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            Connect your wallet to record and auto-save case file research,
            thesis, notes, and checklist questions.
          </p>
          <div className="mt-4 inline-block border border-border bg-ink px-4 py-2 text-xs font-bold text-background">
            Connect Wallet
          </div>
        </div>
      </div>
    );
  }

  const handleAddItem = (kind: "pro" | "con" | "source", text: string) => {
    if (!text.trim()) return;
    setItems((prev) => [...prev, { kind, text: text.trim() }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = (text: string) => {
    if (!text.trim()) return;
    setQuestions((prev) => [...prev, { text: text.trim(), done: false }]);
  };

  const handleToggleQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, done: !q.done } : q))
    );
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const pros = items.filter((i) => i.kind === "pro");
  const cons = items.filter((i) => i.kind === "con");
  const sources = items.filter((i) => i.kind === "source");

  return (
    <div className="border border-border bg-surface p-5 shadow-sm font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-sm font-bold uppercase tracking-wider text-ink">
          Case File Research
        </span>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
              Error saving
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-ink-muted">
              Thesis (Investment Case)
            </label>
            <textarea
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              placeholder="State your primary thesis for this token..."
              maxLength={4000}
              rows={3}
              className="mt-1 w-full border border-border bg-background p-2 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-muted">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DossierStatus)}
                className="mt-1 w-full border border-border bg-background p-2 text-ink focus:border-ink focus:outline-none"
              >
                <option value="Watching">Watching</option>
                <option value="Researching">Researching</option>
                <option value="In position">In position</option>
                <option value="Passed">Passed</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-muted">
                Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Key catalyst or reason"
                maxLength={4000}
                className="mt-1 w-full border border-border bg-background p-2 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink-muted">
              Decision Reason
            </label>
            <textarea
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Why did you take this decision / pass / buy?"
              maxLength={4000}
              rows={2}
              className="mt-1 w-full border border-border bg-background p-2 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink-muted">
              Notes (Markdown Supported)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter markdown research notes, on-chain findings..."
              maxLength={20000}
              rows={6}
              className="mt-1 w-full border border-border bg-background p-2 font-mono text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
              For (Bull Case Points)
            </label>
            <div className="mt-1 space-y-1.5">
              {pros.map((p, idx) => (
                <div
                  key={`pro-${idx}`}
                  className="flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1"
                >
                  <span className="text-ink">{p.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(p))}
                    className="text-ink-muted hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Add positive factor..."
                  className="w-full border border-border bg-background p-1.5 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem("pro", newPro);
                      setNewPro("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("pro", newPro);
                    setNewPro("");
                  }}
                  className="border border-border bg-background px-3 font-bold text-ink hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
              Against (Bear Case / Risks)
            </label>
            <div className="mt-1 space-y-1.5">
              {cons.map((c, idx) => (
                <div
                  key={`con-${idx}`}
                  className="flex items-center justify-between border border-red-500/20 bg-red-500/5 px-2.5 py-1"
                >
                  <span className="text-ink">{c.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(c))}
                    className="text-ink-muted hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Add risk factor..."
                  className="w-full border border-border bg-background p-1.5 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem("con", newCon);
                      setNewCon("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("con", newCon);
                    setNewCon("");
                  }}
                  className="border border-border bg-background px-3 font-bold text-ink hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink-muted">
              Open Questions (Checklist)
            </label>
            <div className="mt-1 space-y-1.5">
              {questions.map((q, idx) => (
                <div
                  key={`q-${idx}`}
                  className="flex items-center justify-between border border-border bg-background px-2.5 py-1"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.done ?? false}
                      onChange={() => handleToggleQuestion(idx)}
                      className="accent-ink"
                    />
                    <span
                      className={
                        q.done ? "line-through text-ink-muted" : "text-ink"
                      }
                    >
                      {q.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-ink-muted hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add question to investigate..."
                  className="w-full border border-border bg-background p-1.5 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddQuestion(newQuestion);
                      setNewQuestion("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddQuestion(newQuestion);
                    setNewQuestion("");
                  }}
                  className="border border-border bg-background px-3 font-bold text-ink hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-cyan-600 dark:text-cyan-400">
              Sources & URLs
            </label>
            <div className="mt-1 space-y-1.5">
              {sources.map((s, idx) => (
                <div
                  key={`src-${idx}`}
                  className="flex items-center justify-between border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1"
                >
                  <a
                    href={s.text}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-cyan-600 underline hover:text-cyan-700 dark:text-cyan-400"
                  >
                    {s.text}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(s))}
                    className="text-ink-muted hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-border bg-background p-1.5 text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem("source", newSource);
                      setNewSource("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddItem("source", newSource);
                    setNewSource("");
                  }}
                  className="border border-border bg-background px-3 font-bold text-ink hover:bg-neutral-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

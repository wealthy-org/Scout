"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { DossierStatus } from "@/lib/db/schema";
import { IconClose } from "@/components/icons/Vectors";
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
      <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-6 sm:p-8 text-center shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-xl font-sans">
        <div className="mx-auto max-w-md">
          <div className="text-base font-bold text-[#FFFDF7]">
            Dossier Research Workspace
          </div>
          <p className="mt-2 text-xs text-[#A7F3D0] font-normal leading-relaxed">
            Connect your wallet to record and auto-save case file research,
            thesis, notes, and checklist questions.
          </p>
          <div className="mt-4 inline-block rounded-xl pop-btn-yellow px-5 py-2.5 text-xs font-bold uppercase tracking-wider">
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
    <div className="rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl font-sans text-xs">
      <div className="flex items-center justify-between border-b border-[rgba(153,246,228,0.2)] pb-4">
        <span className="text-sm font-extrabold uppercase tracking-wider text-[#FFFDF7]">
          Case File Research
        </span>
        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-xs text-[#FFD166] font-semibold">
              <span className="h-2 w-2 animate-ping rounded-full bg-[#FFD166]" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-[#99F6E4] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#99F6E4] shadow-[0_0_6px_rgba(153,246,228,0.6)]" />
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs font-bold text-[#FF6B6B]">
              Error saving
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
              Thesis (Investment Case)
            </label>
            <textarea
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              placeholder="State your primary thesis for this token..."
              maxLength={4000}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DossierStatus)}
                className="mt-1.5 w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2.5 text-[#FFFDF7] focus:border-[#99F6E4] focus:outline-hidden"
              >
                <option value="Watching">Watching</option>
                <option value="Researching">Researching</option>
                <option value="In position">In position</option>
                <option value="Passed">Passed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
                Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Key catalyst or reason"
                maxLength={4000}
                className="mt-1.5 w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2.5 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
              Decision Reason
            </label>
            <textarea
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Why did you take this decision / pass / buy?"
              maxLength={4000}
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
              Notes (Markdown Supported)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter markdown research notes, on-chain findings..."
              maxLength={20000}
              rows={6}
              className="mt-1.5 w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 font-mono text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#99F6E4]">
              For (Bull Case Points)
            </label>
            <div className="mt-1.5 space-y-1.5">
              {pros.map((p, idx) => (
                <div
                  key={`pro-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] px-3 py-1.5"
                >
                  <span className="text-[#FFFDF7] font-medium">{p.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(p))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors"
                    aria-label="Remove item"
                  >
                    <IconClose size={12} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Add positive factor..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#99F6E4] px-3.5 font-bold text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:brightness-110 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#FF6B6B]">
              Against (Bear Case / Risks)
            </label>
            <div className="mt-1.5 space-y-1.5">
              {cons.map((c, idx) => (
                <div
                  key={`con-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-[#FF6B6B]/30 bg-[#042F2E] px-3 py-1.5"
                >
                  <span className="text-[#FFFDF7] font-medium">{c.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(c))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors"
                    aria-label="Remove item"
                  >
                    <IconClose size={12} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Add risk factor..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#FF6B6B] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#FF6B6B] px-3.5 font-bold text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:bg-[#FA5252] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">
              Open Questions (Checklist)
            </label>
            <div className="mt-1.5 space-y-1.5">
              {questions.map((q, idx) => (
                <div
                  key={`q-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E] px-3 py-1.5"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.done ?? false}
                      onChange={() => handleToggleQuestion(idx)}
                      className="accent-[#FFD166]"
                    />
                    <span
                      className={
                        q.done ? "line-through text-[#A7F3D0]/50" : "text-[#FFFDF7]"
                      }
                    >
                      {q.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors"
                    aria-label="Remove question"
                  >
                    <IconClose size={12} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add question to investigate..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#FFD166] px-3.5 font-bold text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:brightness-110 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#99F6E4]">
              Sources &amp; URLs
            </label>
            <div className="mt-1.5 space-y-1.5">
              {sources.map((s, idx) => (
                <div
                  key={`src-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] px-3 py-1.5"
                >
                  <a
                    href={s.text}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[#99F6E4] underline hover:text-[#FFFDF7] font-mono text-xs"
                  >
                    {s.text}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(s))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors"
                    aria-label="Remove source"
                  >
                    <IconClose size={12} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-2 text-[#FFFDF7] placeholder:text-[#A7F3D0]/50 focus:border-[#99F6E4] focus:outline-hidden"
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
                  className="rounded-xl border border-[rgba(153,246,228,0.3)] bg-[#042F2E] px-3.5 font-bold text-[#99F6E4] hover:bg-[#14B8A6]/30 transition-colors"
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

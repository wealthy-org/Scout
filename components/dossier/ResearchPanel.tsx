"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { DossierStatus } from "@/lib/db/schema";
import { IconClose } from "@/components/icons/Vectors";
import { useWallet } from "@/components/wallet/WalletContext";
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
  const wallet = useWallet();
  const isAuthed = isAuthenticated || wallet.isAuthenticated;
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

    if (!isAuthed) return;

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
    isAuthed,
    executeSave,
  ]);

  if (!isAuthed) {
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
          <div className="mt-4">
            <button
              type="button"
              onClick={() => wallet.openModal()}
              className="inline-block rounded-xl pop-btn-yellow px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#042F2E] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              Connect Wallet
            </button>
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
    <div className="rounded-2xl sm:rounded-3xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-4 sm:p-6 lg:p-8 shadow-[0_10px_30px_-5px_rgba(4,47,46,0.5)] backdrop-blur-2xl font-sans text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(153,246,228,0.2)] pb-4 sm:pb-5">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#99F6E4] shadow-[0_0_8px_#99F6E4]" />
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#FFFDF7]">
              Case File Research Workspace
            </h2>
            <p className="text-[11px] text-[#A7F3D0] mt-0.5">
              Structured thesis, risk evaluation, and investment decision journal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD166]/20 border border-[#FFD166]/40 text-xs text-[#FFD166] font-semibold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#99F6E4]/20 border border-[#99F6E4]/40 text-xs text-[#99F6E4] font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#99F6E4] shadow-[0_0_6px_rgba(153,246,228,0.8)]" />
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="px-3 py-1 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 text-xs font-bold text-[#FF6B6B]">
              Error saving
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Thesis (Investment Case)
              </label>
              <span className="text-[10px] text-[#A7F3D0]/70 font-mono">
                {`${thesis.length} / 4000`}
              </span>
            </div>
            <textarea
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              placeholder="State your primary thesis, core catalyst, and conviction for this token..."
              maxLength={4000}
              rows={4}
              className="w-full rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3.5 sm:p-4 text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden transition-colors resize-y min-h-[110px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F3D0] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DossierStatus)}
                className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 text-sm text-[#FFFDF7] font-semibold focus:border-[#99F6E4] focus:outline-hidden transition-colors cursor-pointer"
              >
                <option value="Watching">Watching</option>
                <option value="Researching">Researching</option>
                <option value="In position">In position</option>
                <option value="Passed">Passed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F3D0] mb-1.5">
                Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Key catalyst or trigger"
                maxLength={4000}
                className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3 text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Decision Reason
              </label>
              <span className="text-[10px] text-[#A7F3D0]/70 font-mono">
                {`${decisionReason.length} / 4000`}
              </span>
            </div>
            <textarea
              value={decisionReason}
              onChange={(e) => setDecisionReason(e.target.value)}
              placeholder="Why did you enter this position, place on watch, or pass?"
              maxLength={4000}
              rows={3}
              className="w-full rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3.5 sm:p-4 text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden transition-colors resize-y min-h-[90px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
                Notes (Markdown Supported)
              </label>
              <span className="text-[10px] text-[#A7F3D0]/70 font-mono">
                {`${notes.length} / 20000`}
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter comprehensive markdown research notes, on-chain contract audits, dev background, and observations..."
              maxLength={20000}
              rows={8}
              className="w-full rounded-2xl border border-[rgba(153,246,228,0.25)] bg-[#042F2E] p-3.5 sm:p-4 font-mono text-xs sm:text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden transition-colors resize-y min-h-[160px]"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E]/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#99F6E4]">
                For (Bull Case Points)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#99F6E4]/20 text-[#99F6E4] font-bold">
                {pros.length}
              </span>
            </div>
            <div className="space-y-2">
              {pros.map((p, idx) => (
                <div
                  key={`pro-${idx}`}
                  className="flex items-start justify-between gap-2 rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 sm:p-3"
                >
                  <span className="text-[#FFFDF7] font-medium text-xs sm:text-sm leading-snug break-words flex-1">
                    {p.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(p))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Add positive bull case factor..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 text-xs sm:text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#99F6E4] px-4 font-black text-sm text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:brightness-110 active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(255,107,107,0.25)] bg-[#042F2E]/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FF6B6B]">
                Against (Bear Case / Risks)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] font-bold">
                {cons.length}
              </span>
            </div>
            <div className="space-y-2">
              {cons.map((c, idx) => (
                <div
                  key={`con-${idx}`}
                  className="flex items-start justify-between gap-2 rounded-xl border border-[#FF6B6B]/30 bg-[#064E4A] p-2.5 sm:p-3"
                >
                  <span className="text-[#FFFDF7] font-medium text-xs sm:text-sm leading-snug break-words flex-1">
                    {c.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(c))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newCon}
                  onChange={(e) => setNewCon(e.target.value)}
                  placeholder="Add risk or bear case factor..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 text-xs sm:text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#FF6B6B] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#FF6B6B] px-4 font-black text-sm text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:bg-[#FA5252] active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(255,209,102,0.25)] bg-[#042F2E]/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FFD166]">
                Open Questions (Checklist)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD166]/20 text-[#FFD166] font-bold">
                {`${questions.filter((q) => q.done).length} / ${questions.length} DONE`}
              </span>
            </div>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div
                  key={`q-${idx}`}
                  className="flex items-start justify-between gap-2.5 rounded-xl border border-[rgba(153,246,228,0.2)] bg-[#064E4A] p-2.5 sm:p-3"
                >
                  <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={q.done ?? false}
                      onChange={() => handleToggleQuestion(idx)}
                      className="mt-0.5 h-4 w-4 rounded-sm border-gray-300 accent-[#FFD166] cursor-pointer"
                    />
                    <span
                      className={`text-xs sm:text-sm leading-snug break-words ${
                        q.done ? "line-through text-[#A7F3D0]/50" : "text-[#FFFDF7] font-medium"
                      }`}
                    >
                      {q.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors shrink-0"
                    aria-label="Remove question"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add question to investigate..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 text-xs sm:text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#FFD166] focus:outline-hidden"
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
                  className="rounded-xl border-[1.5px] border-[#042F2E] bg-[#FFD166] px-4 font-black text-sm text-[#042F2E] shadow-[2px_2px_0px_#042F2E] hover:brightness-110 active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(153,246,228,0.2)] bg-[#042F2E]/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#99F6E4]">
                Sources &amp; URLs
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#99F6E4]/20 text-[#99F6E4] font-bold">
                {sources.length}
              </span>
            </div>
            <div className="space-y-2">
              {sources.map((s, idx) => (
                <div
                  key={`src-${idx}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 sm:p-3"
                >
                  <a
                    href={s.text}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[#99F6E4] underline hover:text-[#FFFDF7] font-mono text-xs sm:text-sm"
                  >
                    {s.text}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(items.indexOf(s))}
                    className="text-[#A7F3D0] hover:text-[#FF6B6B] p-1 rounded-md transition-colors shrink-0"
                    aria-label="Remove source"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[rgba(153,246,228,0.25)] bg-[#064E4A] p-2.5 text-xs sm:text-sm text-[#FFFDF7] placeholder:text-[#A7F3D0]/40 focus:border-[#99F6E4] focus:outline-hidden"
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
                  className="rounded-xl border border-[rgba(153,246,228,0.3)] bg-[#064E4A] px-4 font-bold text-xs sm:text-sm text-[#99F6E4] hover:bg-[#14B8A6]/30 active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

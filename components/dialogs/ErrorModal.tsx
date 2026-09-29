"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IconAlert, IconClose, IconClipboard, IconCheck } from "@/components/icons/Vectors";

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  code?: string;
  details?: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const emptySubscribe = () => () => {};

export function ErrorModal({
  isOpen,
  onClose,
  title = "System Error Encountered",
  message,
  code,
  details,
  onRetry,
  retryLabel = "Try Again",
  actionLabel,
  onAction,
}: ErrorModalProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isRetrying) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isRetrying, onClose]);

  if (!isOpen) return null;

  const handleCopyDetails = async () => {
    const fullText = `[Error] ${title}\nCode: ${code || "N/A"}\nMessage: ${message}\nDetails: ${details || "None"}\nTimestamp: ${new Date().toISOString()}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleRetryClick = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
      onClose();
    } catch {
      // keep modal open if retry fails
    } finally {
      setIsRetrying(false);
    }
  };

  const modalContent = (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042F2E]/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRetrying) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-3xl bg-[#064E4A] border-2 border-[#042F2E] p-6 sm:p-7 shadow-[6px_6px_0px_#042F2E] space-y-5 text-[#FFFDF7] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(153,246,228,0.2)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444] border-2 border-[#042F2E] shadow-[2px_2px_0px_#042F2E] flex items-center justify-center text-[#FFFDF7] shrink-0">
              <IconAlert size={20} />
            </div>
            <div>
              <h3
                id="error-modal-title"
                className="text-lg sm:text-xl font-black tracking-tight text-[#FFFDF7]"
              >
                {title}
              </h3>
              {code && (
                <div className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-[#042F2E] border border-[rgba(153,246,228,0.25)] font-mono text-[10px] font-bold text-[#FF6B6B] tracking-wider uppercase">
                  {code}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close error modal"
            disabled={isRetrying}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#042F2E] hover:bg-[#14B8A6]/20 border border-[rgba(153,246,228,0.2)] flex items-center justify-center text-[#A7F3D0] hover:text-[#FFFDF7] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
          >
            <IconClose size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            id="error-modal-desc"
            className="text-xs sm:text-sm text-[#FFFDF7] leading-relaxed bg-[#042F2E]/60 p-4 rounded-2xl border border-[rgba(153,246,228,0.2)] font-medium"
          >
            {message}
          </div>

          {details && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#A7F3D0]/80 px-1">
                <span className="font-semibold uppercase tracking-wider">Diagnostic Details</span>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#99F6E4] hover:text-[#FFD166] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <IconCheck size={12} className="text-[#99F6E4]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <IconClipboard size={12} />
                      <span>Copy Log</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-[#042F2E] border border-[rgba(153,246,228,0.15)] font-mono text-[11px] text-[#FFD166] max-h-36 overflow-y-auto whitespace-pre-wrap break-all leading-tight">
                {details}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[rgba(153,246,228,0.15)]">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onClose();
              }}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#A7F3D0] hover:text-[#FFFDF7] bg-[#042F2E] hover:bg-[#042F2E]/80 border border-[rgba(153,246,228,0.25)] transition-colors cursor-pointer"
            >
              {actionLabel}
            </button>
          )}

          <button
            type="button"
            id="error-modal-dismiss-btn"
            disabled={isRetrying}
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-[#FFFDF7] bg-[#042F2E] hover:bg-[#083835] border border-[rgba(153,246,228,0.3)] transition-colors cursor-pointer"
          >
            Dismiss
          </button>

          {onRetry && (
            <button
              type="button"
              id="error-modal-retry-btn"
              disabled={isRetrying}
              onClick={handleRetryClick}
              className="px-5 py-2.5 rounded-full text-xs font-black bg-[#FFD166] hover:bg-[#FACC15] text-[#042F2E] border-2 border-[#042F2E] shadow-[3px_3px_0px_#042F2E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isRetrying ? (
                <>
                  <span className="w-3 h-3 border-2 border-[#042F2E] border-t-transparent rounded-full animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <span>{retryLabel}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (mounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}

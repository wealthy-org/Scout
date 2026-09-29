"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ErrorModal, type ErrorModalProps } from "@/components/dialogs/ErrorModal";

export interface ErrorModalOptions {
  title?: string;
  message: string;
  code?: string;
  details?: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ErrorContextValue {
  showError: (options: ErrorModalOptions) => void;
  hideError: () => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorModalOptions | null>(null);

  const showError = useCallback((options: ErrorModalOptions) => {
    setErrorState(options);
  }, []);

  const hideError = useCallback(() => {
    setErrorState(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children}
      {errorState && (
        <ErrorModal
          isOpen={Boolean(errorState)}
          onClose={hideError}
          title={errorState.title}
          message={errorState.message}
          code={errorState.code}
          details={errorState.details}
          onRetry={errorState.onRetry}
          retryLabel={errorState.retryLabel}
          actionLabel={errorState.actionLabel}
          onAction={errorState.onAction}
        />
      )}
    </ErrorContext.Provider>
  );
}

export function useErrorModal(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (!context) {
    // Fallback safe dummy context if outside provider
    return {
      showError: (opts) => {
        if (typeof window !== "undefined") {
          console.error(`[ErrorModal] ${opts.title || "Error"}: ${opts.message}`, opts.details);
        }
      },
      hideError: () => {},
    };
  }
  return context;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[AppErrorBoundary] Uncaught exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D746E] text-[#FFFDF7] flex items-center justify-center p-4 sm:p-8">
          <ErrorModal
            isOpen={true}
            onClose={() => this.setState({ hasError: false, error: null })}
            title={this.props.fallbackTitle || "Application Runtime Error"}
            message={this.state.error?.message || "An unexpected rendering error occurred in this module."}
            code="ERR_REACT_BOUNDARY"
            details={this.state.error?.stack}
            retryLabel="Reload Application"
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { ErrorModal } from "@/components/dialogs/ErrorModal";
import { ErrorProvider, AppErrorBoundary } from "@/components/dialogs/ErrorContext";

describe("ErrorModal Component & Error Boundary", () => {
  it("should not render modal content when isOpen is false", () => {
    const html = renderToString(
      <ErrorModal
        isOpen={false}
        onClose={() => {}}
        message="Test error message"
      />
    );
    assert.strictEqual(html, "");
  });

  it("should render error dialog with alert role, title, code, message, and buttons when isOpen is true", () => {
    const html = renderToString(
      <ErrorModal
        isOpen={true}
        onClose={() => {}}
        title="Database Connection Failure"
        code="ERR_DB_TIMEOUT"
        message="Unable to establish connection to the primary database."
        details="Error: connect ETIMEDOUT at TCPConnectWrap.afterConnect"
        onRetry={() => {}}
        retryLabel="Reconnect"
      />
    );

    assert.ok(html.includes("role=\"alertdialog\""));
    assert.ok(html.includes("Database Connection Failure"));
    assert.ok(html.includes("ERR_DB_TIMEOUT"));
    assert.ok(html.includes("Unable to establish connection to the primary database."));
    assert.ok(html.includes("Error: connect ETIMEDOUT"));
    assert.ok(html.includes("Reconnect"));
    assert.ok(html.includes("Dismiss"));
  });

  it("should render action button when actionLabel and onAction are supplied", () => {
    const html = renderToString(
      <ErrorModal
        isOpen={true}
        onClose={() => {}}
        message="Session expired"
        actionLabel="Go to Login"
        onAction={() => {}}
      />
    );

    assert.ok(html.includes("Go to Login"));
  });

  it("should render ErrorProvider without crashing", () => {
    const html = renderToString(
      <ErrorProvider>
        <div id="test-child">Application Content</div>
      </ErrorProvider>
    );

    assert.ok(html.includes("Application Content"));
  });

  it("should render AppErrorBoundary children normally when no error is thrown", () => {
    const html = renderToString(
      <AppErrorBoundary>
        <div id="child-content">Safe Content</div>
      </AppErrorBoundary>
    );

    assert.ok(html.includes("Safe Content"));
  });
});

import * as React from "react";
import { renderErrorPage } from "@/lib/error-page";

interface State { hasError: boolean; error?: unknown }

/**
 * Global React error boundary. Catches render-time errors that escape
 * TanStack Router's per-route errorComponent (rare, but possible during
 * provider/store init or when a component throws synchronously outside
 * a router match).
 */
export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("[GlobalErrorBoundary]", error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;

    const message =
      this.state.error instanceof Error
        ? this.state.error.message
        : "The app hit an unexpected error.";

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-xl font-bold tracking-tight">
            Something went sideways
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page crashed while loading. You can try again, head home, or refresh.
          </p>
          <details className="mt-4 rounded-lg border border-border bg-background p-3 text-left text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">{message}</pre>
          </details>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={this.reset}
              className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center rounded-md border border-input bg-surface px-4 text-sm font-medium hover:bg-secondary"
            >
              Go home
            </a>
            <button
              onClick={() => location.reload()}
              className="inline-flex h-10 items-center rounded-md border border-input bg-surface px-4 text-sm font-medium hover:bg-secondary"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Re-export so callers can render an inline message if they want
export { renderErrorPage };

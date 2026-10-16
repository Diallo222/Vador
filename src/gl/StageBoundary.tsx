import { Component, type ReactNode } from "react";

/**
 * If WebGL is unavailable (or the context is lost for good) the story still
 * reads: the stage degrades to a static crimson-to-void atmosphere.
 */
export class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[Stage] WebGL unavailable, using static fallback.", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_40%,#3a0408_0%,#0b0303_45%,#050505_75%)]"
          aria-hidden
        />
      );
    }
    return this.props.children;
  }
}

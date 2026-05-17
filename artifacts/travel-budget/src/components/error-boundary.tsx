import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, Plane } from "lucide-react";

function CrashFallback({ onReset }: { onReset: () => void }) {
  return (
    <div className="fixed inset-0 bg-[hsl(222,47%,11%)] flex flex-col items-center justify-center p-8 text-center z-[9999]">
      <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
        <Plane className="w-10 h-10 text-orange-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Qualcosa è andato storto</h1>
      <p className="text-sm text-white/55 mb-1">Something went wrong</p>
      <p className="text-sm text-white/40 mb-8 max-w-xs leading-relaxed">
        Algo salió mal · Quelque chose s'est mal passé · 出现了问题
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all mb-3"
      >
        <RefreshCw className="w-4 h-4" />
        Riprova / Retry
      </button>
      <button
        onClick={() => window.location.reload()}
        className="text-sm text-white/35 hover:text-white/55 underline transition-colors"
      >
        Ricarica la pagina / Reload page
      </button>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error.message, info.componentStack?.slice(0, 300));
  }

  render() {
    if (this.state.hasError) {
      return <CrashFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, avoid noisy console crashes
    if (typeof console !== "undefined" && console.error) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6 text-stone-900 font-sans">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-800 border border-amber-200 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-stone-900">
                কিছু সমস্যা দেখা দিয়েছে
              </h2>
              <p className="text-sm font-semibold text-stone-600">
                Something went wrong while loading this page
              </p>
              <p className="text-xs text-stone-500 leading-relaxed pt-1">
                পৃষ্ঠাটি লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে পুনরায় চেষ্টা করুন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>পুনরায় চেষ্টা করুন (Retry)</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-stone-200"
              >
                <Home className="w-3.5 h-3.5 text-stone-600" />
                <span>মূল পাতা (Home)</span>
              </button>
            </div>

            {/* Collapsible debug trace for development only */}
            {import.meta.env?.DEV && this.state.error && (
              <details className="text-left text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200 overflow-x-auto mt-4">
                <summary className="cursor-pointer font-mono font-semibold text-red-700">
                  Developer Error Details (Local Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-stone-700">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

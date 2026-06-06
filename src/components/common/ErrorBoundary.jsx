import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <Card className="max-w-md w-full rounded-2xl glass-card border-red-500/20 p-6 space-y-4">
            <CardContent className="space-y-4 pt-4">
              <AlertOctagon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="text-xl font-bold text-slate-100 font-sans">حدث خطأ غير متوقع</h2>
              <p className="text-sm text-slate-400 font-sans">
                نعتذر عن ذلك! حدثت مشكلة أثناء تشغيل هذا المكون. يمكنك محاولة إعادة تحميل الصفحة.
              </p>
              {this.state.error && (
                <pre className="text-left ltr font-mono text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-800 text-red-300 overflow-x-auto max-h-[120px]">
                  {this.state.error.toString()}
                </pre>
              )}
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium font-sans cursor-pointer"
              >
                إعادة تحميل الصفحة
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

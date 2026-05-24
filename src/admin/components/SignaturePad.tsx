import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";

export type SignaturePadHandle = {
  toDataURL: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
};

export const SignaturePad = forwardRef<SignaturePadHandle, { height?: number }>(
  ({ height = 180 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const lastRef = useRef<{ x: number; y: number } | null>(null);
    const [empty, setEmpty] = useState(true);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const resize = () => {
        const ratio = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        canvas.width = w * ratio;
        canvas.height = height * ratio;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(ratio, ratio);
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.strokeStyle = "#111";
        }
      };
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, [height]);

    const getPos = (e: React.PointerEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as Element).setPointerCapture(e.pointerId);
      drawingRef.current = true;
      lastRef.current = getPos(e);
    };
    const move = (e: React.PointerEvent) => {
      if (!drawingRef.current) return;
      const ctx = canvasRef.current!.getContext("2d");
      if (!ctx || !lastRef.current) return;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastRef.current.x, lastRef.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastRef.current = p;
      setEmpty(false);
    };
    const end = () => { drawingRef.current = false; lastRef.current = null; };

    useImperativeHandle(ref, () => ({
      toDataURL: () => (empty ? null : canvasRef.current?.toDataURL("image/png") ?? null),
      clear: () => {
        const c = canvasRef.current; if (!c) return;
        c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
        setEmpty(true);
      },
      isEmpty: () => empty,
    }));

    return (
      <div className="space-y-2">
        <div className="rounded-md border bg-background" style={{ height }}>
          <canvas
            ref={canvasRef}
            className="block w-full h-full touch-none cursor-crosshair"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Sign with mouse or touch</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => {
            const c = canvasRef.current; if (!c) return;
            c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
            setEmpty(true);
          }}>Clear</Button>
        </div>
      </div>
    );
  }
);
SignaturePad.displayName = "SignaturePad";

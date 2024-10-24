import { useState, useEffect } from "react";
import { DEFAULT_CANVAS_HEIGHT } from "@/lib/constants";
import { DEFAULT_CANVAS_WIDTH } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Canvas } from "fabric";

export const CanvasSettings = ({ canvas }: { canvas: Canvas | null }) => {
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [canvasWidth, setCanvasWidth] = useState(DEFAULT_CANVAS_WIDTH);
  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({ width: canvasWidth });
      canvas.setDimensions({ height: canvasHeight });
      canvas.renderAll();
    }
  }, [canvas, canvasHeight, canvasWidth]);

  return (
    <section className="flex items-center gap-5 mb-2 bg-primary rounded-md p-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="canvas-height">Alto:</Label>
        <Input
          className="text-center"
          type="number"
          id="canvas-height"
          value={canvasHeight}
          min={1}
          max={1080}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= 1080) setCanvasHeight(value);
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="canvas-width">Ancho:</Label>
        <Input
          className="text-center"
          type="number"
          id="canvas-width"
          value={canvasWidth}
          min={1}
          max={1920}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= document.documentElement.clientWidth)
              setCanvasWidth(value);
          }}
        />
      </div>
    </section>
  );
};

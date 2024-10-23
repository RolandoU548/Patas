import { useState, useEffect } from "react";
import { DEFAULT_CANVAS_HEIGHT } from "@/lib/constants";
import { DEFAULT_CANVAS_WIDTH } from "@/lib/constants";
import { Input } from "./ui/input";
import { Canvas } from "fabric";

export const CanvasSettings = ({ canvas }: { canvas: Canvas | null }) => {
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [canvasWidth, setCanvasWidth] = useState(DEFAULT_CANVAS_WIDTH);
  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({ width: canvasWidth });
      canvas.setDimensions({ height: canvasHeight });
      console.log(canvas.getHeight());
      canvas.renderAll();
    }
  }, [canvas, canvasHeight, canvasWidth]);

  return (
    <div className="flex gap-2 mb-2">
      <Input
        className="text-center"
        type="number"
        value={canvasHeight}
        min={1}
        max={1080}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (value >= 1 && value <= 1080) setCanvasHeight(value);
        }}
      />
      <Input
        className="text-center"
        type="number"
        value={canvasWidth}
        min={1}
        max={1920}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (value >= 1 && value <= 1920) setCanvasWidth(value);
        }}
      />
    </div>
  );
};

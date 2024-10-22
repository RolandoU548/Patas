"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, Rect, Triangle, Ellipse } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { CanvasSettings } from "@/components/CanvasSettings";
import { DEFAULT_CANVAS_COLOR, DEFAULT_SHAPES_COLOR } from "@/lib/constants";

const canvasWidth = 450;
const canvasHeight = 450;

const rectangleHeight = 100;
const rectangleWidth = 100;

const triangleWidth = 100;
const triangleHeight = 86;

const ellipseWidth = 100;
const ellipseHeight = 100;

const App = () => {
  const canvasRef = useRef(null);

  const [canvas, setCanvas] = useState<Canvas | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: DEFAULT_CANVAS_COLOR,
      });

      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const shapes = [
    {
      constructor: Rect,
      icon: FaRegSquare,
      properties: {
        top: canvasHeight / 2 - rectangleHeight / 2,
        left: canvasWidth / 2 - rectangleWidth / 2,
        width: rectangleWidth,
        height: rectangleHeight,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
    {
      constructor: Triangle,
      icon: FiTriangle,
      properties: {
        top: canvasHeight / 2 - triangleHeight / 2,
        left: canvasWidth / 2 - triangleWidth / 2,
        width: triangleWidth,
        height: triangleHeight,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
    {
      constructor: Ellipse,
      icon: FaRegCircle,
      properties: {
        top: canvasHeight / 2 - ellipseHeight / 2,
        left: canvasWidth / 2 - ellipseWidth / 2,
        rx: ellipseWidth / 2,
        ry: ellipseHeight / 2,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
  ];

  return (
    <main className="flex flex-col items-center justify-start">
      <aside className="text-primary-foreground flex flex-col p-1 gap-1 fixed top-1/2 left-4 -translate-y-1/2 rounded-lg bg-primary">
        {shapes.map((shape, index) => {
          return (
            <Button
              key={index}
              className="w-full hover:bg-white/30 dark:hover:bg-black/30"
              onClick={() => {
                if (canvas) {
                  const addedShape = new shape.constructor(shape.properties);
                  canvas.add(addedShape);
                }
              }}
              variant={"ghost"}
            >
              {<shape.icon />}
            </Button>
          );
        })}
      </aside>
      <canvas
        className="border border-dark rounded"
        id="canvas"
        ref={canvasRef}
      />
      <CanvasSettings canvas={canvas} />
    </main>
  );
};

export default App;

"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import { Canvas, Rect, Triangle, Ellipse, Line } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { ShapeOptions } from "@/components/ShapeOptions";
import { DEFAULT_CANVAS_COLOR, DEFAULT_SHAPES_COLOR } from "@/lib/constants";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "@/lib/constants";
import { CanvasSettings } from "@/components/CanvasSettings";
import {
  handleObjectMoving,
  clearGuideLines,
} from "@/components/SnappingHelpers";

const canvasWidth = DEFAULT_CANVAS_WIDTH;
const canvasHeight = DEFAULT_CANVAS_HEIGHT;

const rectangleHeight = 100;
const rectangleWidth = 100;

const triangleWidth = 100;
const triangleHeight = 86;

const ellipseWidth = 100;
const ellipseHeight = 100;

const App = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuideLines] = useState<Line[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: DEFAULT_CANVAS_COLOR,
      });

      initCanvas.renderAll();

      setCanvas(initCanvas);

      initCanvas.on("object:moving", (event) => {
        handleObjectMoving(initCanvas, event.target, guidelines, setGuideLines);
      });

      initCanvas.on("object:modified", () => {
        clearGuideLines(initCanvas);
      });

      return () => {
        initCanvas.dispose();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface ShapeProperties {
    top: number;
    left: number;
    width?: number;
    height?: number;
    rx?: number;
    ry?: number;
    fill: string;
  }

  interface Shape {
    constructor: new (properties: ShapeProperties) => Rect | Triangle | Ellipse;
    icon: ReactNode;
    properties: ShapeProperties;
  }

  const shapes: Shape[] = [
    {
      constructor: Rect,
      icon: <FaRegSquare />,
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
      icon: <FiTriangle />,
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
      icon: <FaRegCircle />,
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
      <aside className="text-primary-foreground flex flex-col p-1 gap-1 fixed top-1/2 left-4 -translate-y-1/2 rounded-md bg-primary z-30">
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
              {shape.icon}
            </Button>
          );
        })}
      </aside>
      <CanvasSettings canvas={canvas} />
      <canvas
        className="border border-dark rounded"
        id="canvas"
        ref={canvasRef}
      />
      <ShapeOptions canvas={canvas} />
    </main>
  );
};

export default App;

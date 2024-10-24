"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import { Canvas, Rect, Triangle, Ellipse, Line, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { DEFAULT_CANVAS_COLOR, DEFAULT_SHAPES_COLOR } from "@/lib/constants";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "@/lib/constants";
import { ShapeOptions } from "@/components/edit/ShapeOptions";
import { CanvasSettings } from "@/components/edit/CanvasSettings";
import {
  handleObjectMoving,
  clearGuideLines,
} from "@/components/edit/SnappingHelpers";

const canvasWidth = DEFAULT_CANVAS_WIDTH;
const canvasHeight = DEFAULT_CANVAS_HEIGHT;

const rectangleHeight = 100;
const rectangleWidth = 100;

const triangleWidth = 100;
const triangleHeight = 86;

const ellipseWidth = 100;
const ellipseHeight = 100;

const App = ({ url }: { url: string }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuideLines] = useState<Line[]>([]);

  const addImage = async (canvas: Canvas, url: string) => {
    const image = await FabricImage.fromURL(url);
    image.top = canvas.height / 2 - image.height / 2;
    image.left = canvas.width / 2 - image.width / 2;
    canvas?.add(image);
    canvas?.renderAll();
  };

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

      addImage(initCanvas, url);

      return () => {
        initCanvas.dispose();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface ShapeProperties {
    top?: number;
    left?: number;
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
        width: rectangleWidth,
        height: rectangleHeight,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
    {
      constructor: Triangle,
      icon: <FiTriangle />,
      properties: {
        width: triangleWidth,
        height: triangleHeight,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
    {
      constructor: Ellipse,
      icon: <FaRegCircle />,
      properties: {
        width: ellipseWidth,
        height: ellipseHeight,
        rx: ellipseWidth / 2,
        ry: ellipseHeight / 2,
        fill: DEFAULT_SHAPES_COLOR,
      },
    },
  ];

  return (
    <main className="flex flex-col items-center">
      <aside className="text-primary-foreground flex flex-col p-1 gap-1 fixed top-1/2 left-4 -translate-y-1/2 rounded-md bg-primary z-30">
        {shapes.map((shape, index) => {
          return (
            <Button
              key={index}
              className="w-full hover:bg-white/30 dark:hover:bg-black/30"
              onClick={() => {
                if (canvas) {
                  const addedShape = new shape.constructor({
                    ...shape.properties,
                    top: canvas.height / 2 - (shape.properties.height ?? 0) / 2,
                    left: canvas.width / 2 - (shape.properties.width ?? 0) / 2,
                  });
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
        className="w-full mx-auto border border-dark rounded"
        id="canvas"
        ref={canvasRef}
      />
      <ShapeOptions canvas={canvas} />
      <Button
        onClick={() => {
          if (canvas)
            addImage(
              canvas,
              "https://firebasestorage.googleapis.com/v0/b/patas-49960.appspot.com/o/drawings%2Fd3254f2b-8773-44d8-9604-c9ac726db637?alt=media&token=1b93aa6b-da06-4950-8a85-5eb31ded62ef"
            );
        }}
      >
        AGREGAR
      </Button>
    </main>
  );
};

export default App;

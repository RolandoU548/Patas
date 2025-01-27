"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import { Canvas, Rect, Triangle, Ellipse, FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { DEFAULT_CANVAS_COLOR, DEFAULT_SHAPES_COLOR } from "@/lib/constants";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "@/lib/constants";
import { ShapeOptions } from "@/components/edit/ShapeOptions";
import { CanvasSettings } from "@/components/edit/CanvasSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  handleObjectMoving,
  clearGuideLines,
} from "@/components/edit/SnappingHelpers";
import { uploadDrawingToFirebase } from "@/lib/utils";
import { Drawing } from "@prisma/client";

const canvasWidth = DEFAULT_CANVAS_WIDTH;
const canvasHeight = DEFAULT_CANVAS_HEIGHT;

const rectangleHeight = 100;
const rectangleWidth = 100;

const triangleWidth = 100;
const triangleHeight = 86;

const ellipseWidth = 100;
const ellipseHeight = 100;

const App = ({ drawing }: { drawing: Drawing }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  const addImage = async (canvas: Canvas, url: string) => {
    const image = await FabricImage.fromObject({
      src: url,
      crossOrigin: "anonymous",
    });
    image.top = canvas.height / 2 - image.height / 2;
    image.left = canvas.width / 2 - image.width / 2;
    image.fill = "#000000";
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
        handleObjectMoving(initCanvas, event.target);
      });
      initCanvas.on("object:modified", () => {
        clearGuideLines(initCanvas);
      });

      addImage(initCanvas, drawing.imageUrl);

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

      <div className="mt-2 flex flex-col gap-2 items-center">
        <Label htmlFor="image">Agrega una imagen</Label>
        <Input
          className=""
          onChange={(e) => {
            if (e.target.files) {
              addImage(
                canvas as Canvas,
                URL.createObjectURL(e.target.files[0])
              );
            }
          }}
          type="file"
          id="image"
          name="image"
          accept="image/png, image/jpeg, image/gif"
        />
      </div>
      <Button
        onClick={() => {
          const dataUrl = canvas?.toDataURL({ format: "png", multiplier: 1 });
          if (dataUrl === null || dataUrl == undefined) return;
          const arr = dataUrl.split(",");
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : "";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          uploadDrawingToFirebase(
            drawing.id,
            new File([u8arr], drawing.title, { type: mime })
          );
        }}
      >
        Guardar
      </Button>
    </main>
  );
};

export default App;

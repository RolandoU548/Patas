"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, Rect, Triangle, Line, Ellipse } from "fabric";
import { Button } from "@/components/ui/button";
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { FiTriangle } from "react-icons/fi";
import { CanvasSettings } from "@/components/CanvasSettings";

const App = () => {
  const canvasRef = useRef(null);
  const canvasWidth = 450;
  const canvasHeight = 450;
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  const DEFAULT_SHAPES_COLOR = "#000000";
  const rectangleHeight = 100;
  const rectangleWidth = 100;
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
      addShape() {},
    },
  ];

  shapes.forEach((shape) => {
    shape.addShape = function () {
      if (canvas) {
        const addedShape = new shape.constructor(shape.properties);
        canvas.add(addedShape);
      }
    };
  });

  const functionsShapes = shapes.map((shape) => {
    return () => {
      if (canvas) {
        const addedShape = new shape.constructor(shape.properties);
        canvas.add(addedShape);
      }
    };
  });
  console.log(functionsShapes);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "white",
      });

      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rectangleWidth = 100;
      const rectangleHeight = 100;
      const rect = new Rect({
        top: canvasHeight / 2 - rectangleHeight / 2,
        left: canvasWidth / 2 - rectangleWidth / 2,
        width: rectangleWidth,
        height: rectangleHeight,
        fill: "#000000",
      });
      canvas.add(rect);
    }
  };
  const addLine = () => {
    if (canvas) {
      const lineLength = canvasWidth / 2;
      const line = new Line([0, 0, lineLength, 0], {
        top: canvasHeight / 2,
        left: canvasWidth / 2 - lineLength / 2,
        stroke: "#000000",
        strokeWidth: 5,
      });
      canvas.add(line);
    }
  };
  const addTriangle = () => {
    if (canvas) {
      const triangleWidth = 100;
      const triangleHeight = 86;
      const triangle = new Triangle({
        top: canvasHeight / 2 - triangleHeight / 2,
        left: canvasWidth / 2 - triangleWidth / 2,
        width: triangleWidth,
        height: triangleHeight,
        fill: "#000000",
      });
      canvas.add(triangle);
    }
  };
  const addEllipse = () => {
    if (canvas) {
      const ellipseWidth = 100;
      const ellipseHeight = 100;
      const ellipse = new Ellipse({
        top: canvasHeight / 2 - ellipseHeight / 2,
        left: canvasWidth / 2 - ellipseWidth / 2,
        rx: ellipseWidth / 2,
        ry: ellipseHeight / 2,
        fill: "#000000",
      });
      canvas.add(ellipse);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start">
      <aside className="text-primary-foreground flex flex-col p-1 gap-1 fixed top-1/2 left-4 -translate-y-1/2 rounded-lg bg-primary">
        {shapes.map((shape, index) => {
          return (
            <Button
              key={index}
              className="w-full hover:bg-white/30 dark:hover:bg-black/30"
              onClick={shape.addShape}
              variant={"ghost"}
            >
              {<shape.icon />}
            </Button>
          );
        })}
        <Button
          className="w-full hover:bg-white/30 dark:hover:bg-black/30"
          onClick={addLine}
          variant={"ghost"}
        >
          <span className="rotate-45">|</span>
        </Button>
        <Button
          className="w-full hover:bg-white/30 dark:hover:bg-black/30"
          onClick={addRectangle}
          variant={"ghost"}
        >
          <FaRegSquare />
        </Button>
        <Button
          className="w-full hover:bg-white/30 dark:hover:bg-black/30"
          onClick={addTriangle}
          variant={"ghost"}
        >
          <FiTriangle />
        </Button>
        <Button
          className="w-full hover:bg-white/30 dark:hover:bg-black/30"
          onClick={addEllipse}
          variant={"ghost"}
        >
          <FaRegCircle />
        </Button>
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

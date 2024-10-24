import { Canvas, FabricObject, Line } from "fabric";
import { Dispatch, SetStateAction } from "react";

const snappingDistance = 10;

interface LineWithId extends Line {
  id: string;
}

export const clearGuideLines = (canvas: Canvas) => {
  const lines: FabricObject[] = canvas.getObjects("line");
  const linesWithId = lines.filter((line): line is LineWithId => {
    return (line as LineWithId).id !== undefined;
  });

  linesWithId.forEach((line) => {
    if (
      (line.id && line.id.startsWith("vertical-")) ||
      line.id.startsWith("horizontal-")
    ) {
      canvas.remove(line);
    }
  });
  canvas.renderAll();
};

export const handleObjectMoving = (
  canvas: Canvas,
  obj: FabricObject,
  guideLines: Line[],
  setGuideLines: Dispatch<SetStateAction<Line[]>>
) => {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const left = obj.left;
  const top = obj.top;
  const right = left + obj.width * obj.scaleX;
  const bottom = top + obj.height * obj.scaleY;

  const centerX = left + (obj.width * obj.scaleX) / 2;
  const centerY = top + (obj.height * obj.scaleY) / 2;

  const newGuideLines = [];
  clearGuideLines(canvas);

  let snapped = false;

  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: 0 });
    if (!guideLineExists(canvas, "vertical-left")) {
      const line = createVerticalGuideLine(canvas, 0, "vertical-left");
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: 0 });
    if (!guideLineExists(canvas, "horizontal-top")) {
      const line = createHorizontalGuideLine(canvas, 0, "horizontal-top");
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
  if (Math.abs(right - canvasWidth) < snappingDistance) {
    obj.set({ left: canvasWidth - obj.width * obj.scaleX });
    if (!guideLineExists(canvas, "vertical-right")) {
      const line = createVerticalGuideLine(
        canvas,
        canvasWidth,
        "vertical-right"
      );
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    obj.set({ top: canvasHeight - obj.height * obj.scaleY });
    if (!guideLineExists(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideLine(
        canvas,
        canvasHeight,
        "horizontal-bottom"
      );
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
    if (!guideLineExists(canvas, "vertical-center")) {
      const line = createVerticalGuideLine(
        canvas,
        canvasWidth / 2,
        "vertical-center"
      );
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }
  if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
    obj.set({ top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2 });
    if (!guideLineExists(canvas, "horizontal-center")) {
      const line = createHorizontalGuideLine(
        canvas,
        canvasHeight / 2,
        "horizontal-center"
      );
      newGuideLines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (!snapped) {
    clearGuideLines(canvas);
  } else {
    setGuideLines(newGuideLines);
  }

  canvas.renderAll();
};

export const createVerticalGuideLine = (
  canvas: Canvas,
  x: number,
  id: string
) => {
  return new Line([x, 0, x, canvas.height], {
    id,
    stroke: "red",
    strokeWidth: 3,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

export const createHorizontalGuideLine = (
  canvas: Canvas,
  y: number,
  id: string
) => {
  return new Line([0, y, canvas.width, y], {
    id,
    stroke: "red",
    strokeWidth: 3,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

const guideLineExists = (canvas: Canvas, id: string) => {
  const lines: FabricObject[] = canvas.getObjects("line");
  const linesWithId = lines.filter((line): line is LineWithId => {
    return (line as LineWithId).id !== undefined;
  });
  return linesWithId.some((line) => {
    return line.id === id;
  });
};

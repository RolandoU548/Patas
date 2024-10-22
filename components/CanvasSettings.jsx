import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "./ui/button";

export const CanvasSettings = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [color, setColor] = useState("#000000");
  const [stroke, setStroke] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });

      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });

      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;
    setSelectedObject(object);

    if (object.opacity) {
      setOpacity(object.opacity * 100);
    }
    if (object.fill) {
      setColor(object.fill);
    }
    if (object.stroke) {
      setStroke(object.stroke);
      setStrokeWidth(object.strokeWidth);
    }
    if (object.type === "rect" || object.type === "triangle") {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
    } else if (object.type === "ellipse") {
      setWidth(Math.round(object.rx * 2 * object.scaleX));
      setHeight(Math.round(object.ry * 2 * object.scaleY));
    }
  };

  const clearSettings = () => {
    setWidth(0);
    setHeight(0);
    setColor("#000000");
    setStroke("#ffffff");
    setStrokeWidth(0);
    setOpacity(100);
  };

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setWidth(intValue);
    selectedObject.set({ width: intValue / selectedObject.scaleX });
    canvas.renderAll();
  };

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setHeight(intValue);
    selectedObject.set({ height: intValue / selectedObject.scaleY });
    canvas.renderAll();
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);
    selectedObject.set({ fill: value });
    canvas.renderAll();
  };

  const handleStrokeWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setStrokeWidth(intValue);
    selectedObject.set({ strokeWidth: intValue });
    canvas.renderAll();
  };

  const handleStrokeChange = (e) => {
    const value = e.target.value;
    setStroke(value);
    selectedObject.set({ stroke: value });
    canvas.renderAll();
  };

  const handleRxChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setWidth(intValue);
    selectedObject.set({ rx: intValue / 2 / selectedObject.scaleX });
    canvas.renderAll();
  };

  const handleRyChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);
    setHeight(intValue);
    selectedObject.set({ ry: intValue / 2 / selectedObject.scaleY });
    canvas.renderAll();
  };

  const handleOpacityChange = (value) => {
    const intValue = parseInt(value, 10);
    setOpacity(intValue);
    selectedObject.set({ opacity: intValue / 100 });
    canvas.renderAll();
  };

  const handleDelete = () => {
    canvas.remove(selectedObject);
    clearSettings();
  };

  if (selectedObject)
    return (
      <section className="fixed right-4 -translate-y-1/2 top-1/2 gap-2 flex flex-col p-2 text-left bg-primary empty:p-0">
        {(selectedObject.type === "rect" ||
          selectedObject.type === "triangle") && (
          <>
            <Label className="text-primary-foreground" htmlFor="width">
              Ancho
            </Label>
            <Input
              value={width}
              type="number"
              id="width"
              min={1}
              onChange={handleWidthChange}
            />
            <Label className="text-primary-foreground" htmlFor="height">
              Alto
            </Label>
            <Input
              value={height}
              type="number"
              id="height"
              min={1}
              onChange={handleHeightChange}
            />
          </>
        )}
        {selectedObject.type === "ellipse" && (
          <>
            <Label className="text-primary-foreground" htmlFor="width">
              Ancho
            </Label>
            <Input
              value={width}
              type="number"
              id="width"
              min={1}
              onChange={handleRxChange}
            />
            <Label className="text-primary-foreground" htmlFor="height">
              Alto
            </Label>
            <Input
              value={height}
              type="number"
              id="height"
              min={1}
              onChange={handleRyChange}
            />
          </>
        )}
        {(selectedObject.type === "rect" ||
          selectedObject.type === "triangle" ||
          selectedObject.type === "ellipse") && (
          <>
            <Label className="text-primary-foreground" htmlFor="color">
              Color
            </Label>
            <Input
              value={color}
              type="color"
              id="color"
              onChange={handleColorChange}
            />
          </>
        )}
        {(selectedObject.type === "rect" ||
          selectedObject.type === "triangle" ||
          selectedObject.type === "ellipse" ||
          selectedObject.type === "line") && (
          <>
            <Label className="text-primary-foreground" htmlFor="strokeWidth">
              Ancho del Borde
            </Label>
            <Input
              value={strokeWidth}
              type="number"
              id="strokeWidth"
              min={0}
              onChange={handleStrokeWidthChange}
            />
            <Label className="text-primary-foreground" htmlFor="stroke">
              Color del Borde
            </Label>
            <Input
              value={stroke}
              type="color"
              id="stroke"
              onChange={handleStrokeChange}
            />
          </>
        )}
        <Label className="text-primary-foreground" htmlFor="opacity">
          Opacidad
        </Label>
        <Slider
          className="back"
          value={[opacity, 100]}
          defaultValue={[100]}
          max={100}
          onValueChange={(value) => handleOpacityChange(value)}
        />
        <Button onClick={handleDelete} variant={"destructive"}>
          Eliminar
        </Button>
      </section>
    );
};

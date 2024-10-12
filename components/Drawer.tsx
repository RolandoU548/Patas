"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SketchPicker } from "react-color";
import { Pencil, Type, Square, Image as ImageIcon, Move } from "lucide-react";

interface Drawing {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  drawingData: DrawingData;
}

interface DrawingData {
  lines: Line[];
  shapes: Shape[];
  texts: Text[];
  overlayImages: OverlayImage[];
}

interface Line {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Text {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

interface OverlayImage {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

type EditorMode = "draw" | "text" | "shape" | "image" | "move";

export function Drawer() {
  const [step, setStep] = useState<"upload" | "edit" | "grid">("grid");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("draw");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [fontSize, setFontSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);
  const [overlayImages, setOverlayImages] = useState<OverlayImage[]>([]);
  const [selectedElement, setSelectedElement] = useState<
    Shape | Text | OverlayImage | null
  >(null);
  const [editingDrawing, setEditingDrawing] = useState<Drawing | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && image) {
      setStep("edit");
    }
  };

  const handleUpload = () => {
    if (canvasRef.current) {
      const drawingData: DrawingData = {
        lines,
        shapes,
        texts,
        overlayImages,
      };

      if (editingDrawing) {
        const updatedDrawings = drawings.map((drawing) =>
          drawing.id === editingDrawing.id
            ? {
                ...drawing,
                title,
                description,
                imageUrl: canvasRef.current!.toDataURL(),
                drawingData,
              }
            : drawing
        );
        setDrawings(updatedDrawings);
      } else {
        const newDrawing: Drawing = {
          id: Date.now(),
          title,
          description,
          imageUrl: canvasRef.current.toDataURL(),
          drawingData,
        };
        setDrawings([...drawings, newDrawing]);
      }

      setStep("grid");
      setTitle("");
      setDescription("");
      setImage(null);
      setLines([]);
      setShapes([]);
      setTexts([]);
      setOverlayImages([]);
      setEditingDrawing(null);
    }
  };

  useEffect(() => {
    if (step === "edit" && canvasRef.current && image) {
      const canvas = canvasRef.current;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        redrawCanvas();
      };
      img.src = image;
    }
  }, [step, image]);

  const redrawCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx && image) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);
            for (let i = 1; i < line.points.length; i++) {
              ctx.lineTo(line.points[i].x, line.points[i].y);
            }
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.width;
            ctx.lineCap = "round";
            ctx.stroke();
          });
          shapes.forEach((shape) => {
            ctx.fillStyle = shape.color;
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          });
          texts.forEach((text) => {
            ctx.fillStyle = text.color;
            ctx.font = `${text.fontSize}px Arial`;
            ctx.fillText(text.text, text.x, text.y);
          });
          overlayImages.forEach((img) => {
            const imgElement = new Image();
            imgElement.src = img.src;
            ctx.drawImage(imgElement, img.x, img.y, img.width, img.height);
          });
        };
        img.src = image;
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d"); // Obtener contexto aquí

      if (!ctx) {
        console.error("No se pudo obtener el contexto del canvas.");
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDragStart({ x, y });

      if (editorMode === "draw") {
        setIsDrawing(true);
        setCurrentLine({ points: [{ x, y }], color, width: lineWidth });
      } else if (editorMode === "shape") {
        const newShape = { type: "rect", x, y, width: 50, height: 50, color };
        setShapes([...shapes, newShape]);
        setSelectedElement(newShape);
      } else if (editorMode === "text") {
        const text = prompt("Enter text:");
        if (text) {
          const newText = { text, x, y, color, fontSize };
          setTexts([...texts, newText]);
          setSelectedElement(newText);
        }
      } else if (editorMode === "move") {
        const clickedElement = [...shapes, ...texts, ...overlayImages].find(
          (elem) => {
            if ("text" in elem) {
              return (
                x >= elem.x &&
                x <= elem.x + ctx.measureText(elem.text).width &&
                y >= elem.y - elem.fontSize &&
                y <= elem.y
              );
            } else {
              return (
                x >= elem.x &&
                x <= elem.x + elem.width &&
                y >= elem.y &&
                y <= elem.y + elem.height
              );
            }
          }
        );
        setSelectedElement(clickedElement || null);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDrawing && editorMode === "draw" && currentLine) {
        setCurrentLine({
          ...currentLine,
          points: [...currentLine.points, { x, y }],
        });
      } else if (editorMode === "move" && selectedElement && dragStart) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;

        if ("text" in selectedElement) {
          setTexts(
            texts.map((t) =>
              t === selectedElement ? { ...t, x: t.x + dx, y: t.y + dy } : t
            )
          );
        } else if ("src" in selectedElement) {
          setOverlayImages(
            overlayImages.map((img) =>
              img === selectedElement
                ? { ...img, x: img.x + dx, y: img.y + dy }
                : img
            )
          );
        } else {
          setShapes(
            shapes.map((s) =>
              s === selectedElement ? { ...s, x: s.x + dx, y: s.y + dy } : s
            )
          );
        }
        setSelectedElement({
          ...selectedElement,
          x: selectedElement.x + dx,
          y: selectedElement.y + dy,
        });
        setDragStart({ x, y });
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && currentLine) {
      setLines([...lines, currentLine]);
    }
    setIsDrawing(false);
    setCurrentLine(null);
    setDragStart(null);
    redrawCanvas();
  };

  const handleOverlayImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          const newImage = { src: result, x: 0, y: 0, width: 100, height: 100 };
          setOverlayImages([...overlayImages, newImage]);
          setSelectedElement(newImage);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditDrawing = (drawing: Drawing) => {
    setEditingDrawing(drawing);
    setTitle(drawing.title);
    setDescription(drawing.description);
    setImage(drawing.imageUrl);
    setLines(drawing.drawingData.lines);
    setShapes(drawing.drawingData.shapes);
    setTexts(drawing.drawingData.texts);
    setOverlayImages(drawing.drawingData.overlayImages);
    setStep("edit");
  };

  if (step === "upload") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="image">Imagen</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep("grid")}>Volver</Button>
          <Button type="submit">Siguiente</Button>
        </div>
      </form>
    );
  }

  if (step === "edit") {
    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex space-x-2 mb-4">
          <Button
            onClick={() => setEditorMode("draw")}
            variant={editorMode === "draw" ? "default" : "outline"}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Dibujar
          </Button>
          <Button
            onClick={() => setEditorMode("text")}
            variant={editorMode === "text" ? "default" : "outline"}
          >
            <Type className="w-4 h-4 mr-2" />
            Texto
          </Button>
          <Button
            onClick={() => setEditorMode("shape")}
            variant={editorMode === "shape" ? "default" : "outline"}
          >
            <Square className="w-4 h-4 mr-2" />
            Forma
          </Button>
          <Button
            onClick={() => setEditorMode("image")}
            variant={editorMode === "image" ? "default" : "outline"}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Imagen
          </Button>
          <Button
            onClick={() => setEditorMode("move")}
            variant={editorMode === "move" ? "default" : "outline"}
          >
            <Move className="w-4 h-4 mr-2" />
            Mover
          </Button>
        </div>
        <div className="flex space-x-4 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[120px]">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <SketchPicker
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </PopoverContent>
          </Popover>
          {editorMode === "draw" && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="line-width">Grosor</Label>
              <Slider
                id="line-width"
                min={1}
                max={20}
                step={1}
                value={[lineWidth]}
                onValueChange={(value) => setLineWidth(value[0])}
                className="w-[100px]"
              />
            </div>
          )}
          {editorMode === "text" && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="font-size">Tamaño</Label>
              <Select
                value={fontSize.toString()}
                onValueChange={(value) => setFontSize(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {editorMode === "image" && (
            <Input
              type="file"
              accept="image/*"
              onChange={handleOverlayImageUpload}
            />
          )}
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className="border border-gray-300"
        />
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep("grid")}>Volver</Button>
          <Button onClick={handleUpload}>Guardar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Mis Dibujos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {drawings.map((drawing) => (
          <div key={drawing.id} className="border rounded-lg p-4">
            <img
              src={drawing.imageUrl}
              alt={drawing.title}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="font-semibold">{drawing.title}</h3>
            <p className="text-sm text-gray-600">{drawing.description}</p>
            <Button onClick={() => handleEditDrawing(drawing)} className="mt-2">
              Editar
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={() => setStep("upload")} className="mt-4">
        Subir Nuevo Dibujo
      </Button>
    </div>
  );
}

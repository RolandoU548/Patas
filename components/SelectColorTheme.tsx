"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { DEFAULT_COLOR_THEME } from "@/lib/constants";
import { ColorTheme } from "@/lib/constants";

interface Theme {
  name: string;
  value: ColorTheme;
}

export const SelectColorTheme = () => {
  const themes: Theme[] = [
    { name: "Rosa", value: ColorTheme.Rose },
    { name: "Azul", value: ColorTheme.Blue },
    { name: "Zinc", value: ColorTheme.Zinc },
    { name: "Naranja", value: ColorTheme.Orange },
    { name: "Verde", value: ColorTheme.Green },
    { name: "Amarillo", value: ColorTheme.Yellow },
    { name: "Slate", value: ColorTheme.Slate },
    { name: "Morado", value: ColorTheme.Violet },
    { name: "Rojo", value: ColorTheme.Red },
  ];

  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_COLOR_THEME);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorTheme");
    if (savedTheme) {
      const body = document.querySelector("body");
      body?.classList.remove(DEFAULT_COLOR_THEME);
      body?.classList.add(savedTheme);
      setCurrentTheme(savedTheme);
    }
  }, []);

  return (
    <Select
      name="color"
      value={currentTheme}
      onValueChange={(e) => {
        const body = document.querySelector("body");
        body?.classList.remove(currentTheme);
        body?.classList.add(e);
        setCurrentTheme(e);
        localStorage.setItem("colorTheme", e);
      }}
    >
      <SelectTrigger className="w-fit px-5 md:w-48">
        <SelectValue placeholder="Tema" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme, index) => {
          return (
            <SelectItem key={index} value={theme.value}>
              <div className="flex items-center justify-center gap-2">
                <div className={`h-5 w-5 rounded ${theme.value} bg-primary`} />
                <div>{theme.name}</div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface theme {
  name: string;
  value: string;
}

export const SelectColorTheme = () => {
  const initialColorTheme = "theme-rose";

  const themes: theme[] = [
    { name: "Rosa", value: "theme-rose" },
    { name: "Azul", value: "theme-blue" },
    { name: "Zinc", value: "theme-zinc" },
    { name: "Naranja", value: "theme-orange" },
    { name: "Verde", value: "theme-green" },
    { name: "Amarillo", value: "theme-yellow" },
    { name: "Slate", value: "theme-slate" },
    { name: "Morado", value: "theme-violet" },
    { name: "Rojo", value: "theme-red" },
  ];

  const [currentTheme, setCurrentTheme] = useState<string>(initialColorTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("colorTheme");
    if (savedTheme) {
      const body = document.querySelector("body");
      body?.classList.remove(initialColorTheme);
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

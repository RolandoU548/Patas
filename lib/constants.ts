export enum ColorTheme {
  Rose = "theme-rose",
  Blue = "theme-blue",
  Zinc = "theme-zinc",
  Orange = "theme-orange",
  Green = "theme-green",
  Yellow = "theme-yellow",
  Slate = "theme-slate",
  Violet = "theme-violet",
  Red = "theme-red",
}

export const DEFAULT_COLOR_THEME: ColorTheme = ColorTheme.Rose;

export type Hex = `#${string}`;

export const DEFAULT_CANVAS_COLOR: Hex = "#ffffff";
export const DEFAULT_CANVAS_HEIGHT = 400;
export const DEFAULT_CANVAS_WIDTH = 450;
export const DEFAULT_SHAPES_COLOR: Hex = "#000000";

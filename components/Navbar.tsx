import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Merienda } from "next/font/google";
import { SelectColorTheme } from "./SelectColorTheme";

const merienda = Merienda({
  subsets: ["latin"],
  weight: "400",
});

export const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <Link
          href="/"
          className={`text-4xl text-primary ${merienda.className}`}
        >
          Patas
        </Link>
        <div className="flex gap-5">
          <SelectColorTheme />
          <ModeToggle />
        </div>
      </div>
      <hr />
    </>
  );
};

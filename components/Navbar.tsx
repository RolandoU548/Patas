import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Merienda } from "next/font/google";

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
        <ModeToggle />
      </div>
      <hr />
    </>
  );
};

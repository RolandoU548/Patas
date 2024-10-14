import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { uploadFile } from "@/firebase/config";
import { deleteFile } from "@/firebase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadDrawingToFirebase = async (
  uuid: string,
  image: File
): Promise<string> => {
  try {
    const imageUrl = await uploadFile(image, `drawings/${uuid}`);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Upload failed.");
  }
};

export const deleteDrawingFromFirebase = async (id: string): Promise<void> => {
  try {
    await deleteFile(`drawings/${id}`);
  } catch (error) {
    console.error(error);
    return;
  }
};

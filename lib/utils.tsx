import { clsx, type ClassValue as ClsxValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Extended type to safely handle all class value variations
export type ClassValue =
  | ClsxValue
  | string
  | number
  | null
  | boolean
  | undefined
  | Record<string, boolean>
  | ClassValue[];

// Utility function: merges conditional + Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDecimalString(value: number): string {
  const [integerPart, fractionalPart] = value.toString().split('.');
  return fractionalPart
    ? `${integerPart}.${fractionalPart.padEnd(2, '0')}`
    : `${integerPart}.00`;
}

export function convertToJSON<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

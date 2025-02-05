import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getErrorMessage(error: any){
  if(error.name === 'ZodError') {
    const errorList = Object.keys(error.errors).map((field) => error.errors[field].message);
    return errorList.join('. ');
  } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002'){
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
  }
}


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

export const roundOffValue = (value: number | string): number => {
  const num = Number(value);
  if (isNaN(num)) throw new Error('Please provide a valid number');
  
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
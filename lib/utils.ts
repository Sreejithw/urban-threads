import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any){
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

const CURRENCY_FORMAT_TYPE = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMAT_TYPE.format(amount);
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMAT_TYPE.format(Number(amount));
  } else {
    return 'NaN';
  }
}

export function maskDynamicId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formQueryParamsforUrl({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    { skipNull: true }
  );
}

// Function for countdown timer
export const countDownTimer = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toStandardNumbers(text: string) {
  return text.replace(/[٠-٩]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 0x0030),
  )
}

export function formatNumber(
  value: number,
  locale = 'ar-EG-u-nu-latn',
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, {
    numberingSystem: 'latn',
    ...options,
  }).format(value)
}

export function formatCurrency(
  value: number,
  currency: string,
  locale = 'ar-EG-u-nu-latn',
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    numberingSystem: 'latn',
    ...options,
  }).format(value)
}

export function formatDate(
  date: Date | string | number,
  locale = 'ar-EG-u-nu-latn',
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale, {
    numberingSystem: 'latn',
    ...options,
  }).format(new Date(date))
}

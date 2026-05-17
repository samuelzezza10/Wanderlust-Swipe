export const CURRENCY_CFG = {
  it: { symbol: "€", code: "EUR", rate: 1 },
  es: { symbol: "€", code: "EUR", rate: 1 },
  fr: { symbol: "€", code: "EUR", rate: 1 },
  de: { symbol: "€", code: "EUR", rate: 1 },
  en: { symbol: "£", code: "GBP", rate: 0.86 },
  zh: { symbol: "¥", code: "CNY", rate: 7.8 },
} as const;

type LangKey = keyof typeof CURRENCY_CFG;

export function formatCurrency(eurAmount: number, lang: string): string {
  const cfg = CURRENCY_CFG[lang as LangKey] ?? CURRENCY_CFG.it;
  const converted = Math.round(eurAmount * cfg.rate);
  return `${cfg.symbol}${converted.toLocaleString()}`;
}

export function getCurrencySymbol(lang: string): string {
  return (CURRENCY_CFG[lang as LangKey] ?? CURRENCY_CFG.it).symbol;
}

export function formatDistance(km: number, lang: string): string {
  if (lang === "en") {
    const miles = Math.round(km * 0.621371);
    return `${miles} mi`;
  }
  return `${km} km`;
}

export function distanceUnitLabel(lang: string): string {
  return lang === "en" ? "mi from centre" : "km from centre";
}

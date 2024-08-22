const CURRNCY_FORMATTER = new Intl.NumberFormat(undefined, { currency: "USD", style: "currency" })

export function formatCurrency(number: number) {
  return CURRNCY_FORMATTER.format(number)
}
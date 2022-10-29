export const formatNumberInteger = (value: number, locale: string): string => {
    return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export const formatNumber = (value: number, locale: string, maxDigits: number, minDigits?: number): string => {
    return value.toLocaleString(locale, {
        minimumFractionDigits: minDigits || maxDigits,
        maximumFractionDigits: maxDigits,
    });
}
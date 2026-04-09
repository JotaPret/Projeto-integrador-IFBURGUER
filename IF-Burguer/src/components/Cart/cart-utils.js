export function toCartId(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export function parsePriceLabel(label) {
    const normalized = label
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(',', '.')

    const value = Number(normalized)
    return Number.isFinite(value) ? value : 0
}

export function formatPriceBRL(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
}

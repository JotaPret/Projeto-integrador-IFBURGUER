export function toCartId(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

const PRODUCT_ID_BY_NAME = {
    'Texas BBQ Burger': 1,
    'Chicken Crispy': 2,
    'Blue Cheese Burger': 3,
    'Smash Burger Clássico': 4,
    'Bacon Lover': 5,
    'Veggie Burger': 6,
    'Double Cheese': 7,
    'Combo Triplo': 8,
    'Combo Kids': 9,
    'Combo Individual': 10,
    'Combo Duplo': 11,
    'Guaraná Antarctica 500ml': 12,
    'Água Mineral 500ml': 13,
    'Milkshake Morango': 14,
    'Milkshake Ovomaltine': 15,
    'Coca-Cola 500ml': 16,
    'Milkshake Chocolate': 17,
    'Suco Natural Laranja': 18,
    'Petit Gateau': 19,
    'Brownie com Sorvete': 20,
    'Churros com Nutella': 21,
    'Batata Cheddar Bacon': 22,
    'Batata Frita': 23,
    'Onion Rings': 24,
    'Nuggets 10un': 25,
}

export function inferProdutoIdFromName(name) {
    const key = String(name || '').trim()
    const value = PRODUCT_ID_BY_NAME[key]
    return Number.isInteger(value) ? value : null
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

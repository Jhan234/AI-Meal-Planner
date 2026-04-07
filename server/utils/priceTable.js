export const NZ_PRICE_TABLE = {
  chicken: { price: 8.50, unit: 'kg' },
  mince: { price: 9.00, unit: 'kg' },
  rice: { price: 3.00, unit: 'kg' },
  pasta: { price: 2.50, unit: '500g' },
  eggs: { price: 5.50, unit: 'dozen' },
  milk: { price: 3.20, unit: 'litre' },
  butter: { price: 4.50, unit: '500g' },
  onion: { price: 1.50, unit: 'kg' },
  garlic: { price: 2.00, unit: 'bulb' },
  potato: { price: 3.50, unit: 'kg' },
  carrot: { price: 2.00, unit: 'kg' },
  broccoli: { price: 3.00, unit: 'head' },
  tomato: { price: 4.00, unit: 'kg' },
  cheese: { price: 7.00, unit: '400g' },
  bread: { price: 3.50, unit: 'loaf' },
  flour: { price: 2.50, unit: 'kg' },
  sugar: { price: 2.50, unit: 'kg' },
  oil: { price: 5.00, unit: 'litre' },
  soy_sauce: { price: 3.50, unit: 'bottle' },
  beef: { price: 12.00, unit: 'kg' },
  salmon: { price: 18.00, unit: 'kg' },
  spinach: { price: 3.00, unit: 'bag' },
  kumara: { price: 3.50, unit: 'kg' },
  lamb: { price: 14.00, unit: 'kg' },
  pork: { price: 9.50, unit: 'kg' },
};

export function estimateCost(ingredients) {
  let total = 0;
  for (const ing of ingredients) {
    const name = ing.name?.toLowerCase().replace(/\s+/g, '_');
    const priceInfo = NZ_PRICE_TABLE[name];
    if (priceInfo) {
      total += priceInfo.price * (ing.quantity || 1);
    } else {
      total += 3.00;
    }
  }
  return Math.round(total * 100) / 100;
}

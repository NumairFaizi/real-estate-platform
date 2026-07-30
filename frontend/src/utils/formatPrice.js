export const formatPrice = (price) => {
  if (!price) return '₹0';
  return `₹${price.toLocaleString('en-IN')}`;
};

// Optional: shows "₹85 Lakh" or "₹2.1 Cr" instead of the full number — common on Indian property sites
export const formatPriceShort = (price) => {
  if (!price) return '₹0';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
};
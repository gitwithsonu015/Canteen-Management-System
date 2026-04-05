export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function calculateCartTotal(items = []) {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function mapOrderPayloadFromCart(items = []) {
  return items.map((item) => ({
    foodId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
}
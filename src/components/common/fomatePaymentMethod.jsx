export default function formatPaymentMethod (method)
{
  if (!method) return "";

  const abbreviations = ["upi", "cod"];
  if (abbreviations.includes(method.toLowerCase())) {
    return method.toUpperCase();
  }

  return method
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

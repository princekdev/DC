// Returns true if a feature's value is identical across all three plans.
export function isSameAcrossPlans(item) {
  return item.basic === item.pro && item.pro === item.premium;
}

// Human-readable value for a single plan's cell.
export function formatValue(item, planId) {
  const raw = item[planId];
  if (item.type === "bool") {
    return raw ? "Included" : "Not included";
  }
  return raw;
}

// Plan metadata: one entry per column in the comparison table.
// `id` is used as a stable key and to look up each feature's value per plan.
export const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$0",
    period: "forever",
    tagline: "Try Lattice with a small team.",
    cta: "Start for free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per user / month",
    tagline: "For growing teams that ship every week.",
    cta: "Start free trial",
    highlighted: true,
    badge: "Most popular",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$29",
    period: "per user / month",
    tagline: "Security and control for larger organizations.",
    cta: "Talk to sales",
    highlighted: false,
  },
];

// ✏️ Edit everything about the site here.

export const CONFIG = {
  name: "Dhruva",
  fullName: "Dhruva Jatla", // must match the name shown in the UPI app
  upiId: "dhruvajatla16@okicici",
  goal: 85000,

  // Update this as money comes in, then redeploy (git push).
  raisedSoFar: 0,

  paymentNote: "PS5 Pro contribution",

  // Level 1 — the pitch
  reasons: [
    {
      title: "Family game nights",
      text: "Cricket, racing and football games we can all play together whenever the family meets.",
    },
    {
      title: "One gift, every occasion",
      text: "Count this as my birthday and festival gifts in one. No more guessing what to buy me.",
    },
    {
      title: "Work first, play after",
      text: "Promise: studies and work come first. Gaming only after that's done.",
    },
    {
      title: "Built to last years",
      text: "One console that keeps giving for years — better than lots of small gifts.",
    },
  ],

  // Level 3 — contribution "power-ups"
  tiers: [
    { amount: 500, name: "Extra Life", perk: "A big thank-you hug" },
    { amount: 1000, name: "Power-Up", perk: "Invite to the first game night" },
    { amount: 2000, name: "Turbo Boost", perk: "Your own player profile on the console" },
    { amount: 5000, name: "Boss Mode", perk: "You pick the first game we play" },
    { amount: 10000, name: "Legendary", perk: "Lifetime VIP controller access" },
  ],
};

export function upiLink(amount) {
  let link =
    "upi://pay?pa=" + CONFIG.upiId +
    "&pn=" + encodeURIComponent(CONFIG.fullName) +
    "&cu=INR&tn=" + encodeURIComponent(CONFIG.paymentNote);
  if (amount > 0) link += "&am=" + amount;
  return link;
}

export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

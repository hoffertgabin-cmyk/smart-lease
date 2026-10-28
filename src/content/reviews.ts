// Real customer reviews only, copied with the customer's consent. Never invent one.
export type Review = { author: string; text: string; date: string; source: "Google" | "Facebook" | "Client direct" };

export const reviews: Review[] = [];

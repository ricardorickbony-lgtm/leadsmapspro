export const ANNUAL_PLAN_PRICE = 497;
export function calcRoi(ticket: number, clients: number) {
  const monthly = ticket * clients;
  const annual = monthly * 12;
  const multiple = Math.floor(annual / ANNUAL_PLAN_PRICE);
  return { monthly, annual, multiple };
}
export function isSupportOnline(now: Date = new Date()) {
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "numeric", hourCycle: "h23" }).format(now));
  return h >= 8 && h < 20;
}

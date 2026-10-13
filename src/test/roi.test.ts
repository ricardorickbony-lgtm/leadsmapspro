import { describe, it, expect } from "vitest";
import { calcRoi, isSupportOnline } from "@/lib/roi";
describe("roi", () => {
  it("default 2000 x 2 gives 96x", () => {
    expect(calcRoi(2000, 2)).toEqual({ monthly: 4000, annual: 48000, multiple: 96 });
  });
  it("support online 8h-20h Brasília", () => {
    expect(isSupportOnline(new Date("2026-10-13T11:00:00Z"))).toBe(true); // 8h
    expect(isSupportOnline(new Date("2026-10-13T23:00:00Z"))).toBe(false); // 20h
  });
});

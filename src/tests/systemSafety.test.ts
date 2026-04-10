import type { Battery } from "../utils/types";
import { systemSafetyTest } from "./systemSafety";

describe("system safety test", () => {
    it("passes when temperature is safe", () => {
        const battery = { temperature: 50, current: 95, voltage: 395 } as Battery;

        const result = systemSafetyTest(battery);
    
        expect(result.passed).toBe(true);
    });

    it("fails when temperature is too high", () => {
        const battery = { temperature: 60 } as Battery;

        const result = systemSafetyTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("exceeds the safe range of 55 C");
    });

    it("fails when current is too high", () => {
        const battery = { current: 96 } as Battery;

        const result = systemSafetyTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("exceeds the safe range of 95 A");
    });

    it("fails when voltage is too high", () => {
        const battery = { voltage: 396 } as Battery;

        const result = systemSafetyTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("exceeds the safe range of 395 V");
    });
});
import type { Battery } from "../utils/types";
import { systemSafetyTest } from "./systemSafety";

describe("system safety test", () => {
    it("passes when temperature is safe", () => {
        const battery = { temperature: 50 } as Battery;

        const result = systemSafetyTest(battery);
    
        expect(result.passed).toBe(true);
    });

    it("fails when temperature is too high", () => {
        const battery = { temperature: 60 } as Battery;

        const result = systemSafetyTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("exceeds");
    });
});
import type { Battery } from "../utils/types";
import { manufacturingIntegrityTest } from "./manufacturingIntegrity";

describe("manufacturingIntegrityTest", () => {

    const baseBattery: Battery = {
        mode: "idle",
        voltage: 350,
        current: 0,
        charge: 50,
        internalResistance: 25,
        temperature: 30,
        insulationResistance: 150,
        power: 0,
        hasSensorDrift: false,
        hasBadWeld: false,
        hasLeak: false,
    };

    it("passes when all manufacturing conditions are valid", () => {
        const battery = { ...baseBattery };

        const result = manufacturingIntegrityTest(battery);

        expect(result).toEqual({
            passed: true,
            step: "manufacturingIntegrity",
            reason: "pass",
        });
    });

    it("fails when insulation resistance is below threshold", () => {
        const battery = {
            ...baseBattery,
            insulationResistance: 80,
        };

        const result = manufacturingIntegrityTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("insulation resistance");
    });

    it("fails when a bad weld is detected", () => {
        const battery = {
            ...baseBattery,
            hasBadWeld: true,
        };

        const result = manufacturingIntegrityTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toBe("bad weld detected (contact resistance failure)");
    });

    it("fails when a leak is detected", () => {
        const battery = {
            ...baseBattery,
            hasLeak: true,
        };

        const result = manufacturingIntegrityTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toBe("leak detected in battery enclosure");
    });

    it("fails insulation resistance before other checks", () => {
        const battery = {
            ...baseBattery,
            insulationResistance: 50,
            hasBadWeld: true,
            hasLeak: true,
        };

        const result = manufacturingIntegrityTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("insulation resistance");
    });
});
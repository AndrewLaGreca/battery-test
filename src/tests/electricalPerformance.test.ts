import type { Battery } from "../utils/types";
import { electricalPerformanceTest } from "./electricalPerformance";

describe("electricalPerformanceTest", () => {

    const baseBattery: Battery = {
        mode: "idle",
        voltage: 350,
        current: 10,
        charge: 50,
        internalResistance: 20,
        temperature: 30,
        insulationResistance: 150,
        power: 3500,
        hasSensorDrift: false,
        hasBadWeld: false,
        hasLeak: false,
    };

    it("passes when power and internal resistance are within limits", () => {
        const battery = { ...baseBattery };

        const result = electricalPerformanceTest(battery);

        expect(result).toEqual({
            passed: true,
            step: "electricalPerformance",
            reason: "pass",
        });
    });

    it("fails when power is outside ±10% tolerance", () => {
        const battery = {
            ...baseBattery,
            power: 5000,
        };

        const result = electricalPerformanceTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("measured power");
        expect(result.reason).toContain("not within");
    });

    it("fails when internal resistance exceeds threshold", () => {
        const battery = {
            ...baseBattery,
            internalResistance: 30,
        };

        const result = electricalPerformanceTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("internal resistance");
        expect(result.reason).toContain("exceeds threshold");
    });

    it("fails power check before internal resistance when both are invalid", () => {
        const battery = {
            ...baseBattery,
            power: 9999,
            internalResistance: 30,
        };

        const result = electricalPerformanceTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("measured power");
    });

    it("passes exactly at tolerance boundary", () => {
        const powerExpected = baseBattery.voltage * baseBattery.current;
        const tolerance = 0.10 * Math.abs(powerExpected);

        const battery = {
            ...baseBattery,
            power: powerExpected + tolerance,
        };

        const result = electricalPerformanceTest(battery);

        expect(result.passed).toBe(true);
    });
});
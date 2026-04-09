
import { idleMode, type Battery } from "../utils/types";
import { gridSimulationTest } from "./gridSimulation";

describe("gridSimulationTest", () => {
    const baseBattery: Battery = {
        mode: idleMode,
        voltage: 400,
        current: 0,
        charge: 50,
        internalResistance: 20,
        temperature: 30,
        insulationResistance: 200,
        power: 0,
        hasSensorDrift: false,
        hasBadWeld: false,
        hasLeak: false,
    };

    it("passes a normal stable battery", () => {
        const battery = { ...baseBattery };

        const result = gridSimulationTest(battery);

        expect(result.passed).toBe(true);
    });

    it("fails on invalid initial voltage", () => {
        const battery = {
            ...baseBattery,
            voltage: 9999,
        };

        const result = gridSimulationTest(battery);

        expect(result.passed).toBe(false);
        expect(result.reason).toContain("invalid initial battery voltage");
    });
});
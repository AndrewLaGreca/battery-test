import { computePower, simulateTransition } from "../utils/simulateTransition";
import { idleMode, dischargeMode, chargeMode, type Battery, type ResultPackage } from "../utils/types";
import { validateFunction } from "./functional";

const battery = { 
    mode: idleMode,
    voltage: 350, // V
    current: 0, // A
    charge: 90, // %
    internalResistance: 25, // milli ohms
    temperature: 30, // C
    insulationResistance: 150, // mega ohms
    power: 0, // computed below
    hasSensorDrift: false,
    hasBadWeld: false,
    hasLeak: false,
};

const resultPackage: ResultPackage = {
    passed: true,
    step: "functional",
    reason: "pass",
};

describe("passing functional tests", () => {
    it("passes when transitioning to charging", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode
        b = simulateTransition(b, chargeMode);

        r = validateFunction(b, r);
        expect(r.passed).toBe(true);
    });

    it("passes when transitioning to idle", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode, then back to idles
        b = simulateTransition(b, chargeMode);
        b = simulateTransition(b, idleMode);

        r = validateFunction(b, r);
        expect(r.passed).toBe(true);
    });

    it("passes when transitioning to discharging", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode, then back to idles
        b = simulateTransition(b, dischargeMode);

        r = validateFunction(b, r);
        expect(r.passed).toBe(true);
    });
});

describe("fails functional tests", () => {
    it("fails due to power mismatch", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode
        b.hasSensorDrift = true;
        b = simulateTransition(b, chargeMode);

        r = validateFunction(b, r);

        expect(r.passed).toBe(false);
        expect(r.step).toBe("functional");
        expect(r.reason).toBe("power mismatch (P ≠ V * I)");
    });

    // The simulation does not include simulated transtion failures, but I want to test the logic regardless
    it("fails when transitioning to charging", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode
        b = simulateTransition(b, chargeMode);
        b.current = -1;
        b.power = computePower(b); // TODO: the simulation should do this itself, but because simulated transitions failures do not exist in this fidelity model, it's acceptable for now.

        r = validateFunction(b, r);
        expect(r.passed).toBe(false);
        expect(r.step).toBe("functional");
        expect(r.reason).toBe("invalid current in charge mode");
    });

    it("fails when transitioning to idle", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode
        b = simulateTransition(b, chargeMode);
        b = simulateTransition(b, idleMode); 
        b.current = -6;
        b.power = computePower(b); // TODO: the simulation should do this itself, but because simulated transitions failures do not exist in this fidelity model, it's acceptable for now.

        r = validateFunction(b, r);

        expect(r.passed).toBe(false);
        expect(r.step).toBe("functional");
        expect(r.reason).toBe("invalid current in idle mode");
    });

    it("fails when transitioning to discharging", () => {
        let b: Battery = { ...battery } 
        let r: ResultPackage = { ...resultPackage }

        // simulate change to charge mode
        b = simulateTransition(b, dischargeMode);
        b.current = 1;
        b.power = computePower(b); // TODO: the simulation should do this itself, but because simulated transitions failures do not exist in this fidelity model, it's acceptable for now. 

        r = validateFunction(b, r);

        expect(r.passed).toBe(false);
        expect(r.step).toBe("functional");
        expect(r.reason).toBe("invalid current in discharge mode");
    });
});
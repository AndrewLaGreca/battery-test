import type { Battery, ResultPackage } from "../utils/types";
import { simulateTransition } from "../utils/simulateTransition";
import { fail } from "../utils/fail";

export function functionalTest(battery: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "functional",
        reason: "pass",
    };

    // idle to charge
    battery = simulateTransition(battery, "charge");
    resultPackage = validateFunction(battery, resultPackage);
    if (!resultPackage.passed) return resultPackage;

    // charge to idle
    battery = simulateTransition(battery, "idle");
    resultPackage = validateFunction(battery, resultPackage);
    if (!resultPackage.passed) return resultPackage;

    // idle to discharge
    battery = simulateTransition(battery, "discharge");
    resultPackage = validateFunction(battery, resultPackage);
    if (!resultPackage.passed) return resultPackage;

    // discharge to idle
    battery = simulateTransition(battery, "idle");
    resultPackage = validateFunction(battery, resultPackage);
    if (!resultPackage.passed) return resultPackage;

    return resultPackage;
}

function validateFunction (b: Battery, r: ResultPackage): ResultPackage {
    if (b.mode === "idle" && (b.current < -5 || b.current > 5)) {
        return fail(r, "invalid current at idle");
    }

    if (b.mode === "charge" && b.current > 0) {
        return fail(r, "invalid current in charge mode");
    }

    if (b.mode === "discharge" && b.current < 0) {
        return fail(r, "invalid current in discharge mode");
    }

    const expectedPower = (b.voltage * b.current) / 1000;
    const tolerance = 0.1;

    if (Math.abs(b.power - expectedPower) / Math.abs(expectedPower || 1) > tolerance) {
        return fail(r, "power mismatch (P ≠ V * I)");
    }

    return r;
}
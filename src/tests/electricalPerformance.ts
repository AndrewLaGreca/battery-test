import { fail } from "../utils/fail";
import type { Battery, ResultPackage } from "../utils/types";

export function electricalPerformanceTest(b: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "electricalPerformance",
        reason: "pass",
    };

    // 1. test power for sensor drift
    const powerExpected = (b.voltage * b.current);

    const error = Math.abs(powerExpected - b.power);
    const tolerance = 0.10 * Math.abs(powerExpected)

    if (error > tolerance) {
        return fail(resultPackage, `measured power ${b.power} W is not within +/- 10% of expected ${powerExpected} W`);
    }

    // 2. test internal resistance
    if(b.internalResistance > 25) 
    return resultPackage = fail(resultPackage, `measured internal resistance ${b.internalResistance} milli Ohms exceeds threshold of 25 milli Ohms`);

    return resultPackage;
}
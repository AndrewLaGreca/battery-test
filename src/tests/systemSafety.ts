import { fail } from "../utils/fail";
import type { Battery, ResultPackage } from "../utils/types";

export function systemSafetyTest(b: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "systemSafety",
        reason: "pass",
    };

    // 1. test temperature
    if (b.temperature > 55)
    return resultPackage = fail(resultPackage, `measured temperature ${b.temperature} C exceeds the safe range of 55 C`);

    // 2. test overcurrent
    if (b.current > 95)
    return resultPackage = fail(resultPackage, `measured current ${b.current} A exceeds the safe range of 95 A`);

    // 3. test overvoltage
    if (b.voltage > 395)
    return resultPackage = fail(resultPackage, `measured voltage ${b.voltage} A exceeds the safe range of 395 V`);
    
    return resultPackage;
}
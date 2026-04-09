import { fail } from "../utils/fail";
import type { Battery, ResultPackage } from "../utils/types";

export function manufacturingIntegrityTest(b: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "manufacturingIntegrity",
        reason: "pass",
    };

    // 1. Insulation resistance (electrical isolation)
    if (b.insulationResistance < 100) {
        return resultPackage = fail(
            resultPackage,
            `insulation resistance ${b.insulationResistance} mega ohms is below threshold of 100 mega Ohms`
        );
    }

    // 2. Contact resistance (weld quality)
    if (b.hasBadWeld) {
        return resultPackage = fail(resultPackage, "bad weld detected (contact resistance failure)");
    }

    // 3. Leak detection
    if (b.hasLeak) {
        return resultPackage = fail(resultPackage, "leak detected in battery enclosure");
    }

    return resultPackage;
}
import { getCurrent } from "../simulation/generateBattery";
import type { Battery, mode } from "./types";

export function simulateTransition(battery: Battery, targetMode: mode): Battery {
    const b = { ...battery };

    b.mode = targetMode;
    b.current = getCurrent(targetMode);

    // Recompute power
    b.power = computePower(b);

    return b;
}

export function computePower(battery: Battery): number {
    let power = battery.voltage * battery.current;

    if (battery.hasSensorDrift) {
        power *= 1.15;
    }

    return power;
}
import { getCurrent } from "../simulation/generateBattery";
import type { Battery, mode } from "./types";

export function simulateTransition(battery: Battery, targetMode: mode): Battery {
    const b = { ...battery };

    b.mode = targetMode;

    let newCurrent = getCurrent(targetMode);

    // Degradation effects
    if (battery.temperature > 55) {
        newCurrent *= 0.5; // thermal limiting
    }

    if (battery.internalResistance > 40) {
        newCurrent *= 0.7; // poor conduction
    }

    b.current = newCurrent;

    // Recompute power
    if (!battery.hasSensorDrift) {
        b.power = (b.voltage * b.current) / 1000;
    }

    return b;
}
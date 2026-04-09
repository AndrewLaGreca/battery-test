import { getCurrent } from "../simulation/generateBattery";
import type { Battery, mode } from "./types";

export function simulateTransition(battery: Battery, targetMode: mode): Battery {
    const b = { ...battery };

    b.mode = targetMode;
    b.current = getCurrent(targetMode);

    // Recompute power
    b.power = computerPower(b);

    return b;
}

export function computerPower(battery: Battery): number {
    battery.power = (battery.voltage * battery.current);
    if (battery.hasSensorDrift) {
        battery.power *= 1.15;
    }

    return battery.power;
}
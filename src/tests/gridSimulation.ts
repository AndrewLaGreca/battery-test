import type { Battery, ResultPackage } from "../utils/types";
import { fail } from "../utils/fail";
import { getCurrent } from "../simulation/generateBattery";
import { computerPower } from "../utils/simulateTransition";

interface GridEvent {
    voltageFactor: number;
    frequencyHz: number;
}

export function gridSimulationTest(battery: Battery): ResultPackage {
    let resultPackage: ResultPackage = {
        passed: true,
        step: "gridSimulation",
        reason: "pass",
    };

    // Baseline grid conditions
    const nominalVoltage = 400;

    // Sequence of disturbances
    const events: GridEvent[] = [
        { voltageFactor: 1.0, frequencyHz: 60 },
        { voltageFactor: 0.9, frequencyHz: 59 },
        { voltageFactor: 1.1, frequencyHz: 61 },
        { voltageFactor: 0.85, frequencyHz: 58 },
        { voltageFactor: 1.0, frequencyHz: 60 },
    ];

    let previousMode = battery.mode;

    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        // Simulate grid disturbance
        const gridVoltage = nominalVoltage * event.voltageFactor;

        simulateBatteryResponse(battery, gridVoltage, event.frequencyHz);

        // Tests
        // 1. Voltage stability
        if (battery.voltage <= 0 || battery.voltage > 1000) {
            return resultPackage = fail(resultPackage, `invalid battery voltage during grid event ${i}`);
        }

        // 2. Mode consistency
        if (!["idle", "charge", "discharge"].includes(battery.mode)) {
            return resultPackage = fail(resultPackage, `invalid battery mode during grid event ${i}`);
        }

        // 3. Transition stability
        if (previousMode !== battery.mode) {
            const validTransition =
                (previousMode === "idle" && (battery.mode === "charge" || battery.mode === "discharge")) ||
                (battery.mode === "idle");

            if (!validTransition) {
                return resultPackage = fail(resultPackage, `invalid mode transition from ${previousMode} to ${battery.mode}`);
            }
        }

        // 4. Frequency response sanity
        if (Math.abs(event.frequencyHz - 60) > 2) {
            // Expect protective or conservative behavior
            if (battery.mode === "discharge" && battery.current > 0) {
                return resultPackage = fail(resultPackage, `unsafe discharge during frequency disturbance at event ${i}`);
            }
        }

        // 5. Power consistency
        const expectedPower = (battery.voltage * battery.current);

        if (Math.abs(expectedPower - battery.power) > 0.1 * Math.abs(expectedPower)) {
            return resultPackage = fail(resultPackage, `power mismatch during grid event ${i}`);
        }

        previousMode = battery.mode;
    }

    return resultPackage;
}

// Simulates how the battery reacts to grid conditions
function simulateBatteryResponse(
    battery: Battery,
    gridVoltage: number,
    frequencyHz: number
): void {
    // Simple control logic

    // Voltage-based behavior
    if (gridVoltage > 410) {
        battery.mode = "charge";
        battery.current = getCurrent(battery.mode);
    } else if (gridVoltage < 380) {
        battery.mode = "discharge";
        battery.current = getCurrent(battery.mode);
    } else {
        battery.mode = "idle";
        battery.current = getCurrent(battery.mode);;
    }

    if (frequencyHz < 59) {
        // Conservative behavior under instability
        battery.mode = "idle";
        battery.current = getCurrent(battery.mode);;
    }

    battery.voltage = gridVoltage;
    battery.power = computerPower(battery);
}
import readline from "readline";
import { runPipeline } from "./pipeline/pipeline";
import { generateBattery } from "./simulation/generateBattery";

console.log("Main file executing");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt() {
    rl.question("Enter command (`b` to begin | `e` to exit): ", async (input) => {
        if (input == "b") {
            try {
                const b = generateBattery();
                await runPipeline(b);
            } catch (err) {
                console.error("Pipeline failed:", err);
            }
            prompt();
        } else if (input == "e") {
            rl.close();
        } else {
            console.log("Unknown command");
            prompt();
        }
    });
}

prompt();
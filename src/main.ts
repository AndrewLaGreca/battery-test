import readline from "readline";
import { runPipeline } from "./pipeline/pipeline";

console.log("Main file executing");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function prompt() {
    rl.question("Enter command (`b` to begin | `e` to exit): ", async (input) => {
        if (input == "b") {
            try {
                await runPipeline();
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
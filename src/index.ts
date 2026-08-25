import { setUser, readConfig }  from "./config.js";
import {CommandsRegistry, CommandHandler, handlerLogin, registerCommand, runCommand} from "./commandhandler.js"

function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Expected command");
    process.exit(1);
  }

  const cmdName = args[0];

  const cmdArgs = args.slice(1);

  try {
    runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
        console.error(`An error occurred: ${err.message}`);
        process.exit(1);
    }
  }
}

main();
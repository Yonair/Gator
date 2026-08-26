import { setUser, readConfig }  from "./config.js";
import {CommandsRegistry, CommandHandler, handlerLogin, handlerRegister, handlerUsers, registerCommand, runCommand} from "./commands/commands.js";
import {handlerReset} from "./commands/reset.js";
import {handlerAgg} from "./commands/aggregate.js";


async function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Expected command");
    process.exit(1);
  }

  const cmdName = args[0];

  const cmdArgs = args.slice(1);

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
        console.error(`An error occurred: ${err.message}`);
        process.exit(1);
    }
  }
  process.exit(0)
}

main();
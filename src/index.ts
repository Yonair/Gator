import { setUser, readConfig }  from "./config.js";
import {CommandsRegistry, CommandHandler, handlerLogin, handlerRegister, handlerUsers, registerCommand, runCommand} from "./commands/commands.js";
import {handlerReset} from "./commands/reset.js";
import {handlerAgg} from "./commands/aggregate.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/feed-follows.js";
import { middlewareLoggedIn } from "./middleware.js";


async function main() {
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", handlerFeeds);
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));

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
import { User } from "./lib/db/schema.js";
import { CommandHandler, UserCommandHandler } from "./commands/commands.js";
import { getUser } from "./lib/db/queries/users.js";
import { readConfig } from "./config.js";


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        const currentUser = config.currentUserName;
        if (!currentUser) {
            throw new Error("User not logged in");
        }
        const user = await getUser(currentUser);
        if (!user) {
            throw new Error("User not found");
        }
        await handler(cmdName, user, ...args);
    };
}
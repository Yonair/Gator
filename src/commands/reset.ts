import { resetUsers } from "../lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]) {
    await resetUsers();
    console.log("User database reset successfully")
}


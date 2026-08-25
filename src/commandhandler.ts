import {setUser} from "./config"

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Error: Expected username")
    };
    setUser(args[0]);
    console.log("User has been set")
}

export type CommandsRegistry = {
    [cmdName: string]: CommandHandler;
};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (registry[cmdName]) {
        registry[cmdName](cmdName, ...args);
    } else {
        throw new Error("Command not found");
    }
};
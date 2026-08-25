import {setUser, readConfig} from "../config"
import { createUser, getUser, getUsers } from "../lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Expected username")
    };
    const checkUser = await getUser(args[0]);
    if(!checkUser) {
        throw new Error("User does not exist")
    } else{
        setUser(args[0]);
        console.log("User has been set");
    }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Expected username")
    };
    const checkUser = await getUser(args[0]);
    if(checkUser) {
        throw new Error("User already exists")
    } else {
        const newUser = await createUser(args[0])
        setUser(args[0]); 
        console.log("New user created successfully");
        console.log(newUser);
    };
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const config = readConfig();
    const currentUser = config.currentUserName
    const fullList = await getUsers()
    for(const user of fullList) {
        if(user.name === currentUser) {
            console.log(`* ${user.name} (current)`)
        } else {
            console.log(`* ${user.name}`)
        };
    };
}

export type CommandsRegistry = {
    [cmdName: string]: CommandHandler;
};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (registry[cmdName]) {
        await registry[cmdName](cmdName, ...args);
    } else {
        throw new Error("Command not found");
    }
};
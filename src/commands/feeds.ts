import { readConfig } from "../config";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUser, getUserById } from "../lib/db/queries/users";
import { Feed, feeds, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("Expected name and url")
    };
    const config = readConfig();
    const username = config.currentUserName;
    if (typeof username !== "string") {
        throw new Error("Expected username");
    }
    const user = await getUser(username);
     if (!user) {
        throw new Error("Expected username");
    }
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        throw new Error("Expected feed");
    };
    printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds()
    for (const feed of feeds) {
        const user = await getUserById(feed.userId)
        if (!user) {
            throw new Error(`User not found for feed: ${feed.id}`)
        }
        printFeed(feed, user)
    }
}

export function printFeed(feed: Feed, user: User) {
    console.log(`ID: ${feed.id}`);
    console.log(`Created at: ${feed.createdAt}`)
    console.log(`Updated at: ${feed.updatedAt}`)
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`User: ${user.name}`)
}

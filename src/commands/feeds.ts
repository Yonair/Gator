import { readConfig } from "../config.js";
import { createFeedFollow } from "../lib/db/queries/feed-follows.js";
import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUser, getUserById } from "../lib/db/queries/users.js";
import { Feed, feeds, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("Expected name and url")
    };
    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    if (!feed) {
        throw new Error("Expected feed");
    };
    const follow = await createFeedFollow(user.id, feed.id);
    if (!follow) {
        throw new Error("Expected follow");
    };
    console.log(` ${follow.feed.name} (${follow.user.name}) has been added and followed successfully`);
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

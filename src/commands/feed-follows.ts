import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows.js";
import { getFeedByUrl } from "../lib/db/queries/feeds.js";
import { getUser } from "../lib/db/queries/users.js";
import { readConfig } from "../config.js";
import { User } from "../lib/db/schema.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Expected URL of feed to follow");
    }
    const feed = await getFeedByUrl(args[0]);
    if (!feed) {
        throw new Error("Feed not found");
    }
    const createFeed = await createFeedFollow(user.id, feed.id);
    console.log(`Feed followed successfully: ${createFeed.feed.name} (${createFeed.user.name})`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const follows = await getFeedFollowsForUser(user.id);
    follows.forEach((follow) => {
        console.log(`Feed: ${follow.feed.name}`);
    });
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Expected URL of feed to unfollow");
    }
    const feed = await getFeedByUrl(args[0]);
    if (!feed) {
        throw new Error("Feed not found");
    }
    const result = await deleteFeedFollow(user.id, feed.id);
    if (result.length === 0) {
        throw new Error("Failed to unfollow feed");
    }
    console.log(`Feed unfollowed successfully: ${feed.name}`);
}

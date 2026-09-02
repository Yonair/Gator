import { feedFollows, feeds, users } from "../schema.js";
import { db } from "..";
import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

    const result = await db
    .select({ feedFollow: feedFollows, feed: feeds, user: users })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

    if (result.length === 0) {
        throw new Error("Failed to create feed follow");
    }
    return result[0];
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db
        .select({ feedFollow: feedFollows, feed: feeds, user: users })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
    return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
    const result = await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, userId),
                eq(feedFollows.feedId, feedId),
            )
        )
        .returning();
    return result;
}
import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
    headers: {
        "User-Agent": "gator",
    },
    });
    
    const xml = await response.text();

    const parser = new XMLParser({ processEntities: false });

    const parsed = parser.parse(xml);

    if (!parsed.rss?.channel) {
        throw new Error("Expected channel");
        
    }
    
    const channel = parsed.rss.channel;
    const { title, link, description } = channel;

    if (typeof title !== "string" ||
        typeof link !== "string" ||
        typeof description !== "string"
    ) {
        throw new Error("Metadata missing");
    }
    
    let rawItems: any[] = [];
    const items: RSSItem[] = [];
    if (!channel.item) {
        rawItems = [];
    } else if (Array.isArray(channel.item)) {
        rawItems = channel.item;
    } else {
        rawItems = [channel.item];
    };

    for (const rawItem of rawItems) {
        const { title, link, description, pubDate } = rawItem;
    if (typeof title !== "string" ||
        typeof link !== "string" ||
        typeof description !== "string" ||
        typeof pubDate !== "string") {
            continue;
        };
        items.push({
        title,
        link,
        description,
        pubDate,
    });
    }
    return {
        channel: {
            title,
            link,
            description,
            item: items,
        },
    };
}
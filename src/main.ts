import Twitter from "twitter";
import { Tweet, bulk } from "./gulp";

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY || "",
    consumer_secret: process.env.TWITTER_API_SECRET_KEY || "",
    access_token_key: process.env.TWITTER_ACCESS_TOKEN || "",
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ""
});


interface SearchedTweets {
    statuses: Tweet[];

    search_metadata: {
        completed_in: number,
        max_id: number,
        max_id_str: string,
        next_results: string,
        query: string,
        refresh_url: string,
        count: number,
        since_id: number,
        since_id_str: string
    }
}

const parameters: Readonly<Record<string, string | number | boolean>> = Object.freeze({
    q: encodeURIComponent("#Popcorn"),
    lang: "fr",
    locale: "fr",
    count: 100,
    include_entities: true,
    result_type: "mixed",
    tweet_mode: "extended"
});

const onTweetSearch = (error: any, tweets: any) => {
    if (error) {
        console.log(error);
        console.log("Unable to fetch all tweets from the #popcorn hashtag.");
        return;
    }

    // BASE CASE
    if (tweets.statuses.length === 0) {
        console.log("NO MORE STATUSES TO ANALYZE");
        return;
    }

    console.log("FILTERING ONLY THE FULL_TEXT OF THE RECEIVED TWEETS...");
    const receivedTweets: string[] = tweets.statuses.map(({full_text}: Tweet): string => full_text).filter((full_text: string): boolean => !full_text.startsWith("RT"));
    console.log(receivedTweets);

    const max_id: string | null = new URLSearchParams(tweets.search_metadata.next_results).get("max_id");

    // SECOND BASE CASE
    if (max_id === null) {
        console.log("NO MORE MAX_ID FOR THE NEXT REQUEST");
        return;
    }

    const nextParams = {...parameters, max_id};
    console.log("NEXT REQUEST INCOMMING...");
    twitter.get("search/tweets", nextParams, onTweetSearch);
};

// @ts-ignore
//twitter.get("search/tweets", PARAMS, onTweetSearch);

const searchTweets = (parameters: Readonly<Record<string, string | number | boolean>>): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        twitter.get("search/tweets", parameters, async (error, tweets) => {
            if (error) {
                resolve([]);
                return;
            }

            if (tweets.statuses.length === 0) {
                resolve([]);
                return;
            }
            
            const texts = tweets.statuses.map(({full_text}: {full_text: string}) => full_text);

            resolve(texts);
        });
    });
};

const main = async () => {
    const searchedTweets = await searchTweets(parameters);

    console.log(searchedTweets);
};

main();

import Twitter from "twitter";

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_KEY || "",
    consumer_secret: process.env.TWITTER_KEY_SECRET || "",
    access_token_key: process.env.TWITTER_TOKEN || "",
    access_token_secret: process.env.TWITTER_TOKEN_SECRET || ""
});

const parameters: Readonly<Record<string, string | number | boolean>> = Object.freeze({
    q: encodeURIComponent("#Popcorn"),
    lang: "fr",
    locale: "fr",
    count: 100,
    include_entities: true,
    result_type: "mixed",
    tweet_mode: "extended"
});

const searchTweets = (parameters: Readonly<Record<string, string | number | boolean>>): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        twitter.get("search/tweets", parameters, async (error, response) => {
            if (error) {
                console.error(error);
                resolve([]);
                return;
            }

            if (response.statuses.length === 0) {
                console.log("Empty search.");
                resolve([]);
                return;
            }

            const tweets: string[] = response.statuses.map(({full_text}: {full_text: string}): string => full_text);
            const max_id: string | null = new URLSearchParams(response.search_metadata.next_results).get("max_id");

            if (max_id === null) {
                console.log("No more tweets available");
                resolve([]);
                return;
            }

            console.log("Searching for the next tweets...");
            const nextTweets = await searchTweets({...parameters, max_id});
            resolve([...tweets, ...nextTweets]);
        });
    });
};

(async () => {
    const searchedTweets = await searchTweets(parameters);

    // ALL TWEEEEEEEEEEEEEEEEEEEEEEEEETS
    console.log(searchedTweets);
})();

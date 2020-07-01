import Twitter from "twitter";
import {Client} from "elasticsearch";

export interface Tweet {
    created_at: string;
    full_text: string;
    retweet_count: number;
    favorite_count: number;
    lang: string;
}


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

const searchTweets = (parameters: Readonly<Record<string, string | number | boolean>>): Promise<Tweet[]> => {
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

            console.log("Filtering out retweets...");
            const tweets: Tweet[] = response.statuses.filter(({full_text}: Tweet): boolean => !full_text.startsWith("RT"));

            const max_id: string | null = new URLSearchParams(response.search_metadata.next_results).get("max_id");

            if (max_id === null) {
                console.log(`[${new Date()}] No more tweets available`);
                resolve([]);
                return;
            }

            console.log(`[${new Date()}] Searching for the next tweets...`);
            const nextTweets = await searchTweets({...parameters, max_id});
            resolve([...tweets, ...nextTweets]);
        });
    });
};

(async () => {
    console.log("Searching for tweets to ingest...");
    const searchedTweets: Tweet[] = await searchTweets(parameters);

    console.log("Create a new connection to the Elasticsearch server...");
    const client = new Client({
        hosts: [
            "http://elasticsearch:9200"
        ]
    });

    const bulk = async (data: Tweet[]) => {
        console.log("Creating an index for the tweets");

        console.log("Deleting index Tweet...");
        await client.indices.delete({
            index: "tweets",
            ignoreUnavailable: true
        });

        console.log("Creating the index for Tweet...");
        await client.indices.create({
            index: "tweets",
            body: {
                "settings": {
                    "analysis": {
                        "filter": {
                            "french_elision": {
                                "type":         "elision",
                                "articles_case": true,
                                "articles": [
                                    "l", "m", "t", "qu", "n", "s",
                                    "j", "d", "c", "jusqu", "quoiqu",
                                    "lorsqu", "puisqu"
                                ]
                            },
                            "french_stop": {
                                "type":       "stop",
                                "stopwords":  "_french_" 
                            },
                            "french_keywords": {
                                "type":       "keyword_marker",
                                "keywords":   ["Example"] 
                            },
                            "french_stemmer": {
                                "type":       "stemmer",
                                "language":   "light_french"
                            }
                        },
                        "analyzer": {
                            "rebuilt_french": {
                                "tokenizer":  "standard",
                                "filter": [
                                    "french_elision",
                                    "lowercase",
                                    "french_stop",
                                    "french_keywords",
                                    "french_stemmer"
                                ]
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        created_at: {
                            type: "text",
                            analyzer: "stop",
                            search_analyzer: "stop"
                        },
                        full_text: {
                            type: "text",
                            analyzer: "french",
                            search_analyzer: "french"
                        },
                        retweet_count: {
                            type: "integer"
                        },
                        favorite_count: {
                            type: "integer"
                        },
                        lang: {
                            type: "text",
                            analyzer: "stop",
                            search_analyzer: "stop"
                        }
                    }
                }
            }
        });

        console.log("Formatting the tweets...");
        const body = data.flatMap(doc => [{ index: { _index: "tweets" } }, doc])

        console.log("Ingesting the data...");
        await client.bulk({
            refresh: true,
            body
        });

        const {count} = await client.count({index: "tweets"})
        console.log(`Documents added: ${count}`);
    };

    console.log("Bulk inserting the data...");
    bulk(searchedTweets);
})();

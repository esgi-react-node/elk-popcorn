import Twitter from "twitter";

const twitter = new Twitter({
    consumer_key: "QX1uK8WIDChlv0BgYcEyMaufM",
    consumer_secret: "men8hQhJspDQIkQ4jXyiCDh6UlRxUdR5e516K3I51QVyi726Ih",
    access_token_key: "569315807-CmJSTENBb6dwcmD3LwXnooYj0l4QMwVvRzexLz3u",
    access_token_secret: "j8QlPRoyDKfHw28FZZk0GhScHhIlunz0raEclLryneW6e"
});

const PARAMS = Object.freeze({
    q: encodeURIComponent("#Popcorn"),
    lang: "fr",
    locale: "fr",
    count: 100,
    include_entities: false,
    result_type: "mixed",
    until: "2020-06-23",
    tweet_mode: "extended"
});

interface Tweet {
    full_text: string;
}

interface SearchedTweets {
    statuses: Tweet[];
}

const onTweetSearch = (error: Error, tweets: SearchedTweets): void => {
    if (error) {
        console.log("Unable to fetch all tweets from the #popcorn hashtag.");
        return;
    }

    console.log(tweets.statuses.map(({full_text}: Tweet) => full_text));
};

// @ts-ignore
twitter.get("search/tweets", PARAMS, onTweetSearch);

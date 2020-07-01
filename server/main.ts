// Web server for Node.js
import express, {Request, Response} from "express";

// Cross-origin handling library
import cors from "cors";

// Client for Elasticsearch
import {Client} from "elasticsearch";

// Host that will be exposed by our web server
const HOST = "0.0.0.0";

// Port that will be exposed by our web server
const PORT = 8081;

// Creating our web server handler
const application = express();

// Creating our Elasticsearch client
const elasticsearchClient = new Client({
    hosts: [
        "http://elasticsearch:9200/"
    ]
});

// Listening for all hosts (disabling CORS basically)
application.use(cors({
    origin: "*"
}));

// Endpoint for turning tweets into analyzed AnyChart data
application.get("/analyze", async (request: Request, response: Response) => {
    try {
        // Searching for all of our tweets
        const searchResponse: any = await elasticsearchClient.search({
            index: "tweets",
            size: 500
        });

        // Reducing all of our tweets into a single text
        const text: string = searchResponse.hits.hits.reduce((fullString: string, tweet: any) => {
            return `${fullString} ${tweet._source.full_text}`;
        }, "");

        // Tokenizing all of our tweets with the french analyzer
        const analyzerResponse = await elasticsearchClient.indices.analyze({
            index: "tweets",
            body: {
                analyzer: "french",
                text
            }
        });

        // Occurrences hashmap
        const occurrences = Object.create(null);

        // Looping through all of our tokens
        for (const {token} of analyzerResponse.tokens) {
            if (occurrences[token]) {
                occurrences[token]++;
            } else {
                occurrences[token] = 1;
            }
        }

        // From hashmap to two-dimension array
        const entries: [string, number][] = Object.entries(occurrences);

        // Sorted occurrences (from highest to lowest)
        const sorted: [string, number][] = entries.sort(([, first]: [string, number], [, second]: [string, number]): number => second - first).slice(0, 100);

        // Formatted data for using with AnyChart
        const data = sorted.map(([x, value]) => ({x, value}));

        // HTTP JSON response sent to the client
        response.json({ success: true, data: data });
    } catch (error) {
        // HTTP JSON error response sent to the clent when something went wrong
        response.status(500).json({ success: false, error: error.message });
    }
});

// Starting the web server and listening for incomming requests
application.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
});

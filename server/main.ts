import express, {Request, Response} from "express";
import cors from "cors";
import {Client} from "elasticsearch";


const HOST = "0.0.0.0";
const PORT = 8081;

const application = express();

const elasticsearchClient = new Client({
    hosts: [
        "http://elasticsearch:9200/"
    ]
});

application.use(cors({
    origin: "*"
}));

application.get("/search", async (request: Request, response: Response) => {
    try {
        const searchResponse: any = await elasticsearchClient.search({
            index: "tweets",
            size: 500
        });

        const tweetsFullString: string = searchResponse.hits.hits.reduce((fullString: string, tweet: any) => {
            return `${fullString} ${tweet._source.full_text}`;
        }, "");

        const analyzerResponse = await elasticsearchClient.indices.analyze({
            index: "tweets",
            body: {
                analyzer: "french",
                text: tweetsFullString
            }
        })

        response.json({
            success: true,
            data: analyzerResponse
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            error: error.message
        });
    }
});

application.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
});

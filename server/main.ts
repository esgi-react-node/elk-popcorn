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

application.use(cors());

application.get("/search", async (request: Request, response: Response) => {
    try {
        const searchResponse = await elasticsearchClient.search({
            index: "tweets"
        });

        response.json(searchResponse);
    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

application.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
});

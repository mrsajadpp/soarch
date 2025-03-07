const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const WebData = require("../models/web_data");
const scrapeData = require("../scripts/scrape_data");
const Fuse = require("fuse.js");

function findRelatedItems(query, data) {
    const options = {
        keys: ["title", "description", "url"],
        includeScore: true,
        threshold: 0.4,
    };

    const fuse = new Fuse(data, options);
    const results = fuse.search(query);

    return results;
}

router.get("/status", (req, res)=> {
    const startTime = process.hrtime();
    try {
        const response = {
            message: "API service operational",
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);

        res.json(response);
    } catch (error) {
        console.error(error);

        const response = {
            message: "API service down",
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);
        res.status(500).json(response)
    }
});

router.post("/crawl", (req, res)=> {
    const startTime = process.hrtime();
    try {
        const response = {
            message: "URL indexed",
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };
        const { url } = req.body;
        if(!url) {
            response.message = "URL is required";
            return res.status(400).json(response);
        }

        scrapeData(url);

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);

        res.json(response);
    } catch (error) {
        console.error(error);

        const response = {
            message: "API service down",
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);
        res.status(500).json(response)
    }
});

router.post("/search", async (req, res)=> {
    const startTime = process.hrtime();
    try {
        const response = {
            message: "Search result found successfull",
            result: null,
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };
        const { query } = req.body;
        if(!query) {
            response.message = "Query is required";
            return res.status(400).json(response);
        }

        let webDatas = await WebData.find().sort({ timestamp: -1 }).lean();

        let searchResult = await findRelatedItems(query, webDatas);

        response.result = searchResult;

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);

        res.json(response);
    } catch (error) {
        console.error(error);

        const response = {
            message: "API service down",
            server: {
                latency_ms: 0.0,
                timestamp: new Date().toISOString(),
                uptime: true
            },
            status: "success"
        };

        const endTime = process.hrtime(startTime);
        response.server.latency_ms = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);
        res.status(500).json(response)
    }
});

module.exports = router;
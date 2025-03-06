const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const WebData = require("../models/web_data");
const Fuse = require("fuse.js");

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

module.exports = router;
const WebData = require("../models/web_data");
const axios = require("axios");
const cheerio = require("cheerio");

async function getValidUniqueLinks(links, urlData) {
    const filteredLinks = [...new Set(
        links.filter(link => link && link.startsWith("/"))
    )].map(link => `https://${urlData.hostname}${link}`);

    const validLinks = await Promise.all(
        filteredLinks.map(async (link) => {
            try {
                const response = await axios.get(link);
                if (response.status === 200) return link;
            } catch (error) {
                return null;
            }
        })
    );

    return [...new Set(validLinks.filter(link => link !== null))];
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrapeData = async (link) => {
    try {
        if (!link) throw new Error("URL is required");

        let isExist = await WebData.findOne({ url: link }).lean();
        if (isExist) return "URL already exists";

        await delay(2000); // Wait 2 seconds before making a request

        let response;
        try {
            response = await axios.get(link);
        } catch (error) {
            console.error(`Failed to fetch ${link}: ${error.message}`);
            return;
        }

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const links = $("a").map((_, el) => $(el).attr("href")).get();
            let urlData = new URL(link);
            const originLink = await getValidUniqueLinks(links, urlData);

            let webData = {
                title: $("title").text() || $('h1').first().text() || $('h2').first().text() || $('h3').first().text(),
                description: $('meta[name="description"]').attr('content') || $('p').first().text() || $('span').first().text(),
                origin: urlData.hostname,
                url: link,
                internal_links: originLink
            };

            await WebData.create(webData);
            console.log(`Scraped: ${link}`);

            for (const internalLink of originLink) {
                let internalExist = await WebData.findOne({ url: internalLink }).lean();
                if (!internalExist) {
                    console.log(`Scraping: ${internalLink}`);
                    await scrapeData(internalLink); // Recursive call with delay
                }
            }
        }
    } catch (error) {
        console.error(`Error scraping ${link}: ${error.message}`);
    }
};

// Start Scraping
// scrapeData("https://www.google.com/search?q=github&sca_esv=cad4d383f6dfd877&sxsrf=AHTn8zq3Bq6IGy7QaYFZUaJjzYCvoiU-5Q%3A1741246804171&ei=VFHJZ_WKCsrDjuMP1f_igAI&ved=0ahUKEwj1hOrp-fSLAxXKoWMGHdW_GCAQ4dUDCBE&uact=5&oq=github&gs_lp=Egxnd3Mtd2l6LXNlcnAiBmdpdGh1YjIEECMYJzIEECMYJzIKECMYgAQYJxiKBTIKEAAYgAQYQxiKBTIREC4YgAQYsQMY0QMYgwEYxwEyCxAAGIAEGJECGIoFMgsQABiABBixAxiDATIKEAAYgAQYQxiKBTIKEAAYgAQYQxiKBTILEAAYgAQYsQMYgwFI5QpQmANY3ghwAXgBkAEAmAGoAaABgwOqAQMwLjO4AQPIAQD4AQGYAgSgArgDwgIKEAAYsAMY1gQYR8ICCBAAGIAEGLEDwgIOEAAYgAQYkQIYsQMYigWYAwCIBgGQBgiSBwMxLjOgB84b&sclient=gws-wiz-serp");

module.exports = scrapeData;

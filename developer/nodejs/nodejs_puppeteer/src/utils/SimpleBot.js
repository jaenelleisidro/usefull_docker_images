

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Instruct puppeteer to use the stealth plugin
puppeteer.use(StealthPlugin());



class SimpleBot {
    browser = null;
    page = null;

    sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

    async init(url=null, selector = "body", timeout = 5000) {
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage' // Prevents memory crashes in resource-constrained environments
            ]
        });
        this.page = await this.browser.newPage();
        if(url){
            await this.goto(url, selector, timeout);
        }
    }

    async close() {
        await this.browser.close();
        this.browser = null;
    }

    async goto(url, selector = 'body', timeout = 5000) {
        await this.page.goto(url);
        await this.waitForSelector(selector, timeout);
        return this.page;
    }

    async waitForSelector(selector, timeout = 5000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    async querySelectorAll(selector){
        return await this.page.$$(selector);
    }
    async querySelector(selector){
        return await this.page.$(selector);
    }


    async click(selector, timeout = 5000) {
        await this.waitForSelector(selector, timeout);
        await this.page.click('.product-card');
    }

    async screenshot(filePath = 'ouput.png') {
        await this.page.screenshot({ path: filePath });
    }
}

export const simpleBot = new SimpleBot()

const puppeteer = require("puppeteer");
let cookies = [
    {
        name: 'fedresurscookie',
        value: '49a02e3f33f382a97e9f05e2a886a351',
        domain: '.fedresurs.ru',
        path: '/',
        expires: 1629059133.339114,
        size: 47,
        httpOnly: true,
        secure: true,
        session: false,
        sameSite: 'None',
        sameParty: false,
        sourceScheme: 'Secure',
        sourcePort: 443
    }
]

class PuppeteerHandler {
    constructor() {
        this.browser = null
        this.innCounter = 0
    }

    async initBrowser() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox'
            ]
        })
    }
    closeBrowser() {
        this.browser.close()
    }
    async getPageContent(inn) {
        let url = ''
        this.innCounter++;
        try {
            if (this.innCounter % 10 == 0) {
                console.log(this.innCounter);   
                url = 'https://fedresurs.ru/'
                this.innCounter = 0;
                let page = await this.browser.newPage()
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36')
                await page.setCookie(...cookies);
                await page.goto(url, { waitUntil: "domcontentloaded" })
                await page.close()
                return 0;
            } else {
                url = 'https://fedresurs.ru/search/encumbrances'
                let page = await this.browser.newPage()
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36')
                await page.setCookie(...cookies);
                await page.goto(url, { waitUntil: "domcontentloaded" })
                //набираю Инн  
                await page.waitForSelector('.form-control');
                await page.click('.form-control');
                await page.type('.form-control', inn);
                //поиск     
                await page.click('body > fedresurs-app > div:nth-child(3) > search > div > div > div > encumbrances-search > div > div > div > form > button')
                await page.waitForFunction(' document.querySelector(".search-count-block").textContent!="" ', { timeout: 30000 })
                let count = await page.evaluate(() => {
                    return parseInt(document.querySelector('.search-count-block').textContent)
                })

                await page.close()
                return { inn, count }
            }
        } catch (error) {
            console.log(error);
            await page.close()
            throw error
        }
    }

}
module.exports = PuppeteerHandler
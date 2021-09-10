const puppeteer = require("puppeteer");
 
 async function getProxyList() {
    let browser;
    let link = 'https://spys.one/proxies'
    try {
        browser = await puppeteer.launch({
            headless: false,
            devtools: false
        })
        let page = await browser.newPage()
        await page.goto(link, { waitUntil: "domcontentloaded" })

        //выбор 500
        await Promise.all([
            page.waitForSelector('body > table:nth-child(3) > tbody', { visible: true }),
            page.select('#xpp', '5'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ])
        let html = await page.evaluate(async () => {
            let res = []
            let container = document.querySelectorAll('.spy1xx, .spy1x')
            for (let i = 2; i < container.length; i++) {
                const el = container[i];
                const symbol = el.childNodes[0].innerText.indexOf(':')
                const type = el.childNodes[1].innerText.indexOf('(')
                res.push({
                    ip: el.childNodes[0].innerText.slice(0, symbol),
                    port: el.childNodes[0].innerText.slice(symbol + 1),
                    type: type == -1 ? el.childNodes[1].innerText : el.childNodes[1].innerText.slice(0, type - 1)
                })
            }
            return res
        })
        await browser.close()
        return html;

    } catch (error) {
        console.log(error);
    }
}
module.exports=getProxyList
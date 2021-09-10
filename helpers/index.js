const puppeteer = require("puppeteer");
const getProxy = require('./proxyList')
let innListInfo = []
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

async function parsingListInn(innList, res) {
    let proxyList = await getProxy()
    const url = 'https://fedresurs.ru/search/encumbrances'
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    for (let proxyIndex = 0; proxyIndex < proxyList.length; proxyIndex++) {
        let proxy = `${proxyList[proxyIndex]['ip']}:${proxyList[proxyIndex]['port']}`
        let browser;
        try {
            browser = await puppeteer.launch({
                headless: false,
                args: [`--proxy-server=${proxy}`]
            })
            const page = await browser.newPage();
         //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.0 Safari/537.36')
           // await page.setCookie(...cookies);
            for (let index = 0; index < innList.length; index++) {
                const inn = innList[index];

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
                if (count != 0) {
                    res.write(`data: {"innData":"${inn}","count":"${count}"}\n`)
                    res.write(`id: ${inn} \n`);
                    res.write("\n");
                }
                res.write(`data: {"allInn":"${innList.length}","indexInn":"${index+1}"}\n`)
                res.write(`id: ${index+1} \n`);
                res.write("\n");
                console.log(`${index+1}/${innList.length}`);
            }
        } catch (err) {
            await browser.close()
            console.log('браузер закрыт');
            console.log(err);
        }
    }

}
module.exports = parsingListInn



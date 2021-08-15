const e = require("express");
const { Router } = require("express");
const router = Router();
const puppeteer = require("puppeteer")
var axios = require('axios');




router.get('/', async (req, res) => {
    res.render("home", {
        title: "Парсинг fedresurs",
        style: '/home.css',
        script: '/home.js'
    })
})

router.post('/postForm', async (req, res) => {
    let data = await parsing(req.body)
    res.status(200).json({ data })
})


async function parsing(param) {
    let arr = []
    let items = 0
    const link = 'https://fedresurs.ru/backend/encumbrances/'
    try {
        let configToFound = {
            method: 'get',
            url: link,
            headers: {
                'referer': `https://fedresurs.ru/search/encumbrances?offset=0&limit=15&searchString=${param.inn}T00:00:00.000&additionalSearchFnp=true&publishDateStart=${param.dateFrom}&publishDateEnd=${param.dateto}T23:59:59.999`,
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Cookie': 'fedresurscookie=8678c7cca03457ecde68163a7f433df2',
                'User-Agent': 'PostmanRuntime/7.28.3'
            },
            params: {
                offset: 0,
                limit: 15,
                searchString: param.inn,
                publishDateStart: `${param.dateFrom}T00:00:00.000`,
                publishDateEnd: `${param.dateTo}T23:59:59.999`
            },
        };
        await axios(configToFound)
            .then((res) => {
                console.log(res);
                items = res.data.found + 15
                console.log('items: ', items);
            })
            .catch(function (error) {
                console.log(error);
            });
        let count = 0
        while (count < items) {
            console.log(`count=${count}`);
            let config = {
                method: 'get',
                url: link,
                headers: {
                    'referer': `https://fedresurs.ru/search/encumbrances?offset=${count}&limit=15&searchString=7709431786&additionalSearchFnp=true&publishDateStart=2021-08-13T00:00:00.000&publishDateEnd=2021-09-01T23:59:59.999`,
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Cookie': 'fedresurscookie=8678c7cca03457ecde68163a7f433df2',
                    'User-Agent': 'PostmanRuntime/7.28.3'
                },
                params: {
                    offset: count,
                    limit: 15,
                    searchString: 7709431786,
                    publishDateStart: '2021-08-13T00:00:00.000',
                    publishDateEnd: '2021-09-01T23:59:59.999'
                },
            };

            await axios(config)
                .then(function (res) {
                    let dataArr = res.data.pageData.map(item => {
                        let parseString = res.data.pageData[0].mainInfo.split('Лизингополучатель: ')[res.data.pageData[0].mainInfo.split('Лизингополучатель: ').length - 1].split(',')
                        let inn = parseString[parseString.length - 1].replace(/[^0-9]/g, "")
                        let nameCompany = parseString[0]

                        return { inn, nameCompany }
                    })
                    dataArr = dataArr.filter((item, index, array) => array.findIndex(i => (i.inn === item.inn)) === index)
                    arr = arr.concat([...new Set(dataArr)]);
                })
                .catch(function (error) {
                    console.log(error);
                });
            count += 15
        }
        console.log(arr.length);
        return arr;
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;
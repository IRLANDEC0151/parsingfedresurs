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
            url: 'https://fedresurs.ru/backend/encumbrances?offset=15&limit=15&searchString=7709431786&publishDateStart=2021-08-12T00:00:00.000&publishDateEnd=2021-08-14T23:59:59.999',
            headers: {
                'Referer': `https://fedresurs.ru/search/encumbrances?offset=0&limit=15&searchString=7709431786&additionalSearchFnp=true&publishDateStart=2021-08-12T00:00:00.000&publishDateEnd=2021-08-14T23:59:59.999`,
                'Cookie': 'fedresurscookie=18b095deae8df78427a4c1569de7322b',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
            },
            // params: {
            //     offset: 0,
            //     limit: 15,
            //     searchString: param.inn,
            //     publishDateStart: `${param.dateFrom}T00:00:00.000`,
            //     publishDateEnd: `${param.dateTo}T23:59:59.999`
            // },
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
                    'Cookie': 'fedresurscookie=18b095deae8df78427a4c1569de7322b',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
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
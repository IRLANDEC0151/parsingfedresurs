
let searchBtn = document.querySelector('.searchBtn')
let dateFromInput = document.querySelector('.dateFrom')
let dateToInput = document.querySelector('.dateTo')
let innInput = document.querySelector('.innInput input')

searchBtn.addEventListener('click', () => {
    data = {
        inn: innInput.value,
        dateFrom: dateFromInput.value || 0,
        dateTo: dateToInput.value || 0

    }
    console.log(data);
    postForm(data)
        .then((data) => {
            console.log('data: ', data);
            createTable(data.data)
        })

})

innInput.addEventListener('input', (e) => {
    if (e.target.value) {
        searchBtn.disabled = false
    } else {
        searchBtn.disabled = true
    }
})

async function postForm(data) {
    return await fetch('/postForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) => {
        return data.json()
    })

}

function createTable(data) {
    data.forEach((i) => {
        document.querySelector('.table tbody').insertAdjacentHTML("beforeend", `
      <tr>
      <th scope="row">${document.querySelector('.table tbody').childElementCount + 1}</th>
      <td>${i.nameCompany}</td>
      <td>${i.inn}</td>
    </tr>
        `)
    });
}

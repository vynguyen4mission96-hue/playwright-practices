//tự viết- import để nó đừng bị error
import {test, expect} from '@playwright/test';

test('1.verify max due person name', async({page})=>{
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/tables')

    //print all cells
    //xem ở console, nó sẽ in ra
    await page.locator('#table1').getByRole('cell')
    .evaluateAll((cells)=> cells.map((cells)=> cells.textContent)).then((cellTexts)=>{
        console.log(cellTexts)
    })

    await page.locator('#table1').locator('//tbody/tr/td[4]')
    .evaluateAll((cells)=> cells.map((cells)=> cells.textContent)).then((cellTexts)=>{
        console.log(cellTexts)
    })

    //replace thử ký tự $
    await page.locator('#table1').locator('//tbody/tr/td[4]')
    .evaluateAll((cells)=> cells.map((cells)=> cells.textContent.replace('$',''))).then((cellTexts)=>{
        console.log(cellTexts)
    })

     //parseFloat() = lấy một chuỗi có số 
     // và chuyển phần số đó thành kiểu number dạng thập phân.
    await page.locator('#table1').locator('//tbody/tr/td[4]')
    .evaluateAll((cells)=> cells.map((cells)=> parseFloat(cells.textContent.replace('$','')))).then((cellTexts)=>{
        console.log(cellTexts)
    })

    const dueColumn=await page.locator('#table1').locator('//tbody/tr/td[4]')
    .evaluateAll((cells)=> cells.map((cells)=> parseFloat(cells.textContent.replace('$',''))))
    console.log('Due column values:', dueColumn)
    //find max due value
    const maxDueValue =Math.max(...dueColumn)
    console.log('Max due values:', maxDueValue)
    //in ra thử index của giá trị Max
    const maxDueindex =dueColumn.indexOf(maxDueValue)
    console.log('Max due index:', maxDueindex)

    //name of person with max due
    //JavaScript indexOf() → index bắt đầu từ 0
    //XPath tr[ ... ] → position bắt đầu từ 1
    //+1 là để đổi từ index của JavaScript sang position của XPath.
    const lastName = await page.locator('#table1').locator(`//tbody/tr[${maxDueindex+1}]/td[1]`).textContent()
    const firstName = await page.locator('#table1').locator(`//tbody/tr[${maxDueindex+1}]/td[2]`).textContent()
    console.log('name of person with max due:', firstName, lastName)
    //[''] để verify được 2 người trở lên
    expect(`${firstName} ${lastName}`).toBe(['Jason Doe'])

})

test('2.Find person with maximum due', async({page})=>{
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/tables')
    //
    //
    //get rows contents
    //split row by space
    //maping to json array
     const rows= await page.locator('#table1').locator('//tbody/tr').all()
     let person =[]
    //
    for (const row of rows){
        //textContent is a method, requires()
        const lastname = await row.locator('//td[1]').textContent()
        const firstname = await row.locator('//td[2]').textContent()
        const due = (await row.locator('//td[4]').textContent()) ?? ''
        person.push({
            "firstName":firstname,
            "lastName":lastname,
            //viết ngắn gọn là:
            //"fullName": ${firstname} ${lastname}
            "due" : parseFloat(due.replace('$',''))
        })

    }
    console.log(person)
    //find max due value
    const dueValue = person.map(person=> person.due)
    const maxDueValue = Math.max(...dueValue)
    console.log(maxDueValue)

    const maxDuePerson =person.filter(person=> person.due==maxDueValue)
    console.log(maxDuePerson)

    const maxDuePersonFullname=maxDuePerson.map(person=> `${person.firstName} ${person.lastName}`)
    console.log(maxDuePersonFullname)
    expect(maxDuePersonFullname).toStrictEqual(['Jason Doe'])


    })
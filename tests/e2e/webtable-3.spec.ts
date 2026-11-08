// import { test } from './fixtures/baseTest';
import { test, expect } from '@playwright/test'; // expect vẫn lấy từ gốc


type Person = {
    fullName: string;
    due: number;
};
let persons: Person[] = [];
let dueValues: number[]


test.describe('verify due on table1', () => {
     //chạy nhiều lần cho all test- không cần viết lại chọ mỗi test
    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('https://the-internet.herokuapp.com/tables')

        persons = [];
        dueValues = [];
        await test.step('Collect Table1 data', async () => {
            const rows = await page.locator('#table2 tbody tr').all();
            for (const row of rows) {
                const lastName = ((await row.locator('td:nth-child(1)').textContent()) ?? '').trim();
                const firstName = ((await row.locator('td:nth-child(2)').textContent()) ?? '').trim();
                const due = ((await row.locator('td:nth-child(4)').textContent()) ?? '').trim();
                persons.push({
                    fullName: `${firstName} ${lastName}`,
                    due: parseFloat(due.replace('$', '').trim())
                });
            }
        })
        await test.step('Get Due colum to list', () => {
            dueValues = persons.map((person) => person.due);
        })
    });
test('1.verify max due person name', async ({ page }) => {
        const maxDueValue = Math.max(...dueValues)
        await test.step('Filter max due person', () => {
            const maxDuePerson = persons.filter(person => person.due == maxDueValue)
            const maxDuePersonFullName = maxDuePerson.map(person => person.fullName)
            expect(maxDuePersonFullName).toStrictEqual(['Jason Doe'])
        })
    })

    test('2.verify min due person name', async ({ page }) => {
        const minDueValue = Math.min(...dueValues)

        const minDuePerson = persons.filter(person => person.due == minDueValue)
        const mimDuePersonFullName = minDuePerson.map(person => person.fullName)

        expect(mimDuePersonFullName).toStrictEqual(['John Smith', 'Tim Conway'])
    })

   

    test('3.verify max due person full name', async ({ page }) => {
    
    const table = await page.locator('#table1');
    const rows = await table.locator('tbody tr');

    const tableData = await rows.evaluateAll((rows) => {
        return rows.map((row) => {
            const cells = row.querySelectorAll('td');
            return {
                firstName: cells[1].innerText,
                lastName: cells[0].innerText,       
                due: cells[3].innerText.replace('$', ''),
            };
        });
    });
    const {firstName, lastName} = tableData.reduce((prev, current) => {
        return parseFloat(prev.due) > parseFloat(current.due) ? prev : current;
    });
    console.log(`${firstName} ${lastName}`)
    expect(`${firstName} ${lastName}`).toBe('Jason Doe');
   })
    
})

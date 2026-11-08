// import { test } from './fixtures/baseTest';
import { test, expect } from './fixtures/table.fixture'; // expect vẫn lấy từ gốc
import { TablePage } from './pages/table.page';


type Person = {
    fullName: string;
    due: number;
};
let persons: Person[] = [];
let dueValues: number[]

    test('3.verify max due person full name', async ({ tablePage }) => {
    test.setTimeout(60000);
    await tablePage.open()
    expect (await tablePage.getMaxduepersonnames('table1')).toStrictEqual(['Jason Doe'])
   })
    


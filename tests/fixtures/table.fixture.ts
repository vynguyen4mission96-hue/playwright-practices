import {test as base} from '@playwright/test';
export {expect } from '@playwright/test';
import { loginPage} from '../pages/login.page';
import { TablePage } from '../pages/table.page';

//define all pages under the-internet.herokuapp.com
//viết lại cho quen tay- fixture bên heroku.fixture.ts đã cover luôn rồi
type HerokuPages={
    loginPage: loginPage
    tablePage: TablePage
    
}

export const test =base.extend<HerokuPages>({

    //viết lại cho quen tay- fixture bên heroku.fixture.ts đã cover luôn rồi
    tablePage: async({page}, use)=>{
        const tablePage = new TablePage(page)
        await use(tablePage)
    }
  
})
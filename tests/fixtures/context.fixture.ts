import { expect, type Locator, type Page } from '@playwright/test';

export class ContextManuPAge{
    readonly page: Page
    constructor (page:Page){
        this.page= page
    }

    async open(){
        await this.page.goto('https://the-internet.herokuapp.com/context_menu')

    }
    async rightclick(){
        const box= this.page.locator('#hot-spot')
        await box.click({button: 'right'})
    }


}
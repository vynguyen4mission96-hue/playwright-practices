import {expect, type Locator, type Page} from '@playwright/test'

export class CheckboxPage{
    readonly page: Page

    constructor (page: Page){
        this.page= page
    }

    async open(){
        await this.page.goto('https://the-internet.herokuapp.com/checkboxes')
    }
    async check(checkboxname: string){
        if (checkboxname== 'checkbox 1'){
    await this.page.getByRole('checkbox').first().check()
        }
       if (checkboxname== 'checkbox 2') {
    await this.page.getByRole('checkbox').last().uncheck()
        }
    }
    async isChecked(checkboxname: string){
           if (checkboxname== 'checkbox 1'){
    return this.page.getByRole('checkbox').first().isChecked()
        }
       if (checkboxname== 'checkbox 2') {
        // .uncheck() 
    return this.page.getByRole('checkbox').last().isChecked()
        }

    }

}
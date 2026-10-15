import {Page, Locator} from '@playwright/test'
export class ForgotPasswordPage{
    readonly page: Page
    constructor(page: Page){
        this.page= page
    }

    async open(){
        await this.page.goto('https://the-internet.herokuapp.com/forgot_password')
    }
    async forgotPassword(email: string){
    
    await this.page.locator('#email').fill(email)
    await this.page.locator('#form_submit').click()
    }

    //to do: add assert function that forgot success


}
import {expect, type Locator, type Page} from '@playwright/test'

export class TablePage{
    readonly page: Page
    constructor(page: Page){
        this.page= page 

    }

    async open(){
        await this.page.goto('https://the-internet.herokuapp.com/tables')
    }
  

    async getMaxduepersonnames(table1: string): Promise<string[]>{
        const dueAmounts = await this.page.$$eval(`#${table1} tbody tr td:nth-child(4)`, 
            tds=> tds.map(td => parseFloat(td.textContent?.replace('$', '')||'0')
        )
    )
        const maxDueAmount= Math.max(...dueAmounts)

        const maxDueIndexes= dueAmounts
        .map((amount, index)=> amount === maxDueAmount? index: -1)
        .filter(index=> index !==-1)

        return Promise.all(maxDueIndexes.map(index=>
            this.page.$eval(`#${table1} tbody tr:nth-child(${index +1})`, row=>{
                const lastName =row.querySelector('td:nth-child(1)')?.textContent?.trim() || ''
                const firstName =row.querySelector('td:nth-child(2)')?.textContent?.trim() || ''
                return`${firstName} ${lastName}`
              }
            )
            )
        )
    
    }  
         
 
}
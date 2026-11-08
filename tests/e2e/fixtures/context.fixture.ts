import {test as base, expect} from '@playwright/test'
import { ContextMenuPage } from '../pages/context.page'

type ContextMenuFixtures={
    contextMenuPage: ContextMenuPage
}

export const test= base.extend<ContextMenuFixtures>({
    contextMenuPage: async ({page}, use)=>{
        const contextMenuPage= new ContextMenuPage(page)

        await use(contextMenuPage)
    }

})

export {expect}
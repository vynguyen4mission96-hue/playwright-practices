import {test, expect} from './fixtures/context.fixture';

test('right click context menu', async ({ page, contextMenuPage }) => {
    test.setTimeout(60000);
    await contextMenuPage.open()
    const dialogPromise= page.waitForEvent('dialog')
   
    //rightclick() viết thường, không viết hoa
    //vì bên context.page.ts khau báo như vậy- đọc cho kỹ
    await contextMenuPage.rightclick()
    const dialog = await dialogPromise
    //console để debug
     console.log('Dialog message:', dialog.message());

    try{
        expect(dialog.message()).toBe('You selected a context menu')
    }finally{
        await dialog.dismiss()
    }

})

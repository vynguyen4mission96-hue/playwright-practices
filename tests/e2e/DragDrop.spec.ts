import { test, expect } from '@playwright/test';

test('drag and drop', async ({ page }) => {
        //Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
        //chỉnh trong Trong playwright.config.ts cũng được
        test.setTimeout(60000);
  // Go to the drag and drop page
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  //khai báo giá trị có thể overwrite
  let colA_AfterDrag = await page.locator('#column-a').textContent()
  await expect(colA_AfterDrag).toBe('A');
  console.log(colA_AfterDrag)

  //column_a là source
  //column_b là target
  await page.locator('#column-a').dragTo(page.locator('#column-b'));

  colA_AfterDrag = await page.locator('#column-a').textContent();
  await expect(colA_AfterDrag).toBe('B');
  console.log(colA_AfterDrag)
});
 
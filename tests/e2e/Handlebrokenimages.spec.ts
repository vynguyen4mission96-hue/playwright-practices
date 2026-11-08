import {test,expect} from '@playwright/test';

test('verify broken image', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('/broken_images');
    
    const images = page.locator('img');
    
    // Check if the image is present
    const allImages = await images.all();

    for (const image of allImages) {
        const imgSrc = await image.getAttribute('src');
        expect(imgSrc?.length).toBeGreaterThan(1)
        const res = await page.request.get("https://the-internet.herokuapp.com/"+imgSrc)
        console.log("Image src:", imgSrc);
        // 200 thì ảnh ok, khác 200 là ảnh broken
        //đây cũng là cách làm test case failed tìm ra bug
        //đảm bảo hình nào load được (tức là 200)
        //failed ở đâu là dừng ở đó ngay
        //expect(res.status()).toBe(200)// Ensure src attribute exists

        //soft:Kiểm tra HTTP status code của response có bằng 200 hay không, 
        // nhưng nếu sai thì chưa dừng test ngay.
        expect.soft(res.status()).toBe(200)

        //xem status code:404, 200, etc
        //console.log("status code:", res.status())
    }   
});

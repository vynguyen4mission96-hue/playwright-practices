//tự nó tạo do xài codegen
// Codegen = mình thao tác trên 
// website → Playwright tự ghi lại thành code.
// import test  = lấy công cụ để tạo và chạy test case.
// import expect = lấy công cụ để kiểm tra kết quả mong đợi (Assertion).
// '@playwright/test' = thư viện Playwright Test mà project đang sử dụng.
import { test, expect } from '@playwright/test';


// test(...) = tạo một TEST CASE.
// 'test' = tên của test case. Tên này có thể đổi thành tên dễ hiểu hơn.
// async = test này có các thao tác bất đồng bộ (async), nên bên trong sẽ dùng await.
// { page } = Playwright cung cấp một đối tượng page cho test.
// page = đại diện cho một tab/trang web mà Playwright đang điều khiển.
test('test', async ({ page }) => {

  // page.goto(...) = yêu cầu trình duyệt mở URL này.
  // goto = "đi tới" một trang web.
  // await = chờ cho thao tác goto hoàn thành rồi mới chạy dòng tiếp theo.
  // Hình dung:
  // Browser
  //    ↓
  // mở https://todomvc.com/examples/react/dist/
  //    ↓
  // trang TodoMVC xuất hiện.
  await page.goto('https://todomvc.com/examples/react/dist/');

  // getByTestId('text-input') = tìm element có data-testid="text-input".
  // Đây là LOCATOR: Playwright dùng nó để xác định element nào cần thao tác.
  // click() = click vào element đó.
  // await = chờ click hoàn thành.
  //
  // Hình dung:
  // Playwright
  //    ↓
  // tìm element: data-testid="text-input"
  //    ↓
  // click vào ô nhập Todo.
  await page.getByTestId('text-input').click();

  // getByTestId('text-input') = lại tìm đúng ô input đó.
  // fill('buy apple') = điền chữ "buy apple" vào ô input.
  //
  // Sau dòng này:
  //
  // [ buy apple ]
  //
  // fill() thường dùng để điền nội dung vào input/textarea.
  await page.getByTestId('text-input').fill('buy apple');

  // getByTestId('text-input') = tìm lại ô input.
  // press('Enter') = mô phỏng việc nhấn phím Enter trên element đó.
  //
  // Hình dung:
  //
  // [ buy apple ]
  //       ↓
  //    nhấn Enter
  //       ↓
  // Todo mới được tạo.
  await page.getByTestId('text-input').press('Enter');

  // getByTestId('todo-item-label') = tìm element có data-testid="todo-item-label".
  // Đây là label của Todo "buy apple".
  // click() = click vào Todo đó.
  //
  // Trong TodoMVC, click vào Todo sẽ đánh dấu Todo là đã hoàn thành.
  //
  // Hình dung:
  //
  // ☐ buy apple
  //       ↓ click
  // ☑ buy apple
  await page.getByTestId('todo-item-label').click();

  // expect(...) = bắt đầu một ASSERTION (kiểm tra kết quả).
  //
  // page.getByTestId('todo-item-label')
  // = tìm element Todo.
  //
  // toBeVisible()
  // = kiểm tra element đó đang hiển thị trên trang.
  //
  // Đây KHÔNG phải thao tác với website.
  // Đây là câu hỏi:
  //
  // "Playwright ơi, Todo này có đang visible không?"
  //
  // Nếu có → PASS.
  // Nếu không → FAIL.
  await expect(page.getByTestId('todo-item-label')).toBeVisible();

  // getByTestId('footer')
  // = tìm phần footer của TodoMVC.
  //
  // toContainText('1 item left!')
  // = kiểm tra footer có chứa dòng/chữ:
  //
  // "1 item left!"
  //
  // Ý nghĩa nghiệp vụ:
  // Sau khi tạo 1 Todo và đánh dấu nó completed,
  // ứng dụng vẫn còn 1 Todo chưa hoàn thành? 
  //
  // Lưu ý quan trọng:
  // Dòng này kiểm tra TEXT thực tế trên UI.
  //
  // Nếu footer không chứa "1 item left!"
  // → assertion FAIL.
  // Nếu footer có chứa text đó
  // → assertion PASS.
  await expect(page.getByTestId('footer')).toContainText('1 item left!');
  // Kết thúc test case đầu tiên.
});


//đây là một test case
// 'verify table of contents'
// = tên của test case.
test ('verify table of contents', async({page})=>{
  await page.goto ('https://playwright.dev/');
  await page.getByRole('link', {name: 'Get started'}).click();
  await expect(page.getByRole('heading', {name: 'Installation'})). toBeVisible();
  
  // "Installation" ở đây là tên của LINK trong Table of Contents,
  // khác với "Installation" ở dòng trên là tên của HEADING.
  //exact: true yêu cầu tên phải khớp chính xác với "Installation".
  await expect(page.getByRole('link', {name: 'Installation', exact: true})). toBeVisible();
  
// getByRole('link', ...)
// = tìm một LINK.
//
// name: 'Writing tests'
// = link có tên "Writing tests".
//
// exact: true
// = yêu cầu tên khớp chính xác.
//
// toBeVisible()
// = kiểm tra link đó đang hiển thị.
//
// PASS nếu link tồn tại và visible.
// FAIL nếu không tìm thấy/không visible.
  await expect(page.getByRole('link', {name: 'Writing tests', exact: true})). toBeVisible();
  
// Tìm LINK có tên chính xác:
// "Running and debugging tests"
//
// Sau đó kiểm tra link đó có visible hay không.
//
// Đây tiếp tục là ASSERTION.
// Mục đích của test:
// xác nhận các mục cần thiết trong Table of Contents
// đang xuất hiện trên trang.
  await expect(page.getByRole('link', {name: 'Running and debugging tests', exact: true})). toBeVisible();
// Kết thúc test case "verify table of contents".
})
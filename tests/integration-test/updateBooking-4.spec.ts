// Import test và expect từ thư viện Playwright
import { test, expect } from "@playwright/test"

// Import dữ liệu booking từ file bookingData.ts
import { bookingData } from "./bookingData"

// Khai báo một test case có tên "update booking"
// request là APIRequest fixture có sẵn của Playwright
test("update booking", async ({ request }) => {

    // ==========================================
    // PHẦN 1: AUTHENTICATION - LẤY TOKEN
    // ==========================================

    // Chuẩn bị thông tin đăng nhập để gửi đến server
    const authData = {
        "username": "admin",
        "password": "password123"
    }

    // Gửi POST Request đến API /auth để xác thực tài khoản
    // headers: thông báo dữ liệu gửi đi có định dạng JSON
    // data: gửi authData vào Request Body
    const authReqs = await request.post(
        'https://restful-booker.herokuapp.com/auth',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: authData
        }
    )

    // Kiểm tra server có trả về HTTP Status Code 200 hay không
    expect(authReqs.status()).toBe(200)

    // Đọc Response Body và chuyển JSON thành JavaScript Object
    const authResponseBody = await authReqs.json()

    // Kiểm tra Response Body có chứa property "token" hay không
    expect(authResponseBody).toHaveProperty("token")

    // Lấy giá trị token từ property token trong Response Body
    // Gán giá trị đó vào biến token để sử dụng ở Request tiếp theo
    const token = authResponseBody.token


    // ==========================================
    // PHẦN 2: CREATE BOOKING - TẠO BOOKING MỚI
    // ==========================================

    // Thay đổi nhu cầu bổ sung của booking trước khi gửi lên server
    bookingData.additionalneeds = "Vegan Food"

    // Gửi POST Request đến API /booking để tạo booking mới
    // data: gửi object bookingData vào Request Body
    const createReqs = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: bookingData
        }
    )

    // Kiểm tra server có tạo booking thành công hay không
    expect(createReqs.status()).toBe(200)

    // Đọc Response Body chứa thông tin booking vừa được tạo
    const createResponseBody = await createReqs.json()

    // Lấy bookingid do server trả về
    // Gán bookingid vào biến để sử dụng trong URL Update
    const bookingid = createResponseBody.bookingid

    // Kiểm tra bookingid có giá trị truthy hay không
    expect(bookingid).toBeTruthy()


    // ==========================================
    // PHẦN 3: UPDATE BOOKING - CẬP NHẬT BOOKING
    // ==========================================

    // Gửi PUT Request đến booking cụ thể bằng bookingid
    // Cookie chứa token để server xác thực quyền cập nhật
    // data: gửi dữ liệu bookingData mới lên server
    const updateReqs = await request.put(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            data: bookingData
        }
    )

    // Kiểm tra server có cập nhật booking thành công hay không
    expect(updateReqs.status()).toBe(200)

    // Đọc Response Body sau khi cập nhật booking
    const updateResponseBody = await updateReqs.json()

    // ==========================================
    // PHẦN 4: VERIFY - XÁC MINH KẾT QUẢ UPDATE
    // ==========================================

    // So sánh toàn bộ dữ liệu server trả về
    // với dữ liệu bookingData mà chúng ta gửi lên
    expect(updateResponseBody).toEqual(bookingData)

})
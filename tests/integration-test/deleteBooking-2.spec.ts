import { test, expect } from "@playwright/test"

// Khai báo test case Delete Booking
test("delete a booking", async ({ request }) => {

    // ==========================================
    // PHẦN 1: AUTHENTICATION - LẤY TOKEN
    // ==========================================

    // Chuẩn bị thông tin đăng nhập
    const authData = {
        "username": "admin",
        "password": "password123"
    }

    // Gửi POST Request để xác thực tài khoản
    const authReps = await request.post(
        'https://restful-booker.herokuapp.com/auth',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: authData
        }
    )

    // Kiểm tra Authentication Request có thành công không
    expect(authReps.status()).toBe(200)

    // Đọc Response Body từ server
    const authResponseBody = await authReps.json()

    // Kiểm tra Response Body có property token không
    expect(authResponseBody).toHaveProperty("token")

    // Lấy token từ Response Body để sử dụng ở Delete Request
    const { token } = authResponseBody


    // ==========================================
    // PHẦN 2: CREATE BOOKING - TẠO BOOKING MỚI
    // ==========================================

    // Chuẩn bị dữ liệu booking
    const bookingData = {
        "firstname": "Ha",
        "lastname": "Do",
        "totalprice": 5000,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2026-11-01",
            "checkout": "2026-11-05"
        },
        "additionalneeds": "Breakfast"
    }

    // Gửi POST Request để tạo booking mới
    const createReps = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: bookingData
        }
    )

    // Kiểm tra Create Booking Request có thành công không
    expect(createReps.status()).toBe(200)

    // Đọc Response Body sau khi tạo booking
    const createResponseBody = await createReps.json()

    // Lấy bookingid do server trả về
    const { bookingid } = createResponseBody

    // Kiểm tra bookingid có tồn tại và có giá trị không
    expect(bookingid).toBeTruthy()


    // ==========================================
    // PHẦN 3: DELETE BOOKING - XÓA BOOKING
    // ==========================================

    // Gửi DELETE Request đến booking cần xóa
    // bookingid xác định booking nào cần xóa
    // token xác thực quyền thực hiện thao tác xóa
    const deleteReps = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {
                'Cookie': `token=${token}`
            }
        }
    )

    // Kiểm tra server trả về Status Code 201 sau khi xóa
    expect(deleteReps.status()).toBe(201)


    // ==========================================
    // PHẦN 4: VERIFY - KIỂM TRA BOOKING ĐÃ BỊ XÓA
    // ==========================================

    // Gửi GET Request để kiểm tra booking sau khi xóa
    const verifyReps = await request.get(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`
    )

    // Nếu booking đã bị xóa, API GET theo ID phải trả về 404
    expect(verifyReps.status()).toBe(404)

})
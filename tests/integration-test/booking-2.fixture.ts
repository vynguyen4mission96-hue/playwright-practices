
import { test as base } from '@playwright/test'

// BƯỚC 1: Khai báo kiểu dữ liệu cho các Custom Fixture
type BookingFixture = {
    // authToken: Fixture cung cấp một chuỗi token (string).
    // Token được lấy từ API đăng nhập /auth.
    authToken: string,

    // randomBookingId: Fixture cung cấp một mã booking (number).
    // Mã này được chọn ngẫu nhiên từ danh sách booking.
    randomBookingId: number,
}

// BƯỚC 2: Tạo Custom Fixture bằng base.extend()
export const test = base.extend<BookingFixture>({

    // FIXTURE 1: Lấy Authentication Token

    // { request }: sử dụng request fixture có sẵn của Playwright
    // use: dùng để cung cấp giá trị fixture cho test case sử dụng nó
    authToken: async ({ request }, use) => {

        // Khai báo dữ liệu đăng nhập gửi lên API
        const authData = {
            "username": "admin",
            "password": "password123"
        }

        // Gửi POST request đến API /auth để đăng nhập
        const authReps = await request.post(
            'https://restful-booker.herokuapp.com/auth',
            {
                headers: {
                    // Khai báo dữ liệu gửi đi có định dạng JSON
                    'Content-Type': 'application/json'
                },

                // Đưa dữ liệu đăng nhập vào request body
                data: authData
            }
        )

        // Chuyển response body từ JSON sang JavaScript object
        const responseBody = await authReps.json()

        // Destructuring: lấy giá trị token từ responseBody
        const { token } = responseBody

        // Cung cấp token cho test case sử dụng fixture authToken
        await use(token)

        // Nếu có code đặt sau await use(token),
        // code đó sẽ chạy sau khi test case sử dụng fixture kết thúc.
    },

    // FIXTURE 2: Lấy ngẫu nhiên một Booking ID

    randomBookingId: async ({ request }, use) => {

        // Gửi GET request để lấy danh sách tất cả booking
        const allBookingRes = await request.get(
            'https://restful-booker.herokuapp.com/booking'
        )

        // Chuyển response body thành JavaScript array
        const allBookingIds = await allBookingRes.json()

        // Math.random(): tạo số ngẫu nhiên từ 0 (bao gồm) đến 1 (không bao gồm)
        // Nhân với length: giới hạn số ngẫu nhiên theo số phần tử trong array
        // Math.floor(): làm tròn xuống để lấy một index nguyên
        // [index]: truy cập object tại vị trí ngẫu nhiên
        // .bookingid: lấy booking ID từ object đó
        const bookingID =
            allBookingIds[Math.floor(Math.random() * allBookingIds.length)].bookingid

        // Cung cấp Booking ID cho test case sử dụng fixture randomBookingId
        await use(bookingID)
    }
})

// BƯỚC 3: Export expect để test file có thể import
// Nhờ vậy, test file có thể import cả test và expect từ cùng một file fixture.
export { expect } from '@playwright/test';

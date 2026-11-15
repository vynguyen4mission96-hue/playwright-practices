
import { test as base } from '@playwright/test';

// ============================================================
// PHẦN 1: KHAI BÁO TYPE (ĐỊNH NGHĨA KIỂU DỮ LIỆU)
// ============================================================

// Mục đích: Định nghĩa cấu trúc dữ liệu ngày nhận phòng và trả phòng.
// checkin, checkout đều phải có kiểu dữ liệu string.
export type BookingDates = {
    checkin: string;
    checkout: string;
};

// Mục đích: Định nghĩa cấu trúc dữ liệu của một booking.
// Các thuộc tính bên trong phải đúng kiểu dữ liệu đã khai báo.
export type BookingData = {
    firstname: string;       // Tên khách hàng
    lastname: string;        // Họ khách hàng
    totalprice: number;      // Tổng giá tiền
    depositpaid: boolean;    // Đã thanh toán tiền đặt cọc hay chưa
    bookingdates: BookingDates; // Thông tin ngày nhận/trả phòng
    additionalneeds?: string; // Nhu cầu bổ sung (không bắt buộc vì có dấu ?)
};

// Mục đích: Định nghĩa cấu trúc dữ liệu trả về sau khi tạo booking thành công.
// API trả về bookingid và thông tin booking vừa được tạo.
export type CreateBookingResult = {
    bookingid: number;
    booking: BookingData;
};

// Mục đích: Định nghĩa các Fixture mà file này sẽ cung cấp cho test case.
// Các test case có thể sử dụng những fixture này thông qua tham số của test().
type BookingFixture = {
    authToken: string; // Token dùng để xác thực khi gọi API cần đăng nhập.
    randomBookingId: number; // Một booking ID được lấy ngẫu nhiên.
    
    // Fixture createBooking là một function.
    // Có thể truyền dữ liệu tùy chỉnh hoặc không truyền.
    // Kết quả trả về là Promise chứa CreateBookingResult.
    createBooking: (customData?: Partial<BookingData>) => Promise<CreateBookingResult>;
};

// ============================================================
// PHẦN 2: DỮ LIỆU BOOKING MẶC ĐỊNH
// ============================================================

// Mục đích: Tạo sẵn một bộ dữ liệu booking mặc định.
// Khi tạo booking, nếu test case không cung cấp dữ liệu riêng,
// fixture sẽ sử dụng những giá trị mặc định này.
const defaultBookingData: BookingData = {
    firstname: "Ha",
    lastname: "Do",
    totalprice: 5000,
    depositpaid: true,
    bookingdates: {
        checkin: "2026-11-01",
        checkout: "2026-11-05"
    },
    additionalneeds: "Breakfast"
};

// ============================================================
// PHẦN 3: KHỞI TẠO VÀ MỞ RỘNG PLAYWRIGHT FIXTURES
// ============================================================

// base.extend<BookingFixture>()
// Mục đích: Mở rộng bộ fixture có sẵn của Playwright,
// bổ sung thêm 3 fixture: authToken, randomBookingId, createBooking.
//
// BookingFixture là TypeScript type dùng để khai báo kiểu dữ liệu
// cho các fixture mới được tạo bên dưới.
export const test = base.extend<BookingFixture>({

    // --------------------------------------------------------
    // FIXTURE 1: AUTH TOKEN
    // --------------------------------------------------------

    // Mục đích: Gửi request đăng nhập vào API để lấy token.
    // request là fixture có sẵn của Playwright.
    // use dùng để cung cấp giá trị fixture cho test case.
    authToken: async ({ request }, use) => {

        // Dữ liệu tài khoản dùng để đăng nhập.
        const authData = {
            "username": "admin",
            "password": "password123"
        };

        // Gửi HTTP POST request đến API /auth.
        // headers: khai báo nội dung gửi đi là JSON.
        // data: dữ liệu tài khoản được gửi trong request body.
        const authReps = await request.post('https://restful-booker.herokuapp.com/auth', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: authData
        });

        // Chuyển response body từ JSON sang JavaScript object.
        const responseBody = await authReps.json();

        // Lấy riêng thuộc tính token từ responseBody.
        // Tương đương: const token = responseBody.token;
        const { token } = responseBody;

        // Cung cấp token cho test case sử dụng fixture authToken.
        await use(token);
    },

    // --------------------------------------------------------
    // FIXTURE 2: RANDOM BOOKING ID
    // --------------------------------------------------------

    // Mục đích: Lấy ngẫu nhiên một booking ID đang tồn tại trên API.
    randomBookingId: async ({ request }, use) => {

        // Gửi HTTP GET request để lấy danh sách booking ID.
        const allBookingRes = await request.get('https://restful-booker.herokuapp.com/booking');

        // Chuyển response body thành JavaScript array.
        const allBookingIds = await allBookingRes.json();

        // Math.random(): tạo một số ngẫu nhiên từ 0 đến nhỏ hơn 1.
        // allBookingIds.length: tổng số phần tử trong danh sách.
        // Math.floor(): làm tròn xuống để lấy index nguyên.
        //
        // Sau đó lấy bookingid của phần tử tại index ngẫu nhiên.
        const bookingID = allBookingIds[Math.floor(Math.random() * allBookingIds.length)].bookingid;

        // Cung cấp bookingID ngẫu nhiên cho test case.
        await use(bookingID);
    },

    // --------------------------------------------------------
    // FIXTURE 3: CREATE BOOKING
    // --------------------------------------------------------

    // Mục đích: Cung cấp một function để tạo booking thông qua API.
    // Test case có thể gọi function này nhiều lần với dữ liệu khác nhau.
    createBooking: async ({ request }, use) => {

        // use() cung cấp function createBooking cho test case.
        // Function này nhận customData là dữ liệu tùy chỉnh (nếu có).
        await use(async (customData?: Partial<BookingData>) => {

            // Tạo payload: dữ liệu sẽ được gửi trong request body.
            const payload: BookingData = {

                // Spread operator (...):
                // Sao chép toàn bộ dữ liệu mặc định vào payload trước.
                ...defaultBookingData,

                // Sao chép dữ liệu tùy chỉnh vào payload sau.
                // Nếu trùng thuộc tính, giá trị customData sẽ ghi đè mặc định.
                ...customData,

                // Xử lý riêng object bookingdates.
                // Mục đích: Khi customData chỉ truyền checkin hoặc checkout,
                // giá trị còn thiếu vẫn được giữ lại từ dữ liệu mặc định.
                bookingdates: {
                    ...defaultBookingData.bookingdates,
                    ...customData?.bookingdates
                }
            };

            // Gửi HTTP POST request đến API /booking để tạo booking.
            const reps = await request.post('https://restful-booker.herokuapp.com/booking', {
                headers: {
                    'Content-Type': 'application/json'
                },

                // Gửi payload trong request body.
                data: payload
            });

            // Chuyển response body thành JSON,
            // sau đó khai báo kiểu dữ liệu trả về là CreateBookingResult.
            // as CreateBookingResult là Type Assertion của TypeScript,
            // không phải bước kiểm tra dữ liệu thực tế từ API.
            return (await reps.json()) as CreateBookingResult;
        });
    }
});

// Import và export expect để các file test có thể sử dụng
// cùng với test đã được mở rộng fixture ở phía trên.
export { expect } from '@playwright/test';

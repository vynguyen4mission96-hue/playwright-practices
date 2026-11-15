
import { test, expect } from "./bookingFull.fixture";
import * as z from "zod";

// ============================================================
// TEST CASE 1: GET ALL BOOKING
// ============================================================

test("get all booking", async ({ request }) => {

    // [PLAYWRIGHT BUILT-IN FIXTURE]
    // request là Fixture có sẵn của Playwright.
    // Dùng request để gửi HTTP GET request đến API.

    const reps = await request.get('https://restful-booker.herokuapp.com/booking');

    // Kiểm tra API trả về HTTP Status Code 200.
    expect(reps.status()).toBe(200);

    // Chuyển response body từ JSON thành JavaScript array.
    const responseBody = await reps.json();

    // Tạo Schema để kiểm tra cấu trúc của một booking ID.
    const bookingSchema = z.object({
        bookingid: z.number()
    });

    // API trả về một danh sách booking ID (Array).
    // Vì vậy, dùng z.array() để kiểm tra từng phần tử trong Array
    // có đúng cấu trúc bookingSchema hay không.
    const bookingsSchema = z.array(bookingSchema);

    // Kiểm tra dữ liệu response có đúng cấu trúc Schema không.
    expect(bookingsSchema.parse(responseBody)).toBeTruthy();
});


// ============================================================
// TEST CASE 2: GET BOOKING BY ID
// ============================================================

test("get booking by id", async ({ request, randomBookingId }) => {

    // [PLAYWRIGHT BUILT-IN FIXTURE]
    // request: dùng để gửi HTTP GET request.

    // [CUSTOM FIXTURE: randomBookingId]
    // Trước đây chúng ta phải:
    // 1. GET danh sách tất cả booking ID.
    // 2. Chuyển response thành JSON.
    // 3. Dùng Math.random() để lấy một booking ID ngẫu nhiên.
    //
    // Bây giờ Fixture randomBookingId đã thực hiện toàn bộ công việc đó.
    // Chỉ cần gọi randomBookingId để nhận kết quả.

    // Gửi GET request để lấy thông tin booking theo ID ngẫu nhiên.
    const reps = await request.get(
        `https://restful-booker.herokuapp.com/booking/${randomBookingId}`
    );

    // Kiểm tra API trả về HTTP Status Code 200.
    expect(reps.status()).toBe(200);

    // Chuyển response body thành JavaScript object.
    const responseBody = await reps.json();

    // Tạo Schema để xác minh cấu trúc thông tin booking.
    const bookingInfoSchema = z.object({
        firstname: z.string(),
        lastname: z.string(),
        totalprice: z.number(),
        depositpaid: z.boolean(),
        bookingdates: z.object({
            checkin: z.string(),
            checkout: z.string()
        })
    });

    // Kiểm tra response có đúng cấu trúc đã định nghĩa không.
    expect(bookingInfoSchema.parse(responseBody)).toBeTruthy();

    // Lấy riêng firstname và lastname từ responseBody.
    const { firstname, lastname } = responseBody;

    // In tên khách hàng ra Terminal.
    console.log(`${firstname} ${lastname}`);
});


// ============================================================
// TEST CASE 3: CREATE NEW BOOKING
// ============================================================

test("create new booking", async ({ createBooking }) => {

    // [CUSTOM FIXTURE: createBooking]
    // Trước đây chúng ta phải:
    // 1. Khai báo bookingData.
    // 2. Gửi HTTP POST request.
    // 3. Truyền headers và request body.
    // 4. Chuyển response thành JSON.
    //
    // Bây giờ Fixture createBooking đã thực hiện những công việc trên.
    // Chỉ cần gọi createBooking() để tạo một booking mới.
    //
    // Không truyền customData:
    // Fixture sẽ sử dụng defaultBookingData đã khai báo trong file Fixture.

    const responseBody = await createBooking();

    // Lấy thông tin booking và bookingid từ kết quả Fixture trả về.
    const { booking, bookingid } = responseBody;

    // Kiểm tra booking có đúng dữ liệu mặc định hay không.
    // Lưu ý: Dữ liệu mặc định được khai báo trong file Fixture.
    expect(booking).toEqual({
        firstname: "Ha",
        lastname: "Do",
        totalprice: 5000,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-11-01",
            checkout: "2026-11-05"
        },
        additionalneeds: "Breakfast"
    });

    // Kiểm tra response có thuộc tính bookingid.
    expect(responseBody).toHaveProperty("bookingid");

    // Kiểm tra bookingid có kiểu number.
    expect(bookingid).toEqual(expect.any(Number));
});


// ============================================================
// TEST CASE 4: UPDATE BOOKING
// ============================================================

test("update booking", async ({ request, authToken, createBooking }) => {

    // [CUSTOM FIXTURE: authToken]
    // Trước đây chúng ta phải:
    // 1. Khai báo username và password.
    // 2. Gửi POST request đến API /auth.
    // 3. Nhận response.
    // 4. Lấy token từ response.
    //
    // Bây giờ Fixture authToken đã thực hiện toàn bộ công việc đó.
    // Chỉ cần gọi authToken để nhận token.

    // [CUSTOM FIXTURE: createBooking]
    // Tạo một booking mới và nhận kết quả trả về.
    // Fixture tự sử dụng defaultBookingData nếu không truyền dữ liệu riêng.

    const createdBooking = await createBooking();

    // Lấy bookingid để xác định booking cần update.
    const { bookingid } = createdBooking;

    // Lấy dữ liệu booking vừa tạo.
    // Dùng spread operator để tạo một object mới,
    // không trực tiếp sửa object booking ban đầu.
    const bookingData = {
        ...createdBooking.booking,
        additionalneeds: "Vegan Food"
    };

    // Gửi HTTP PUT request để cập nhật booking.
    const updateReps = await request.put(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {
                'Content-Type': 'application/json',

                // [CUSTOM FIXTURE: authToken]
                // Sử dụng token được cung cấp bởi Fixture authToken.
                // API sử dụng Cookie để xác thực quyền cập nhật booking.
                'Cookie': `token=${authToken}`
            },

            // Gửi bookingData mới vào request body.
            data: bookingData
        }
    );

    // Kiểm tra API trả về HTTP Status Code 200.
    expect(updateReps.status()).toBe(200);

    // Chuyển response body thành JavaScript object.
    const updateResponseBody = await updateReps.json();

    // Kiểm tra thông tin booking sau khi update
    // có khớp với dữ liệu chúng ta vừa gửi không.
    expect(updateResponseBody).toEqual(bookingData);
});


// ============================================================
// TEST CASE 5: DELETE BOOKING
// ============================================================

test("delete a booking", async ({ request, authToken, createBooking }) => {

    // [CUSTOM FIXTURE: authToken]
    // Fixture tự đăng nhập và lấy token.
    // Không cần viết lại đoạn POST /auth.

    // [CUSTOM FIXTURE: createBooking]
    // Fixture tự tạo một booking mới.
    // Không cần tự khai báo bookingData và POST /booking.

    const createdBooking = await createBooking();

    // Lấy bookingid của booking vừa được tạo.
    // Đây chính là ID mà chúng ta sẽ dùng để DELETE.
    const { bookingid } = createdBooking;

    // Gửi HTTP DELETE request để xóa booking.
    const reps = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {

                // [CUSTOM FIXTURE: authToken]
                // Sử dụng token đã được Fixture lấy từ API /auth.
                // Không cần tự tạo Cookie từ một token vừa lấy thủ công.
                'Cookie': `token=${authToken}`
            }
        }
    );

    // Kiểm tra API trả về HTTP Status Code 201.
    expect(reps.status()).toBe(201);

    // --------------------------------------------------------
    // VERIFY: KIỂM TRA BOOKING ĐÃ ĐƯỢC XÓA HAY CHƯA
    // --------------------------------------------------------

    // [PLAYWRIGHT BUILT-IN FIXTURE]
    // request: tiếp tục dùng để gửi HTTP GET request.

    // Gửi GET request đến bookingid vừa xóa.
    const verifyReps = await request.get(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`
    );

    // Nếu booking đã bị xóa, API GET theo ID sẽ trả về 404.
    expect(verifyReps.status()).toBe(404);
});

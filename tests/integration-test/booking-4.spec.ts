
// Import test và expect từ file Custom Fixture của chúng ta
// test: đã được mở rộng bằng base.extend() để có thêm authToken, randomBookingId
// expect: dùng để kiểm tra kết quả test
import { test, expect } from "./booking.fixture"

// Import thư viện Zod để kiểm tra cấu trúc và kiểu dữ liệu của response JSON
import * as z from "zod";

// CRUD:
// Create  -> POST
// Retrieve -> GET
// Update  -> PUT / PATCH
// Delete  -> DELETE


// ==================================================
// TEST CASE 1: GET ALL BOOKING
// Mục đích: Lấy danh sách tất cả booking
// ==================================================

test("get all booking", async ({ request }) => {

    // Gửi GET request đến endpoint /booking
    // request là fixture có sẵn của Playwright
    const reps = await request.get(
        'https://restful-booker.herokuapp.com/booking'
    );

    // Kiểm tra HTTP status code có bằng 200 (OK) hay không
    expect(reps.status()).toBe(200);

    // Chuyển response body từ JSON thành JavaScript data
    // Kết quả ở đây là một array chứa các object booking ID
    const responseBody = await reps.json()

    // Tạo schema mô tả cấu trúc của MỘT phần tử trong danh sách
    const bookingSchema = z.object({
        // bookingid phải có kiểu dữ liệu number
        bookingid: z.number()
    })

    // z.array(): khai báo dữ liệu phải là một array
    // Mỗi phần tử bên trong array phải thỏa mãn bookingSchema
    const bookingsSchema = z.array(bookingSchema)

    // parse(): kiểm tra responseBody có đúng cấu trúc schema hay không
    // Nếu hợp lệ, parse trả về dữ liệu đã được xác thực
    // Nếu không hợp lệ, Zod ném ra lỗi và test sẽ fail
    expect(bookingsSchema.parse(responseBody)).toBeTruthy()
})


// ==================================================
// TEST CASE 2: GET BOOKING BY ID
// Mục đích: Lấy thông tin chi tiết của một booking
// ==================================================

test("get booking by id", async ({ request, randomBookingId }) => {

    // randomBookingId là Custom Fixture
    // Fixture tự gọi API GET /booking và chọn ngẫu nhiên một booking ID
    // Không cần tự viết lại logic lấy ID trong test case này

    // Gửi GET request để lấy thông tin booking theo ID
    // Dùng template literal (`) để chèn giá trị randomBookingId vào URL
    const reps = await request.get(
        `https://restful-booker.herokuapp.com/booking/${randomBookingId}`
    )

    // Kiểm tra request lấy booking thành công
    expect(reps.status()).toBe(200);

    // Chuyển response body JSON thành JavaScript object
    const responseBody = await reps.json()

    // Tạo schema để mô tả cấu trúc của booking detail
    const bookingInfoSchema = z.object({

        // firstname phải là string
        firstname: z.string(),

        // lastname phải là string
        lastname: z.string(),

        // totalprice phải là number
        totalprice: z.number(),

        // depositpaid phải là boolean (true hoặc false)
        depositpaid: z.boolean(),

        // bookingdates là một object lồng bên trong object booking
        bookingdates: z.object({

            // checkin phải là string
            checkin: z.string(),

            // checkout phải là string
            checkout: z.string()
        })
    })

    // Kiểm tra responseBody có đúng cấu trúc bookingInfoSchema không
    expect(bookingInfoSchema.parse(responseBody)).toBeTruthy()

    // Destructuring: lấy riêng firstname và lastname từ responseBody
    const { firstname, lastname } = responseBody

    // In tên và họ ra terminal
    console.log(`${firstname} ${lastname}`)
})


// ==================================================
// TEST CASE 3: CREATE NEW BOOKING
// Mục đích: Tạo một booking mới
// ==================================================

test("create new booking", async ({ request }) => {

    // Khai báo dữ liệu muốn gửi lên API để tạo booking
    // Đây chính là request body
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

    // Gửi POST request đến endpoint /booking
    const reps = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                // Cho API biết dữ liệu gửi lên có định dạng JSON
                'Content-Type': 'application/json'
            },

            // Đưa object bookingData vào request body
            data: bookingData
        }
    )

    // Restful Booker trả về status 200 khi tạo booking thành công
    expect(reps.status()).toBe(200);

    // Đọc response body do API trả về
    const responseBody = await reps.json()

    // Lấy object booking từ response
    // Response có cấu trúc gồm bookingid và booking
    const { booking } = responseBody

    // So sánh thông tin booking API trả về với dữ liệu đã gửi lên
    // toEqual(): so sánh giá trị và cấu trúc object
    expect(booking).toEqual(bookingData)

    // Kiểm tra response có thuộc tính bookingid hay không
    expect(responseBody).toHaveProperty("bookingid")
})


// ==================================================
// TEST CASE 4: UPDATE BOOKING
// Mục đích: Tạo booking mới, sau đó cập nhật thông tin
// ==================================================

test("update booking", async ({ request, authToken }) => {

    // authToken là Custom Fixture
    // Fixture tự gửi POST /auth và lấy token
    // Không cần đăng nhập lại trong test case này

    // Khai báo dữ liệu booking ban đầu
    // Dùng let vì phía dưới chúng ta sẽ thay đổi dữ liệu trong object
    let bookingData = {
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

    // ----------------------------------------------
    // BƯỚC 1: CREATE BOOKING
    // Tạo một booking mới để có bookingid dùng cho việc update
    // ----------------------------------------------

    const createReps = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: bookingData
        }
    )

    // Kiểm tra tạo booking thành công
    expect(createReps.status()).toBe(200);

    // Đọc response body sau khi tạo booking
    const createResponseBody = await createReps.json()

    // Lấy bookingid từ response
    const { bookingid } = createResponseBody

    // ----------------------------------------------
    // BƯỚC 2: UPDATE BOOKING
    // Thay đổi thông tin booking vừa tạo
    // ----------------------------------------------

    // Thay đổi giá trị additionalneeds trong object bookingData
    // Dữ liệu mới sẽ được gửi lên API ở bước PUT bên dưới
    bookingData.additionalneeds = "Vegan Food"

    // Gửi PUT request đến booking ID vừa tạo
    const updateReps = await request.put(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {
                'Content-Type': 'application/json',

                // Gửi token để xác thực quyền cập nhật booking
                // Cookie có định dạng: token=<giá trị token>
                'Cookie': `token=${authToken}`
            },

            // Gửi toàn bộ object bookingData lên API
            data: bookingData
        }
    )

    // Kiểm tra API cập nhật thành công
    expect(updateReps.status()).toBe(200);

    // Đọc response body sau khi update
    const updateResponseBody = await updateReps.json()

    // So sánh dữ liệu API trả về với dữ liệu mới đã gửi lên
    expect(updateResponseBody).toEqual(bookingData)
})


// ==================================================
// TEST CASE 5: DELETE BOOKING
// Mục đích: Tạo booking mới, sau đó xóa booking đó
// ==================================================

test("delete a booking", async ({ request, authToken }) => {

    // authToken được lấy từ Custom Fixture
    // Không cần tự gọi POST /auth như cách viết ban đầu nữa

    // Khai báo dữ liệu booking cần tạo
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

    // ----------------------------------------------
    // BƯỚC 1: CREATE BOOKING
    // Tạo booking mới để lấy bookingid
    // ----------------------------------------------

    const createReps = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: bookingData
        }
    )

    // Kiểm tra tạo booking thành công
    expect(createReps.status()).toBe(200);

    // Đọc response body
    const createResponseBody = await createReps.json()

    // Lấy bookingid của booking vừa tạo
    const { bookingid } = createResponseBody

    // ----------------------------------------------
    // BƯỚC 2: DELETE BOOKING
    // Xóa booking theo ID vừa lấy được
    // ----------------------------------------------

    const reps = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {
                // Cung cấp token để xác thực quyền xóa booking
                'Cookie': `token=${authToken}`
            }
        }
    )

    // Theo API Restful Booker, status 201 thể hiện xóa thành công
    expect(reps.status()).toBe(201);

    // ----------------------------------------------
    // BƯỚC 3: VERIFY DELETED BOOKING
    // Kiểm tra booking thực sự đã bị xóa
    // ----------------------------------------------

    // Gửi GET request đến booking ID vừa xóa
    const verifyReps = await request.get(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`
    )

    // Mong đợi API trả về 404 vì booking không còn tồn tại
    expect(verifyReps.status()).toBe(404);
})

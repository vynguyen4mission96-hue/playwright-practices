import {test, expect} from "@playwright/test"
import { checkServerIdentity } from "tls"
//Trong Playwright, request ở đây là một fixture có sẵn.
//thư viện zod
import * as z from "zod"

//khởi tạo
//Schema là một bản mô tả cấu trúc và các quy tắc mà dữ liệu cần tuân thủ (bookingid phải là number)
// Schema của một booking
const bookingSchema = z.object({
    bookingid: z.number()
})
// Schema của một Array gồm nhiều booking
const bookingSchema_2 =z.array(bookingSchema)

/**
 * verify single endpoint
 * 
 * verify input:
 * 1/method
 * 2/headers:
 * a/invalid
 * b/missing
 * 3/payload:
 * a/invalid
 * b/missing
 * 
 * verify response:
 * 1/status code
 * 2/response body:
 * a/body schema
 * b/value
 * 
 */
test ("get all booking", async({request}) => {
    const reps = await request.get('https://restful-booker.herokuapp.com/booking');
        // Kiểm tra Status Code
    expect(reps.status()).toBe(200);
    //in response ra
    //console.log(await reps.json())

    const responseBody = await reps.json()
    //bookingSchema_2.parse Kiểm tra Response Body có tuân thủ Schema không
    //
    //Có thể chạy PASS
    //nếu dữ liệu đúng Schema và kết quả trả về Truthy.

    //Có thể chạy FAIL
    //nếu dữ liệu sai Schema hoặc kết quả trả về Falsy.

    //kết quả phải là number
    expect(bookingSchema_2.parse(responseBody)).toBeTruthy


    })

    test ("get booking by id", async({request})=> {
        //get random booking ID
        
    // Lấy ngẫu nhiên một Booking ID từ danh sách booking hiện có
    // 1. Gửi GET request đến API /booking để lấy danh sách tất cả Booking ID
        const allBookingRes= await request.get('https://restful-booker.herokuapp.com/booking')
   // 2. Đọc Response Body và chuyển dữ liệu JSON thành JavaScript Array chứa các Booking ID
        const allBookingIds= await allBookingRes.json()
    // 3. Tạo một vị trí ngẫu nhiên trong Array và lấy Booking ID tại vị trí đó
        const bookingID = allBookingIds[Math.floor(Math.random()*allBookingIds.length)].bookingid


         const reps = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingID}`);
         expect(reps.status()).toBe(200);
         // 6. Đọc Response Body
         const responseBody = await reps.json()
             // 7. Khai báo Schema để kiểm tra cấu trúc và kiểu dữ liệu của response
         const bookingInfoSchema = z.object({
            firstname: z.string(),
            lastname:z.string(),
            totalprice:z.number(),
            depositpaid:z.boolean(),
            bookingdates:z.object({
                checkin:z.string(),
                checkout:z.string()
            })
         })
   
         
         
         //console.log(responseBody)
         // 8. Validate Response Body bằng Schema
         expect(bookingInfoSchema.parse(responseBody)).toBeTruthy()
         //extract json object
         // 9. Extract firstname và lastname từ Response Body
         const {firstname, lastname}=responseBody
          // 10. In họ và tên ra console
         console.log(`${firstname} ${lastname}`)

    })

    test("get booking by id_2", async ({ request }) => {

    const reps = await request.get(
        'https://restful-booker.herokuapp.com/booking/1',
        {
            headers: {
                Accept: 'application/json'
            }
        }
    );

    console.log("Status:", reps.status());
    console.log("Headers:", reps.headers());

    const responseBody = await reps.json();

    console.log(responseBody);
});

    //test ("get auth token", async({request})=> {

    //})


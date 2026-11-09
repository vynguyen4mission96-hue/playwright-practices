import {test, expect} from "@playwright/test"
import { checkServerIdentity } from "tls"
//Trong Playwright, request ở đây là một fixture có sẵn.
//thư viện zod
import * as z from "zod"

test ("create new booking", async({request}) => {
       // 1. Chuẩn bị dữ liệu booking mới mà QA muốn gửi lên server
const bookingData = {
    "firstname":"Jim",
    "lastname":"Brown",
    "totalprice":111,
    "depositpaid":true,
    "bookingdates":{
        "checkin":"2018-01-01",
        "checkout":"2019-01-01"
    },
    "additionalneeds":"Breakfast"

}
    // 2. Gửi POST request đến API /booking để yêu cầu server tạo booking mới
    // data: bookingData -> gửi dữ liệu bookingData trong Request Body
const reqs = await request.post('https://restful-booker.herokuapp.com/booking',{data: bookingData});
    // 3. Kiểm tra Status Code: 201 nghĩa là server đã tạo resource thành công
expect(reqs.status()).toBe(200)

 // 4. Đọc Response Body và chuyển JSON thành JavaScript Object
const responseBody= await reqs.json()
 // 5. In Response Body ra console để kiểm tra thông tin booking vừa được tạo
console.log(responseBody)

})
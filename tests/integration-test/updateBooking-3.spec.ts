import { test, expect } from "@playwright/test"

// Import dữ liệu booking
import { bookingData } from "./bookingData"

test("update booking", async ({ request }) => {

    // 1. Get auth token
    const authData = {
        "username": "admin",
        "password": "password123"
    }

    const authReqs = await request.post(
        'https://restful-booker.herokuapp.com/auth',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: authData
        }
    )

    expect(authReqs.status()).toBe(200)

    const authResponseBody = await authReqs.json()

    expect(authResponseBody).toHaveProperty("token")

    // Lấy token từ Auth Response Body
    const token = authResponseBody.token


    // 2. Create new booking
    bookingData.additionalneeds = "Vegan Food"
    const createReqs = await request.post(
        'https://restful-booker.herokuapp.com/booking',
        {
            headers: {
                'Content-Type': 'application/json'
            },
            data: bookingData
        }
    )

    expect(createReqs.status()).toBe(200)

    const createResponseBody = await createReqs.json()

    // Lấy bookingid từ Create Booking Response
    const bookingid = createResponseBody.bookingid

    expect(bookingid).toBeTruthy()


    // 3. Update existing booking
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

    expect(updateReqs.status()).toBe(200)

    const updateResponseBody = await updateReqs.json()

    // 4. Verify updated booking
    expect(updateResponseBody).toEqual(bookingData)

})
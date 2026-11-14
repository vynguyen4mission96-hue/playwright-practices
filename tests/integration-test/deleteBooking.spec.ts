import { test, expect } from "@playwright/test"

test("delete a booking", async ({request})=>{
    const authData={
        "username":"admin",
        "password": "password123"
    }

    const authReqs= await request.post('https://restful-booker.herokuapp.com/auth',
        {
            headers:{
                'Content-Type': 'application/json'
            },
            data: authData
        }
    )
    expect (authReqs.status()).toBe(200)
    const authResponseBody= await authReqs.json()
    const {token} =authResponseBody

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

    const createReqs = await request.post(
        'https://restful-booker.herokuapp.com/booking',{
            headers: {
                'Content-Type':'application/json'
            },
            data: bookingData

        }
    )
    expect(createReqs.status()).toBe(200)
    const createResponseBody =await createReqs.json()
    const {bookingid} = createResponseBody
    expect(bookingid).toBeTruthy()

    const deleteReqs = await request.delete(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            headers: {'Cookie':`token=${token}`}
        }
    )
    expect(deleteReqs.status()).toBe(201)

    const verifyReqs= await request.get(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`
    )
    expect(verifyReqs.status()).toBe(404)


})
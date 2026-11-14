// import { test, expect } from "@playwright/test"
import { test, expect } from "./booking.fixture"
import * as z from "zod";

// Create(POST) Retrieve(GET) Update(PUT/PATCH) Delete(DELETE)

test("get all booking", async ({ request }) => {
    const reps = await request.get('https://restful-booker.herokuapp.com/booking');

    expect(reps.status()).toBe(200);
    const responseBody = await reps.json()
    const bookingSchema = z.object({
        bookingid: z.number,
    })
    const bookingsSchema = z.array(bookingSchema)

    expect(bookingsSchema.parse(responseBody)).toBeTruthy()
})

test("get booking by id", async ({ request,randomBookingId }) => {

    const reps = await request.get(`https://restful-booker.herokuapp.com/booking/${randomBookingId}`)
    expect(reps.status()).toBe(200);
    const responseBody = await reps.json()
    const bookingInfoSchema = z.object({
        firstname: z.string(),
        lastname: z.string(),
        totalprice: z.number(),
        depositpaid: z.boolean(),
        bookingdates: z.object({
            checkin: z.string(),
            checkout: z.string()
        })

    })
    expect(bookingInfoSchema.parse(responseBody)).toBeTruthy()

    //extract json object
    const { firstname, lastname } = responseBody
    console.log(`${firstname} ${lastname}`)
})

test("create new booking", async ({ request }) => {
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
    const reps = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: bookingData
    })
    expect(reps.status()).toBe(200);
    const responseBody = await reps.json()
    const { booking } = responseBody
    expect(booking).toEqual(bookingData)
    expect(responseBody).toHaveProperty("bookingid")
})

test("update booking", async ({ request, authToken }) => {
    // get auth token
    //update booking
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


    // create new booking
    const createReps = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: bookingData
    })
    expect(createReps.status()).toBe(200);
    const createResponseBody = await createReps.json()
    const { bookingid } = createResponseBody

    // update booking info
    bookingData.additionalneeds = "Vegan Food"
    const updateReps = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${authToken}`
        },
        data: bookingData
    })
    expect(updateReps.status()).toBe(200);
    const updateResponseBody = await updateReps.json()
    expect(updateResponseBody).toEqual(bookingData)
})


test("delete a booking", async ({ request }) => {
    // get auth token
    const authData = {
        "username": "admin",
        "password": "password123"
    }
    const authReps = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: authData
    })
    expect(authReps.status()).toBe(200);
    const authResponseBody = await authReps.json()
    const { token } = authResponseBody
    expect(authResponseBody).toHaveProperty("token")
    //update booking
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


    // create new booking
    const createReps = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: bookingData
    })
    expect(createReps.status()).toBe(200);
    const createResponseBody = await createReps.json()
    const { bookingid } = createResponseBody

    // detele booking
    const reps = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
        headers: {
            'Cookie': `token=${token}`
        }
    })
    expect(reps.status()).toBe(201);

    // verify booking is deleted
    const verifyReps = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`)
    expect(verifyReps.status()).toBe(404);
})
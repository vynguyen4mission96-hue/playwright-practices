
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

test("update booking", async ({ request }) => {
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

    // update booking info
    bookingData.additionalneeds = "Vegan Food"
    const updateReps = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingid}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}`
        },
        data: bookingData
    })
    expect(updateReps.status()).toBe(200);
    const updateResponseBody = await updateReps.json()
    expect(updateResponseBody).toEqual(bookingData)
})



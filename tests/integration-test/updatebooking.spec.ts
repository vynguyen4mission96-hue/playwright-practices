import {test, expect} from "@playwright/test"
import { checkServerIdentity } from "tls"
//Trong Playwright, request ở đây là một fixture có sẵn.
//thư viện zod
import * as z from "zod"
//import data
import { bookingData } from "./bookingData"


test ("update booking", async({request}) => {
    //get auth token
    const authData={
        "username":"admin",
        "password":"password123"
    }
    const authReqs = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: authData
    })
    expect(authReqs.status()).toBe(200)
    const authResponseBody= await authReqs.json()
    expect(authResponseBody).toHaveProperty("token")

    const token =authResponseBody.token
    //create new booking
    const reqs = await request.put('https://restful-booker.herokuapp.com/booking',{
        headers:{
            'Content-Type': 'application/json',
            'Cookie':`token=${token}`
        },
        //gọi từ file "bookingData.ts"
        data: bookingData
    });
    expect(reqs.status()).toBe(200)
    const updateResponseBody = await reqs.json()
    const { booking } = updateResponseBody
    expect(booking).toEqual(bookingData)
    expect(updateResponseBody).toHaveProperty("bookingid")
    
})

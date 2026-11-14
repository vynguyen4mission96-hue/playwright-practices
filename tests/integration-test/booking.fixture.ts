import {test as base} from '@playwright/test'
// type BookingFixture ={
//     getToken:() => Promise<string>  ,
//     createBooking:() => Promise<string> , 
//     updatebooking:() => Promise<string>  ,
//     deleteBooking:() => Promise<string>  ,
//     getRandomBookingId:() => Promise<string>  ,
//     getAllBookings:() => Promise<string>  ,
//     getBookingById:() => Promise<string>  ,
//     BookingData:() => Promise<string>  ,

// }
type BookingFixture = {
    authToken: () => Promise<string>,
    randomBookingId: () => Promise<string>,
    
    
}


export const test = base.extend<BookingFixture>({
    authToken: async ({ request }, use) => {
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
        const responseBody = await authReps.json()
        const { token } = responseBody
        await use(token)
    },
    randomBookingId: async ({ request }, use) => {
        const allBookingRes = await request.get('https://restful-booker.herokuapp.com/booking');
        const allBookingIds = await allBookingRes.json()
        const bookingID = allBookingIds[Math.floor(Math.random() * allBookingIds.length)].bookingid
        await use(bookingID)
    }
})

export { expect } from '@playwright/test';

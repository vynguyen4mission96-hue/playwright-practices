//tự viết
import {test, expect} from './fixtures/forgotpassword.fixture'

test('verify forgot password form submits', async({forgotPasswordPage})=>
{   test.setTimeout(60000);
    await forgotPasswordPage.open()
    await forgotPasswordPage.forgotPassword('test@example.com')

})
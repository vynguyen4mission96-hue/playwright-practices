//tự viết
import {test, expect} from './fixtures/bmi.fixture';

//data-driven for test case
// Data-driven test for BMI calculation with different age, 
// gender, height, and weight combinations to verify 8 classifications of BMI results (
// Severe thinness, Moderate thinness,
// Mild thinness,
// Normal,
// Overweight,
// Obese Class I,
// Obese Class II, Obese Class III)
[
    {age: '25', gender:'Male', height:'180', weight:'75', expectBMI:'BMI = 23.1 kg/m2 (Normal)'},
    {age: '25', gender:'Female', height:'180', weight:'40', expectBMI:'BMI = 12.3 kg/m2   (Severe thinness)'},

].forEach(({age, gender, height, weight, expectBMI})=>{

    //xài dấu `   `
    //viết dấu cho đúng
test (`expert bmi=${expectBMI} with ${age}, ${gender}, ${height}, ${weight}`, async({bmiPage})=>{
    test.setTimeout(60000);
    await bmiPage.open()
    await bmiPage.selectorMetricUnits()
    //xóa cái selection trước đó
    //do run lặp đi lặp lại
    await bmiPage.clearForm()
    await bmiPage.calculateBMI(age, gender, height, weight)
    //toHaveText normalize whitespace (incl. non-breaking spaces) and auto-retries
    // toHaveText() chuẩn hóa khoảng trắng (kể cả NBSP) 
    // và tự động thử lại assertion cho đến khi Pass hoặc hết timeout.
    const bmiResult =await bmiPage.getBMIResult()
    await expect (bmiResult).toHaveText(expectBMI)
})
})
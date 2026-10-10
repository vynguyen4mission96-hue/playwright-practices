// ============================================================
// IMPORT
// ============================================================

// Tự viết import để sử dụng test và expect của Playwright.
// test  → dùng để định nghĩa một test case.
// expect → dùng để kiểm tra (assertion) kết quả có đúng như mong đợi hay không.
import { test, expect } from '@playwright/test';


// ============================================================
// TEST CASE 1
// ============================================================

test('1.verify max due person name', async ({ page }) => {

    // Tăng thời gian tối đa của RIÊNG test này từ 30 giây lên 60 giây.
    //
    // test.setTimeout(60000)
    // 60000 milliseconds = 60 seconds.
    //
    // Có thể cấu hình timeout chung trong playwright.config.ts,
    // nhưng ở đây chỉ muốn áp dụng cho test này.
    test.setTimeout(60000);


    // page.goto() = mở một URL trên browser.
    //
    // await:
    // Chờ cho thao tác page.goto() hoàn thành rồi mới chạy dòng tiếp theo.
    //
    // URL này chứa các Web Table mà chúng ta đang test.
    await page.goto('https://the-internet.herokuapp.com/tables');



    // ========================================================
    // 1. LẤY TẤT CẢ CÁC CELL TRONG TABLE
    // ========================================================

    // page.locator('#table1')
    //
    // Tìm element có id="table1".
    //
    // #table1 là CSS selector:
    // # = tìm theo id
    // table1 = giá trị của id
    //
    // Sau đó:
    //
    // .getByRole('cell')
    //
    // Tìm các cell (ô) trong table.
    //
    // Role "cell" thường tương ứng với các ô dữ liệu <td>.
    //
    // Kết quả của locator này có thể chứa NHIỀU cell.
    await page.locator('#table1').getByRole('cell')


        // ====================================================
        // evaluateAll()
        // ====================================================
        //
        // .evaluateAll() cho phép chúng ta chạy JavaScript
        // trên TẤT CẢ các element mà locator tìm được.
        //
        // Ở đây locator tìm được nhiều cell.
        //
        // evaluateAll((cells) => ...)
        //
        // cells = một ARRAY chứa các DOM element mà locator
        // đã tìm được.
        //
        // Ví dụ nếu table có 20 cell:
        //
        // cells = [
        //     cell1,
        //     cell2,
        //     cell3,
        //     ...
        //     cell20
        // ]
        //
        // Đây là JavaScript chạy trong context của browser,
        // để chúng ta có thể đọc trực tiếp DOM element.
        .evaluateAll((cells) =>


            // =================================================
            // map()
            // =================================================
            //
            // cells.map(...)
            //
            // map() dùng để:
            //
            // "Đi qua TỪNG phần tử trong array
            //  và tạo ra một array mới."
            //
            // Nếu:
            //
            // cells = [cell1, cell2, cell3]
            //
            // thì map() sẽ lần lượt xử lý:
            //
            // cell1
            // cell2
            // cell3
            //
            // và trả về một array mới.
            //
            // -------------------------------------------------
            //
            // (cells) => ...
            //
            // Đây là arrow function.
            //
            // cells bên trong:
            // là MỘT cell hiện tại mà map() đang xử lý.
            //
            // Lưu ý:
            //
            // evaluateAll((cells) => cells.map((cells) => ...))
            //
            // có 2 chữ "cells" nhưng chúng KHÔNG phải cùng một
            // thứ.
            //
            // cells bên ngoài:
            //     → toàn bộ array các cell
            //
            // cells bên trong map():
            //     → một cell riêng lẻ
            //
            // Để dễ hiểu hơn, có thể đặt tên:
            //
            // evaluateAll((cells) =>
            //     cells.map((cell) => ...)
            // )
            //
            // Cách này dễ đọc hơn.
            cells.map((cells) =>


                // =================================================
                // textContent
                // =================================================
                //
                // cells.textContent
                //
                // Lấy nội dung text của cell đó.
                //
                // Ví dụ:
                //
                // <td>Jason</td>
                //
                // thì:
                //
                // cells.textContent
                //
                // sẽ lấy:
                //
                // "Jason"
                //
                // Kết quả của map() sẽ trở thành một array string.
                //
                // Ví dụ:
                //
                // [
                //     "Smith",
                //     "John",
                //     "jsmith@gmail.com",
                //     "$50.00",
                //     ...
                // ]
                cells.textContent

            )
        )

        // ====================================================
        // then()
        // ====================================================
        //
        // evaluateAll() trả về một Promise.
        //
        // .then() được thực hiện SAU KHI evaluateAll()
        // hoàn thành.
        //
        // cellTexts là kết quả mà evaluateAll() trả về.
        //
        // Ví dụ:
        //
        // cellTexts = [
        //     "Smith",
        //     "John",
        //     "$50.00",
        //     ...
        // ]
        //
        // Sau đó console.log() để xem kết quả.
        .then((cellTexts) => {
            console.log(cellTexts);
        });



    // ========================================================
    // 2. LẤY RIÊNG CỘT DUE
    // ========================================================

    // XPath:
    //
    // //tbody
    // → phần body của table
    //
    // /tr
    // → các row
    //
    // /td[4]
    // → td thứ 4 của mỗi row
    //
    // Vì có nhiều tr nên XPath này lấy:
    //
    // td thứ 4 của row 1
    // td thứ 4 của row 2
    // td thứ 4 của row 3
    // ...
    //
    // => nhìn vào bảng sẽ tương đương với việc lấy CỘT 4.
    await page.locator('#table1').locator('//tbody/tr/td[4]')


        // evaluateAll() vì locator trên tìm được NHIỀU <td>.
        //
        // cells = array chứa tất cả các <td> thứ 4.
        .evaluateAll((cells) =>


            // map() đi qua từng <td>.
            //
            // Mỗi lần map xử lý một cell.
            cells.map((cells) =>


                // Lấy text bên trong từng <td>.
                //
                // Ví dụ:
                //
                // <td>$50.00</td>
                //
                // → "$50.00"
                cells.textContent

            )
        )

        // In array ra console.
        .then((cellTexts) => {
            console.log(cellTexts);
        });



    // ========================================================
    // 3. THỬ REMOVE KÝ TỰ $
    // ========================================================

    await page.locator('#table1').locator('//tbody/tr/td[4]')

        // Lấy tất cả các cell thứ 4.
        .evaluateAll((cells) =>

            // Đi qua từng cell.
            cells.map((cells) =>

                // Lấy text.
                //
                // Ví dụ:
                // "$50.00"
                //
                // rồi:
                //
                // .replace('$', '')
                //
                // xóa ký tự "$".
                //
                // "$50.00"
                //      ↓
                // "50.00"
                cells.textContent.replace('$', '')

            )
        )

        .then((cellTexts) => {
            console.log(cellTexts);
        });



    // ========================================================
    // 4. DÙNG parseFloat()
    // ========================================================

    // parseFloat():
    //
    // nhận một STRING chứa số
    // và chuyển thành NUMBER dạng số thực.
    //
    // Ví dụ:
    //
    // parseFloat("50.00")
    //
    // → 50
    //
    // Trước khi parseFloat(), phải bỏ "$":
    //
    // "$50.00"
    //     ↓
    // "50.00"
    //     ↓
    // parseFloat()
    //     ↓
    // 50
    await page.locator('#table1').locator('//tbody/tr/td[4]')

        .evaluateAll((cells) =>

            cells.map((cells) =>

                parseFloat(
                    cells.textContent.replace('$', '')
                )

            )
        )

        .then((cellTexts) => {
            console.log(cellTexts);
        });



    // ========================================================
    // 5. LƯU DUE COLUMN VÀO BIẾN
    // ========================================================

    // const dueColumn =
    //
    // Tạo một biến tên là dueColumn.
    //
    // dueColumn sẽ chứa kết quả của evaluateAll().
    //
    // Kết quả cuối cùng sẽ là một ARRAY NUMBER.
    //
    // Ví dụ:
    //
    // dueColumn = [
    //     50,
    //     51,
    //     100,
    //     200
    // ]
    //
    // Đây không còn là string "$50.00" nữa.
    // Chúng đã được chuyển thành number.
    const dueColumn = await page.locator('#table1').locator('//tbody/tr/td[4]')

        .evaluateAll((cells) =>

            cells.map((cells) =>

                parseFloat(
                    cells.textContent.replace('$', '')
                )

            )
        );


    // In toàn bộ Due column.
    console.log('Due column values:', dueColumn);



    // ========================================================
    // 6. TÌM GIÁ TRỊ DUE LỚN NHẤT
    // ========================================================

    // Math.max()
    //
    // Dùng để tìm số lớn nhất.
    //
    // Ví dụ:
    //
    // Math.max(10, 20, 30)
    //
    // → 30
    //
    // Nhưng dueColumn là một ARRAY:
    //
    // [50, 51, 100, 200]
    //
    // Math.max() không nhận array trực tiếp theo cách này:
    //
    // Math.max([50, 51, 100, 200])
    //
    // Vì vậy dùng spread operator: ...
    //
    // ...dueColumn
    //
    // sẽ "trải" array ra:
    //
    // [50, 51, 100, 200]
    //
    // thành:
    //
    // 50, 51, 100, 200
    //
    // Vì vậy:
    //
    // Math.max(...dueColumn)
    //
    // tương đương:
    //
    // Math.max(50, 51, 100, 200)
    const maxDueValue = Math.max(...dueColumn);


    console.log('Max due values:', maxDueValue);



    // ========================================================
    // 7. TÌM INDEX CỦA MAX DUE
    // ========================================================

    // indexOf()
    //
    // Dùng để tìm vị trí (index) của một giá trị trong array.
    //
    // Ví dụ:
    //
    // dueColumn:
    //
    // [50, 51, 100, 200]
    //
    // index:
    //   0   1   2    3
    //
    // dueColumn.indexOf(200)
    //
    // → 3
    //
    // JavaScript ARRAY bắt đầu index từ 0.
    const maxDueindex = dueColumn.indexOf(maxDueValue);


    console.log('Max due index:', maxDueindex);



    // ========================================================
    // 8. TÌM LAST NAME CỦA NGƯỜI CÓ MAX DUE
    // ========================================================

    // maxDueindex là index của JavaScript ARRAY.
    //
    // JavaScript:
    //
    // index 0 → người thứ 1
    // index 1 → người thứ 2
    // index 2 → người thứ 3
    //
    // Nhưng XPath:
    //
    // tr[1] → row thứ 1
    // tr[2] → row thứ 2
    // tr[3] → row thứ 3
    //
    // XPath position bắt đầu từ 1.
    //
    // Vì vậy phải:
    //
    // maxDueindex + 1
    //
    // để chuyển:
    //
    // JavaScript index
    //        ↓
    // XPath position
    //
    // Ví dụ:
    //
    // maxDueindex = 3
    //
    // 3 + 1 = 4
    //
    // → //tbody/tr[4]
    //
    // Sau đó:
    //
    // /td[1]
    //
    // → lấy Last Name.
    const lastName = await page
        .locator('#table1')
        .locator(`//tbody/tr[${maxDueindex + 1}]/td[1]`)
        .textContent();



    // ========================================================
    // 9. TÌM FIRST NAME
    // ========================================================

    // Tương tự như Last Name.
    //
    // Nhưng:
    //
    // /td[2]
    //
    // nghĩa là lấy ô thứ 2 trong row.
    //
    // Theo bảng:
    //
    // td[1] → Last Name
    // td[2] → First Name
    // td[3] → Email
    // td[4] → Due
    const firstName = await page
        .locator('#table1')
        .locator(`//tbody/tr[${maxDueindex + 1}]/td[2]`)
        .textContent();



    console.log(
        'name of person with max due:',
        firstName,
        lastName
    );



    // ========================================================
    // 10. ASSERTION
    // ========================================================

    // `${firstName} ${lastName}`
    //
    // Đây là TEMPLATE LITERAL.
    //
    // Dấu:
    //
    // `
    //
    // là backtick, không phải dấu nháy đơn '.
    //
    // ${firstName}
    //     ↓
    // chèn giá trị của biến firstName.
    //
    // ${lastName}
    //     ↓
    // chèn giá trị của biến lastName.
    //
    // Ví dụ:
    //
    // firstName = "Jason"
    // lastName = "Doe"
    //
    // thì:
    //
    // `${firstName} ${lastName}`
    //
    // → "Jason Doe"
    //
    // --------------------------------------------------------
    //
    // LƯU Ý:
    //
    // toBe() phù hợp để so sánh giá trị đơn giản:
    //
    // expect("Jason Doe").toBe("Jason Doe")
    //
    // Nhưng nếu muốn so sánh ARRAY với ARRAY theo nội dung,
    // nên dùng toStrictEqual().
    //
    // Vì vậy dòng dưới đây:
    //
    // expect(`${firstName} ${lastName}`).toBe(['Jason Doe'])
    //
    // KHÔNG ĐÚNG.
    //
    // Bên trái là STRING:
    //
    // "Jason Doe"
    //
    // Bên phải là ARRAY:
    //
    // ["Jason Doe"]
    //
    // Hai kiểu dữ liệu khác nhau.
    //
    // Nếu muốn kiểm tra string:
    //
    // expect(`${firstName} ${lastName}`).toBe('Jason Doe');
    expect(`${firstName} ${lastName}`).toBe('Jason Doe');

});



// ============================================================
// TEST CASE 2
// ============================================================

test('2.Find person with maximum due', async ({ page }) => {

    // Tăng timeout riêng của test này lên 60 giây.
    test.setTimeout(60000);


    // Mở trang Web Tables.
    await page.goto('https://the-internet.herokuapp.com/tables');



    // ========================================================
    // 1. LẤY TẤT CẢ CÁC ROW
    // ========================================================

    // #table1
    //     → table có id="table1"
    //
    // //tbody/tr
    //     → tất cả các <tr> nằm trong <tbody>
    //
    // .all()
    //
    // Lấy tất cả các element mà locator tìm được
    // và trả về một ARRAY các Locator.
    //
    // Ví dụ:
    //
    // rows = [
    //     row1,
    //     row2,
    //     row3,
    //     ...
    // ]
    //
    // Mỗi row đại diện cho một <tr>.
    const rows = await page
        .locator('#table1')
        .locator('//tbody/tr')
        .all();



    // ========================================================
    // 2. TẠO ARRAY person
    // ========================================================

    // person là array dùng để lưu thông tin của nhiều người.
    //
    // Ban đầu:
    //
    // person = []
    //
    // Sau mỗi vòng lặp, chúng ta sẽ push thêm một object.
    //
    // Cuối cùng có thể thành:
    //
    // [
    //     {
    //         firstName: "Jason",
    //         lastName: "Doe",
    //         due: 100
    //     },
    //
    //     {
    //         firstName: "Frank",
    //         lastName: "Bach",
    //         due: 51
    //     }
    // ]
    let person = [];



    // ========================================================
    // 3. for...of
    // ========================================================

    // for...of dùng để duyệt từng phần tử trong ARRAY.
    //
    // rows là array chứa nhiều row.
    //
    // Mỗi vòng lặp:
    //
    // row = một row hiện tại.
    //
    // Ví dụ:
    //
    // vòng 1 → row = row1
    // vòng 2 → row = row2
    // vòng 3 → row = row3
    //
    for (const row of rows) {



        // ====================================================
        // 4. LẤY LAST NAME
        // ====================================================

        // row.locator('td')
        //
        // tìm các <td> bên trong row.
        //
        // .nth(0)
        //
        // lấy phần tử có index 0.
        //
        // Vì index của Playwright nth() bắt đầu từ 0:
        //
        // nth(0) → td thứ 1
        // nth(1) → td thứ 2
        // nth(2) → td thứ 3
        // nth(3) → td thứ 4
        //
        // .textContent()
        //
        // lấy text bên trong cell.
        const lastname = await row
            .locator('td')
            .nth(0)
            .textContent();



        // ====================================================
        // 5. LẤY FIRST NAME
        // ====================================================

        const firstname = await row
            .locator('td')
            .nth(1)
            .textContent();



        // ====================================================
        // 6. LẤY DUE
        // ====================================================

        // nth(3)
        //     → td thứ 4.
        //
        // textContent()
        //     → lấy text.
        //
        // textContent() có thể trả về:
        //
        // string
        // hoặc
        // null
        //
        // Vì vậy dùng:
        //
        // ?? ''
        //
        // Nếu due không phải null:
        //
        //     dùng giá trị due.
        //
        // Nếu due là null:
        //
        //     dùng chuỗi rỗng ''.
        //
        // Ví dụ:
        //
        // "$50.00" ?? ''
        //
        // → "$50.00"
        //
        // null ?? ''
        //
        // → ''
        const due =
            (await row.locator('td').nth(3).textContent()) ?? '';



        // ====================================================
        // 7. push()
        // ====================================================

        // person.push(...)
        //
        // push() dùng để THÊM một phần tử vào cuối ARRAY.
        //
        // Ban đầu:
        //
        // person = []
        //
        // Sau người thứ nhất:
        //
        // person = [
        //     {...}
        // ]
        //
        // Sau người thứ hai:
        //
        // person = [
        //     {...},
        //     {...}
        // ]
        //
        // Object được thêm vào có 3 property:
        //
        // firstName
        // lastName
        // due
        person.push({

            // Lưu first name vào property firstName.
            "firstName": firstname,

            // Lưu last name vào property lastName.
            "lastName": lastname,


            // Lưu Due vào property due.
            //
            // due.replace('$', '')
            //
            // bỏ ký tự "$".
            //
            // "$50.00"
            //     ↓
            // "50.00"
            //
            // parseFloat()
            //
            // chuyển:
            //
            // "50.00"
            //
            // thành:
            //
            // 50
            //
            // Cuối cùng property due chứa NUMBER,
            // không phải STRING.
            "due": parseFloat(
                due.replace('$', '')
            )
        });

    }


    // In toàn bộ array person.
    //
    // Sau vòng for...of:
    //
    // person có dữ liệu của tất cả người.
    console.log(person);



    // ========================================================
    // 8. LẤY RIÊNG CÁC DUE VALUE
    // ========================================================

    // person hiện tại có dạng:
    //
    // [
    //     {
    //         firstName: "Jason",
    //         lastName: "Doe",
    //         due: 100
    //     },
    //     {
    //         firstName: "Frank",
    //         lastName: "Bach",
    //         due: 51
    //     }
    // ]
    //
    // Chúng ta chỉ muốn lấy:
    //
    // [
    //     100,
    //     51
    // ]
    //
    // Vì vậy dùng map().
    //
    // person.map(...)
    //
    // = đi qua từng object person
    //   và lấy property due.
    const dueValue = person.map(

        // person ở đây là MỘT object person hiện tại.
        //
        // person.due
        //
        // lấy giá trị due của object đó.
        //
        // Ví dụ:
        //
        // { firstName: "Jason", due: 100 }
        //
        // → 100
        person => person.due
    );



    // Sau map():
    //
    // dueValue có thể là:
    //
    // [100, 51, 100, 50]
    console.log('Due values:', dueValue);



    // ========================================================
    // 9. TÌM MAX DUE
    // ========================================================

    // ...dueValue
    //
    // spread operator.
    //
    // Nếu:
    //
    // dueValue = [100, 51, 100, 50]
    //
    // thì:
    //
    // ...dueValue
    //
    // sẽ trở thành:
    //
    // 100, 51, 100, 50
    //
    // Vì vậy:
    //
    // Math.max(...dueValue)
    //
    // tương đương:
    //
    // Math.max(100, 51, 100, 50)
    //
    // → 100
    const maxDueValue = Math.max(...dueValue);


    console.log('Max due value:', maxDueValue);



    // ========================================================
    // 10. TÌM PERSON CÓ MAX DUE
    // ========================================================

    // filter()
    //
    // filter() dùng để:
    //
    // "lọc array và giữ lại những phần tử
    //  thỏa mãn điều kiện."
    //
    // person.filter(...)
    //
    // sẽ kiểm tra TỪNG object person.
    //
    // person => person.due == maxDueValue
    //
    // nghĩa là:
    //
    // lấy due của người hiện tại
    // và kiểm tra nó có bằng maxDueValue hay không.
    //
    // Nếu TRUE:
    //     giữ người đó lại.
    //
    // Nếu FALSE:
    //     bỏ người đó.
    //
    // --------------------------------------------------------
    //
    // Ví dụ:
    //
    // person:
    //
    // [
    //     { name: "A", due: 100 },
    //     { name: "B", due: 50 },
    //     { name: "C", due: 100 }
    // ]
    //
    // maxDueValue = 100
    //
    // filter():
    //
    // A → 100 == 100 → TRUE → giữ
    // B → 50  == 100 → FALSE → bỏ
    // C → 100 == 100 → TRUE → giữ
    //
    // Kết quả:
    //
    // [
    //     { name: "A", due: 100 },
    //     { name: "C", due: 100 }
    // ]
    //
    // Đây chính là lý do filter() có thể xử lý
    // trường hợp CÓ NHIỀU NGƯỜI cùng có max Due.
    const maxDuePerson = person.filter(
        person => person.due == maxDueValue
    );


    console.log('Max due persons:', maxDuePerson);



    // ========================================================
    // 11. LẤY FULL NAME CỦA NHỮNG NGƯỜI CÓ MAX DUE
    // ========================================================

    // maxDuePerson hiện tại là ARRAY.
    //
    // Ví dụ:
    //
    // [
    //     {
    //         firstName: "Jason",
    //         lastName: "Doe",
    //         due: 100
    //     }
    // ]
    //
    // Chúng ta muốn:
    //
    // [
    //     "Jason Doe"
    // ]
    //
    // Vì vậy tiếp tục dùng map().
    const maxDuePersonFullname = maxDuePerson.map(

        // person là một object trong maxDuePerson.
        //
        // `${person.firstName} ${person.lastName}`
        //
        // là template literal.
        //
        // Ví dụ:
        //
        // person.firstName = "Jason"
        // person.lastName = "Doe"
        //
        // kết quả:
        //
        // "Jason Doe"
        person => `${person.firstName} ${person.lastName}`
    );


    console.log('Max due person fullname:', maxDuePersonFullname);



    // ========================================================
    // 12. ASSERTION
    // ========================================================

    // toStrictEqual()
    //
    // dùng để so sánh giá trị một cách chặt chẽ.
    //
    // Ở đây:
    //
    // maxDuePersonFullname
    //
    // là ARRAY:
    //
    // ["Jason Doe"]
    //
    // nên expected cũng phải là ARRAY:
    //
    // ["Jason Doe"]
    //
    // Nếu giống nhau:
    //
    // TEST PASS
    //
    // Nếu khác:
    //
    // TEST FAIL.
    expect(maxDuePersonFullname).toStrictEqual(['Jason Doe']);

});
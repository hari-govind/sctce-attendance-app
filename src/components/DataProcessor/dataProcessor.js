import cheerio from 'react-native-cheerio';
const RCTNetworking = require('RCTNetworking');

export async function getSummaryJSON(username, password) {
    return new Promise((resolve, reject) => {
        controller.getAttendance(username, password)
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                console.log("Error : ", err);
            })
    })
}

export async function getDetailsJSON(username, password) {
    RCTNetworking.clearCookies(() => { });
    return new Promise((resolve, reject) => {
        controller.getDetailedMetadata(username, password)
            .then(metadata => {
                controller.getCombinedAttendance(username, password, metadata)
                    .then(json => {
                        resolve(json)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    })
}

export async function isValidLogin(username, password) {
    RCTNetworking.clearCookies(() => { });
    return new Promise((resolve, reject) => {
        controller.isValidLogin(username, password)
            .then((result) => {
                resolve(result);
            })
    })
}


var controller = {
    getAuthorizationCookie: function (registerNumber, password) {
        /**
         * Cookies are automatically handled in fetch for React Native, but manually needs to be received 
         * and set for node-fetch Node.js. Node-fetch related code are commented out. Incase of of React Native,
         * We'll resolve a true after first login.
         */
        return new Promise((resolve, reject) => {
            url = 'https://sctce.etlab.in/user/login';
            fetch(url,
                {
                    method: 'POST',
                    'credentials': 'include',
                    headers: {
                        Connection: 'keep-alive',
                        Host: 'sctce.etlab.in',
                        Origin: 'https://sctce.etlab.in',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Referer: 'https://sctce.etlab.in/user/login',
                        'Upgrade-Insecure-Requests': '1',
                    },
                    body: `LoginForm%5Busername%5D=${registerNumber}&LoginForm%5Bpassword%5D=${password}&yt0=`,

                })
                .then((response) => {
                    //for node-js
                    //let cookie = response.headers.get('set-cookie').split(';')[0];
                    resolve('cookie'); //dummy cookie
                })
                .catch(error => { reject(error) });
        })
    },
    isValidLogin: async function (username, password) {
        return new Promise((resolve, reject) => {
            controller.getAuthorizationCookie(username, password)
                .then((cookie) => {
                    fetch('https://sctce.etlab.in/user/todo', {
                        method: 'GET',
                        credentials: 'include', //takes care of cookies in RN fetch
                        headers: {
                            //Cookie: cookie, //Not needed for React Native fetch
                            Host: 'sctce.etlab.in'
                        }
                    })
                        .then((response) => {
                            return response.text()
                        })
                        .then((html) => {
                            let $ = cheerio.load(html);
                            title = $("title").text().trim();
                            if (title === "etlab | To Do")
                                resolve(true);
                            else
                                resolve(false);
                        })
                })
                .catch(error => { reject(error) });
        })
    },
    getAttendanceHTML: async function (registerNumber, password) {
        RCTNetworking.clearCookies(() => { });
        return new Promise((resolve, reject) => {
            controller.getAuthorizationCookie(registerNumber, password)
                .then((cookie) => {
                    fetch('https://sctce.etlab.in/student/results', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            Host: 'sctce.etlab.in',
                        }
                    })
                        .then((result) => {
                            return result.text();
                        })
                        .then(attendancePage => {
                            let $ = cheerio.load(attendancePage);
                            return $(".widget-box:nth-child(5) .widget-content > div:nth-child(3)").html();
                        })
                        .then((attendanceTable) => {
                            resolve(attendanceTable);
                        })

                })
                .catch(error => reject(error))
        })
    },
    getAttendanceJSON: async function (html) {
        return new Promise((resolve, reject) => {
            data = {};
            attendanceSubjects = [];
            let $ = cheerio.load(html);
            rows = $("table").find("tr");
            rows.each((i, row) => {
                if (!(($(row).children("td:nth-child(3)").text().trim() == 'N/A') || ($(row).children("td:nth-child(1)").text().trim() == "") || ($(row).children("td:nth-child(1)").text().trim() == "Subject Code"))) {
                    let attendance = {
                        subjectCode: $(row).children("td:nth-child(1)").text().trim(),
                        subject: $(row).children("td:nth-child(2)").text().trim(), //subjectName
                        percentage: $(row).children("td:nth-child(4)").text().trim(),
                        totalClass: Number($(row).children("td:nth-child(3)").text().trim().split('/')[1]),
                        totalPresent: Number($(row).children("td:nth-child(3)").text().trim().split('/')[0])
                    }
                    toAttend = Math.ceil(((attendance['totalClass'] * 0.75) - attendance['totalPresent']) / 0.25);
                    if (toAttend > 0) {
                        if (toAttend > 1)
                            attendance['calculatedClass'] = `You need to attend next ${toAttend} classes.`;
                        else
                            attendance['calculatedClass'] = "You Need to attend the next 1 class.";
                    } else if (toAttend === 0) {
                        attendance['calculatedClass'] = "Perfectly balanced, but you can't miss the next class.";
                    } else {
                        canMiss = Math.floor((attendance['totalPresent'] - 0.75 * attendance['totalClass']) / 0.75);
                        if (canMiss > 1)
                            attendance['calculatedClass'] = `You can miss next ${canMiss} classes.`;
                        else
                            attendance['calculatedClass'] = "You can miss the next 1 class.";
                    }
                    percentage = attendance['percentage'];
                    if (percentage >= "85%" || percentage === "100%") {
                        attendance['status'] = "Excellent";
                    } else if (percentage >= "75%") {
                        attendance['status'] = "Good";
                    } else {
                        attendance['status'] = "Try to improve";
                    }
                    attendanceSubjects.push(attendance);
                }
                data['Summary'] = attendanceSubjects;
            })
            resolve(data);
        })
    },
    getStudentData: async function (username, password) {
        return new Promise((resolve, reject) => {
            controller.getAuthorizationCookie(username, password)
                .then((cookie) => {
                    fetch('https://sctce.etlab.in/ktuacademics/student/viewattendancesubjectdutyleave/20',
                        {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                Host: 'sctce.etlab.in'
                            }
                        },
                    )
                        .then((response) => {
                            return response.text();
                        })
                        .then((html) => {
                            let $ = cheerio.load(html);
                            topicIndex = {};
                            $("table th").each((index, heading) => {
                                index = index + 1;
                                switch ($(heading).text().trim()) {
                                    case ("Duty Leave"):
                                        topicIndex['Duty Leave Hours'] = index;
                                        break;
                                    case ("Percentage"):
                                        topicIndex['Overall Attendance'] = index;
                                        break;
                                    case ("Duty Leave Percentage"):
                                        topicIndex['Duty Leave Percentage'] = index;
                                        break;
                                }
                            })
                            Overall = [];
                            for (const [key, value] of Object.entries
                                (topicIndex)) {
                                currentOverall = {};
                                currentOverall['key'] = key;
                                currentOverall['percentage'] = $(`table td:nth-child(${value})`).text().trim();
                                Overall.push(currentOverall);
                            }
                            Student = {}
                            Student['Name'] = $("table td:nth-child(3)").text().trim()
                            Student['Branch'] = $("table td:nth-child(1)").text().trim()
                            Student['RollNumber'] = $("table td:nth-child(2)").text().trim()
                            data = { Student: Student, Overall: Overall }
                            resolve(data);
                        })
                })
        })
    },
    getAttendance: async function (username, password) {
        return new Promise((resolve, reject) => {
            controller.getAttendanceHTML(username, password)
                .then((html) => { return controller.getAttendanceJSON(html) })
                .then(attendanceJSON => { return attendanceJSON })
                .then((attendance) => {
                    controller.getStudentData(username, password)
                        .then((studentData) => {
                            attendance['Student'] = studentData['Student'];
                            attendance['Overall'] = studentData['Overall'];
                            resolve(attendance);
                        })
                })
                .catch(error => { reject(error) })
        })
    },
    getHTML: async function (url) {
        return new Promise((resolve, reject) => {
            request(url, function (error, response, html) {
                if (!error) {
                    resolve(html);
                }
            })
        })
    },
    getBooksData: function (query) {
        return new Promise((resolve, reject) => {
            url = `http://sctce.libsoft.org/qs.php?page=1&data=${query}&select=5000`;
            controller.getHTML(url)
                .then((raw_html) => {
                    var $ = cheerio.load(raw_html);
                    var BooksData = {};
                    var books = [];
                    $("tr#tdfirst").each(function () {
                        $currentRow = $(this);
                        var Title = $currentRow.first().children().eq(0).text().trim();
                        var Author = $currentRow.first().children().eq(1).text().trim();
                        var Copies = $currentRow.first().children().eq(2).text().trim();
                        var book = {};
                        book['Title'] = Title;
                        book['Author'] = Author;
                        book['Copies'] = Copies;
                        books.push(book);
                    })
                    resolve(books);
                })
        })
    },
    getResponseHTML: function (username, password) {
        return new Promise((resolve, reject) => {
            fetch('http://www.campusoftonline.com/atten/checklogin.php', {
                method: 'POST',
                body: `userid=${username}&mypassword=${password}&submit=Login`, headers: {
                    Connection: 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(function (data) {
                    return data.text()
                })
                .then(function (html) {
                    resolve(html)
                })
                .catch((err) => {
                    resolve('Error')
                })
        })
    },
    getDetailedMetadata: function (username, password) {
        return new Promise((resolve, reject) => {
            controller.getAuthorizationCookie(username, password)
                .then((cookie) => {
                    fetch('https://sctce.etlab.in/ktuacademics/student/attendance', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            //Cookie: cookie
                        }
                    })
                        .then(response => { return response.text() })
                        .then(html => {
                            let $ = cheerio.load(html);
                            let semester = $("#semester").val();
                            let year = $('#year').val();
                            let months = new Array();
                            $("#month > option").each((i, e) => { months.push($(e).val()) });
                            let metadata = { Sem: semester, Year: year, Months: months };
                            resolve(metadata);
                        })
                })
        })
    },
    getDetailedJSON: function (html, payload) {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(html);
            let result = [];
            let month = payload['month'];
            let year = payload['year'];
            $("#itsthetable tr").each((i, row) => {
                cells = $(row).children("td").length
                if (cells === 6) {
                    day = $(row).children("th").html().split('<', 1)[0].trim()
                    day = day.length === 1 ? '0' + day : day;
                    date = year + '-' + month + '-' + day;
                    periods = [];
                    let isEmpty = true;
                    let AbNumHrs = 0;
                    let PrNumHrs = 0;
                    $(row).children("td").each((i, period) => {
                        let currentDay = {}
                        if ($(period).text().trim() !== '') {
                            subjectName = $(period).html().split('<s', 1)[0].split('>', 2)[1].replace('&amp;', '&').trim()
                            if ($(period).hasClass("absent")) {
                                status = "A";
                                AbNumHrs++;
                            } else {
                                status = "P";
                                PrNumHrs++;
                            }
                            id = i + 1;
                            teacher = '';
                            isEmpty = false;
                        } else {
                            subjectName = '';
                            status = '-';
                            teacher = '';
                            id = i + 1;
                        }
                        currentDay['Subject'] = subjectName;
                        currentDay['ID'] = id;
                        currentDay['Status'] = status;
                        currentDay['Teacher'] = ' ';
                        periods.push(currentDay)
                    })
                    if (!isEmpty)
                        result.push({ 'Date': date, 'Periods': periods, 'AbNumHours': AbNumHrs, 'PrNumHours': PrNumHrs })
                }
            })
            resolve(result);
        })
            .catch((err) => { reject(err) })
    },
    getCombinedAttendance: function (username, password, metadata) {
        let url = "https://sctce.etlab.in/ktuacademics/student/attendance";
        return new Promise((resolve, reject) => {
            let all_data = [];
            let semester = metadata['Sem'];
            let year = metadata['Year'];
            let months = metadata['Months'];
            controller.getAuthorizationCookie(username, password)
                .then(cookie => {
                    let result = [];
                    all_data = months.map((month) => {
                        return new Promise((resolve, reject) => {
                            fetch(url, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    Connection: 'keep-alive',
                                    Host: 'sctce.etlab.in',
                                    Origin: 'https://sctce.etlab.in',
                                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
                                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Accept-Language': 'en-US,en;q=0.5',
                                    'Accept-Encoding': 'gzip, deflate',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    //Cookie: cookie,
                                },
                                body: `semester=${semester}&month=${month}&year=${year}`
                            })
                                .then((response) => {
                                    return response.text();
                                })
                                .then(html => {
                                    let payload = {};
                                    payload['month'] = '0' + month;
                                    payload['year'] = year;
                                    payload['semester'] = semester;
                                    controller.getDetailedJSON(html, payload)
                                        .then(detailedJSON => {
                                            resolve(detailedJSON)
                                        })
                                })
                        })
                    })
                    Promise.all(all_data).then((monthsData) => {
                        monthsData.forEach(data=>{
                            result = result.concat(data);
                        })
                        resolve(result)
                    })
                })
        })
    },
}
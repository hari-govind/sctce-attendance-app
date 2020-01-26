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
    return new Promise((resolve, reject) => {
        controller.getDetailedHTML(username, password)
            .then((content) => {
                var data = controller.getDetailedAttendance(content);
                resolve(data);
            })
            .catch((err) => console.log(err))
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
                            return $(".widget-box:nth-child(4) .widget-content > div:nth-child(3)").html();
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
                            attendance['calculatedClass'] = `Need to attend next ${toAttend} classes.`;
                        else
                            attendance['calculatedClass'] = "Need to attend the next class.";
                    } else if (toAttend === 0) {
                        attendance['calculatedClass'] = "Perfectly balanced, but you can't miss next class.";
                    } else {
                        canMiss = Math.floor((attendance['totalPresent'] - 0.75 * attendance['totalClass']) / 0.75);
                        if (canMiss > 1)
                            attendance['status'] = `You can cut next ${canMiss} classes.`;
                        else
                            attendance['status'] = "You can cut the next class";
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
    getDetailedHTML: function (username, password) {
        return new Promise((resolve, reject) => {
            fetch('http://www.campusoftonline.com/atten/checklogin.php', {
                method: 'POST',
                body: `userid=${username}&mypassword=${password}&submit=Login`, headers: {
                    Connection: 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(function (response) {
                    try {
                        return response.headers.get('set-cookie').split(';')[0];
                    } catch (err) {
                        return null
                    }
                })
                .then(function (myJson) {
                    fetch('http://www.campusoftonline.com/atten/attendance/student_search2.php?display=Detailed+Attendance',
                        {
                            method: 'GET', headers: {
                                Cookie: myJson, Connection: 'keep-alive',
                                Referer: 'http://www.campusoftonline.com/atten/attendance/student_search2.php',
                                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
                                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.5'
                            }
                        })
                        .then(function (data) {
                            return data.text()
                        })
                        .then(function (html) {
                            resolve(html)
                        })
                });
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
    getDetailedAttendance: function (content) {
        var $ = cheerio.load(content);
        var allAttendanceData = [];
        $('table').each(function (i, elem) {
            if (i == 3) {
                $neededTableBody = $(this).children();
                $neededTableBody.children().each(function (j, elm) {
                    if (j % 2 == 0) {
                        $dateRow = $(elm);
                        var date = $dateRow.text().trim();
                        $detailsTableRows = $dateRow.next().children().eq(0).children().eq(0).children().eq(0).children('tr');
                        var periods = [];
                        DaySub = {};
                        DaySub['Date'] = date;
                        $detailsTableRows.each(function (k, detRow) {
                            $rowCells = $(detRow).children();
                            numOfPeriods = $rowCells.length;
                        });
                        $detailCells = $detailsTableRows.children();
                        var number_of_abscents = 0;
                        var number_of_presence = 0;
                        for (var m = 1; m <= numOfPeriods; m++) {
                            var period = {}
                            $detailCells.filter('td:nth-child(' + m + ')').each(function (index, detailCell) {
                                switch (index) {
                                    case 0:
                                        period['ID'] = $(detailCell).text().trim();
                                        break;
                                    case 1:
                                        period['Subject'] = $(detailCell).text().trim();
                                        break;
                                    case 2:
                                        period['Teacher'] = $(detailCell).text().trim();
                                        break;
                                    case 3:
                                        period['Status'] = $(detailCell).text().trim();
                                        if (period['Status'] == "A") {
                                            number_of_abscents++;
                                        } else if (period['Status'] == "P") {
                                            number_of_presence++;
                                        }
                                        break;
                                }
                            })
                            periods.push(period);
                        }
                        DaySub['Periods'] = periods;
                        DaySub['AbNumHours'] = number_of_abscents;
                        DaySub['PrNumHours'] = number_of_presence;
                        allAttendanceData.push(DaySub);
                    }
                });
            }
        });
        return allAttendanceData;
    }
}
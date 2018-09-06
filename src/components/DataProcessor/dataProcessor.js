import cheerio from 'react-native-cheerio';


    export async function getSummaryJSON(username,password){
        return new Promise((resolve, reject) => {
        controller.getAttendanceHTML(username,password)
        .then((content) => {
            var data = controller.getAttendanceData(content);
            resolve(data);
     })
        .catch((err) => {
            console.log("Error : ", err);
        })
    })
    }
    
    export async function getDetailsJSON(username,password){
        return new Promise((resolve, reject) => {
            controller.getDetailedHTML(username,password)
            .then((content) => {
                var data = controller.getDetailedAttendance(content);
                resolve(data);
            })
            .catch((err) => console.log(err))
        })
    }

    export async function isValidLogin(username,password){
        return new Promise((resolve, reject) => {
            controller.getResponseHTML(username,password)
            .then((content) => {
                /**
                 * <META HTTP-EQUIV="Refresh" Content="0; URL=logout.php">
                 * is the login error response
                 */
                console.log(content)
                if (content.startsWith('<META HTTP-EQUIV="Refresh" Content="0; URL=logout.php">')){
                    resolve(false)
                } else if(content == 'Error'){
                    resolve('connection_error')
                } else {
                    resolve(true)
                }
            })
            .catch((err) => {
                resolve('connection_error')
                console.log(err)
            })
        })
    }

    var controller = {
        getAttendanceHTML: async function(username,password){
            return new Promise((resolve, reject) => {
                fetch('http://www.campusoftonline.com/atten/checklogin.php', {method: 'POST',
                body:`userid=${username}&mypassword=${password}&submit=Login`, headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0,
                }
            })
              .then(function(response) {
                try{
                return response.headers.get('set-cookie').split(';')[0];
                } catch (err){
                    return null
                }
              })
              .then(function(myJson) {
                fetch('http://www.campusoftonline.com/atten/attendance/student_search2.php?submit=Attendance+Summery',
                {method: 'GET',headers: {Cookie: myJson,
                Referer: 'http://www.campusoftonline.com/atten/attendance/student_search2.php',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0,

             }})
                .then(function(data){
                    return data.text()
                })
                .then(function(html){
                    resolve(html)
                })
              });
            })
        },
        getAttendanceData: function(html) {
            var $ = cheerio.load(html);
            let data = {};
            let summary_data = [];
            let overall_data = [];
            $("table tr").each(function() {
                $currentRow = $(this);
                var subject = $currentRow.first().children().first().text().trim();
                var percentage = $currentRow.first().children().last().text().trim();
                var pattern = new RegExp(/^Attendance Details of (.*)$/);
                var matched = subject.match(pattern);
                if (!matched){
                    if (subject != ""){
                    var subject_pattern = new RegExp(/^Attendance percentage for (.*)$/);
                    matched_subject = subject.match(subject_pattern)
                    if(matched_subject){    
                     subject_name = matched_subject[1]
                     if(percentage >= "85%" || percentage === "100%"){
                         status = "Excellent"
                     } else if (percentage >= "75%"){
                         status = "Good"
                     } else {
                         status = "Try to improve"
                     }
                     summary_data.push({"subject": subject_name,"percentage":percentage,"status": status})
                    } else {
                        overall_data.push({key:subject, 'percentage':percentage})
                    }    
                }
                } else {
                    student_details_array = matched[1].split(',');
                    student_details = {};
                    student_details['Name'] = student_details_array[0];
                    student_details['Branch'] = student_details_array[2];
                    student_details['RollNo'] = student_details_array[3].split('-')[1];
                    data['Student'] = student_details;
                }
                data['Summary'] = summary_data;
                data['Overall'] = overall_data;
            });
          return data;
        },
        getHTML: async function(url) {
            return new Promise((resolve, reject) => {
            request(url, function(error, response, html){
                if(!error){
                    resolve(html);
                }
            })
        })
        },
        getBooksData: function(query) {
            return new Promise((resolve, reject) => {
            url = `http://sctce.libsoft.org/qs.php?page=1&data=${query}&select=5000`;
            controller.getHTML(url)
                .then((raw_html) => {
                    var $ = cheerio.load(raw_html);
                    var BooksData = {};
                    var books = [];
                    $("tr#tdfirst").each(function() {
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
        getDetailedHTML: function(username,password){
            return new Promise((resolve, reject) => {
                fetch('http://www.campusoftonline.com/atten/checklogin.php', {method: 'POST',
                body:`userid=${username}&mypassword=${password}&submit=Login`, headers: {
                    Connection: 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
              .then(function(response) {
                try{
                    return response.headers.get('set-cookie').split(';')[0];
                    } catch (err){
                        return null
                    }
              })
              .then(function(myJson) {
                fetch('http://www.campusoftonline.com/atten/attendance/student_search2.php?display=Detailed+Attendance',
                {method: 'GET',headers: {Cookie: myJson, Connection: 'keep-alive',
                Referer: 'http://www.campusoftonline.com/atten/attendance/student_search2.php',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
             }})
                .then(function(data){
                    return data.text()
                })
                .then(function(html){
                    resolve(html)
                })
              });
            })
        },
        getResponseHTML: function(username, password){
            return new Promise((resolve, reject) => {
                fetch('http://www.campusoftonline.com/atten/checklogin.php', {method: 'POST',
                body:`userid=${username}&mypassword=${password}&submit=Login`, headers: {
                    Connection: 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                })
                .then(function(data){
                    return data.text()
                })
                .then(function(html){
                    resolve(html)
                })
                .catch((err) => {
                    resolve('Error')
                })
            })
        },
        getDetailedAttendance: function(content){
            var $ = cheerio.load(content);
            var allAttendanceData = [];
            $('table').each(function(i, elem){
            if(i==3){
            $neededTableBody = $(this).children();
            $neededTableBody.children().each(function(j, elm){
                if(j%2 == 0){
                $dateRow = $(elm);
                var date = $dateRow.text().trim();
                $detailsTableRows = $dateRow.next().children().eq(0).children().eq(0).children().eq(0).children('tr');
                var periods = [];
                DaySub = {};
                DaySub['Date'] = date;
                $detailsTableRows.each(function(k,detRow){
                    $rowCells = $(detRow).children();
                    numOfPeriods = $rowCells.length;
                    });
                $detailCells = $detailsTableRows.children();
                var number_of_abscents = 0;
                var number_of_presence = 0;
                for(var m=1;m<=numOfPeriods;m++){
                    var period = {}
                    $detailCells.filter('td:nth-child('+m+')').each(function(index, detailCell){
                        switch(index){
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
                            if(period['Status'] == "A"){
                                number_of_abscents++;
                            } else if(period['Status'] == "P") {
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
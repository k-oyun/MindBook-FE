var start_year = '2000'; // 시작할 년도
var today = new Date();
var today_year = today.getFullYear();
var index = 0;
for (var y = start_year; y <= today_year; y++) {
    //start_year ~ 현재 년도
    document.getElementById('select_year').options[index] = new Option(y, y);
    index++;
}
index = 0;
for (var m = 1; m <= 12; m++) {
    document.getElementById('select_month').options[index] = new Option(m, m);
    index++;
}

lastday();

function lastday() {
    //년과 월에 따라 마지막 일 구하기
    var Year = document.getElementById('select_year').value;
    var Month = document.getElementById('select_month').value;
    var day = new Date(new Date(Year, Month, 1) - 86400000).getDate();
    /* = new Date(new Date(Year,Month,0)).getDate(); */

    var dayindex_len = document.getElementById('select_day').length;
    if (day > dayindex_len) {
        for (var i = dayindex_len + 1; i <= day; i++) {
            document.getElementById('select_day').options[i - 1] = new Option(i, i);
        }
    } else if (day < dayindex_len) {
        for (var i = dayindex_len; i >= day; i--) {
            document.getElementById('select_day').options[i] = null;
        }
    }
}

const week = ["日", "月", "火", "水", "木", "金", "土"]
const Engmonth = ["January", "February", "March", "April",
                  "May", "June", "July", "August",
                  "September", "October", "November", "December"
                ]
const illust = ["illustration/January.png", "illustration/February.png", "illustration/March.png",
                "illustration/April.png", "illustration/May.png", "illustration/June.png",
                "illustration/July.png", "illustration/August.png", "illustration/September.png",
                "illustration/October.png", "illustration/November.png", "illustration/December.png"
              ]
const today = new Date();
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);
var req;

window.onload = function () {
  req = new XMLHttpRequest();
  req.open('get', 'holiday/syukujitsu.csv', true);
  req.send(null);
  req.onload = function() {
      showProcess(today);
  };
};

function previous(){
  showDate.setMonth(showDate.getMonth() - 1);
  showProcess(showDate);
}

function next(){
  showDate.setMonth(showDate.getMonth() + 1);
  showProcess(showDate);
}

function showProcess(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  document.querySelector('#month').innerHTML = (month + 1);
  document.querySelector('#month2').innerHTML = Engmonth[month];
  document.querySelector('#monthimg').innerHTML = '<img src="'+illust[month]+'">';
  document.querySelector('#year').innerHTML = (year);
  var calendar = createCalendar(year, month);
  document.querySelector('#calendar').innerHTML = calendar;
}

function checkDate(str, year, month, day) {
  let dataArr = [];
  let checkDate =
    year +
    '/' + (month + 1) +
    '/' + day;
  let tmp = str.split('\n');
  let isHoliday = false;
  for (let i=0; i< tmp.length; i++) {
    dataArr = tmp[i].split(',');
    if (dataArr[0] === checkDate) {
      isHoliday = true;
      break;
    }
  };
  return isHoliday;
}

function Holidayname(str, year, month, day) {
  let dataArr = [];
  let checkDate =
    year +
    '/' + (month + 1) +
    '/' + day;
  let tmp = str.split('\n');
  let isHoliday = false;
  for (let i=0; i< tmp.length; i++) {
    dataArr = tmp[i].split(',');
    if (dataArr[0] === checkDate) {
      isHoliday = dataArr[1];
      break;
    }
  };
  return isHoliday;
}

function createCalendar(year, month) {
  var calendar = "<table><tr class='dayOfWeek'>";
  for (var i = 0; i < week.length; i++) {
      calendar += "<th>" + week[i] + "</th>";
  }
  calendar += "</tr>";

  var count = 0;
  var startDayOfWeek = new Date(year, month, 1).getDay();
  var endDate = new Date(year, month + 1, 0).getDate();
  var lastMonthEndDate = new Date(year, month, 0).getDate();
  var row = Math.ceil((startDayOfWeek + endDate) / week.length);

  for (var i = 0; i < row; i++) {
      calendar += "<tr>";
      for (var j = 0; j < week.length; j++) {
          if (i == 0 && j < startDayOfWeek) {
              calendar += "<td class='disabled'>" + "" + "</td>";
          } else if (count >= endDate) {
              count++;
              calendar += "<td class='disabled'>" + "" + "</td>";
            }else {
              count++;
              if(year == today.getFullYear()
                && month == (today.getMonth())
                && count == today.getDate()){
                  if(checkDate(req.responseText, year, month, count)) {
                    calendar += "<td class='todayHoliday'><b>" + count + "<p>Today</p></b><p2>" + Holidayname(req.responseText, year, month, count) + "</p2></td>";
                  }else{
                    calendar += "<td class='today'><b>" + count + "<p>Today</p></b></td>";
                  }
              } else if (checkDate(req.responseText, year, month, count)){
                calendar += "<td class='Holiday'>" + count + "<p>" + Holidayname(req.responseText, year, month, count) + "</p></td>";
                }
                else {
                  calendar += "<td>" + count + "</td>";
                }
            }
      }
      calendar += "</tr>";
  }
  return calendar;
}
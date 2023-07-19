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
const omikuji = ['<h1 class="omi1"><b>' + "大凶" + '</b></h1>', '<h1 class="omi2"><b>' + "凶" + '</b></h1>', '<h1 class="omi3"><b>' + "末吉" + '</b></h1>', 
                 '<h1 class="omi4"><b>' + "吉" + '</b></th1>', '<h1 class="omi5"><b>' + "小吉" + '</b></h1>', '<h1 class="omi6"><b>' + "中吉" + '</b></h1>', '<h1 class="omi7"><b>' + "大吉" + '</b></h1>'
               ]
const today = new Date();
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);
var req;
var count2 = 0;


window.onload = function () {
  req = new XMLHttpRequest();
  req.open('get', 'holiday/syukujitsu.csv', true);
  req.send(null);
  req.onload = function() {
      showProcess(today);
  };
};

function previous() {
  showDate.setMonth(showDate.getMonth() - 1);
  showProcess(showDate);
}

function current() {
  showDate.setFullYear(today.getFullYear(), today.getMonth());
  showProcess(showDate);
}

function next() {
  showDate.setMonth(showDate.getMonth() + 1);
  showProcess(showDate);
}

function Select() {
  if (count2 == 0){
    document.querySelector('#divination').innerHTML = omikuji[Math.floor(Math.random()*omikuji.length)];
  }
  count2++;
}

function Selectyear(y) {
  showDate.setFullYear(y);
  showProcess(showDate);
}

function Selectmonth(m) {
  showDate.setMonth(m-1);
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
  var yearText = document.getElementById('yearText');
  yearText.addEventListener('keypress', test_ivent);
  var monthText = document.getElementById('monthText');
  monthText.addEventListener('keypress', test_ivent2);
}

function test_ivent(e) {
  if (e.keyCode === 13) {
    Selectyear(yearText.value);
  }  
}

function test_ivent2(e) {
  if (e.keyCode === 13) {
    Selectmonth(monthText.value); 
  }  
}

function checkDate(str, year, month, day) {
  let dataArr = [];
  let checkDate = year + '/' + (month + 1) + '/' + day;
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
                    calendar += '<td class="todayHoliday"><a id="divination" onclick="Select();"><b>' + count + "<p>Today</p></b><p2>" + Holidayname(req.responseText, year, month, count) + "</p2></a></td>";
                  }else{
                    calendar += '<td class="today"><a id="divination" onclick="Select();"><b>' + count + "<p>Today</p></b></a></td>";
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
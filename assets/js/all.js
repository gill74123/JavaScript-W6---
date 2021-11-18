"use strict";

// 表單內元件宣告
var addTicketForm = document.querySelector(".addTicket-form");
var addTicketBtn = document.querySelector("#addTicketBtn");
var ticketName = document.querySelector("#ticketName");
var ticketImgUrl = document.querySelector("#ticketImgUrl");
var ticketRegion = document.querySelector("#ticketRegion");
var ticketPrice = document.querySelector("#ticketPrice");
var ticketNum = document.querySelector("#ticketNum");
var ticketRate = document.querySelector("#ticketRate");
var ticketDescription = document.querySelector("#ticketDescription");
var inputGroup = [ticketName, ticketImgUrl, ticketRegion, ticketPrice, ticketNum, ticketRate, ticketDescription]; // 搜尋區域

var regionSearch = document.querySelector("#regionSearch");
var searchResult = document.querySelector("#searchResult");
var cantFindArea = document.querySelector(".cantFind-area"); // 顯示列表內元件宣告

var ticketCardArea = document.querySelector("#ticketCardArea"); // console.log(inputGroup);

var data;
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (response) {
  data = response.data.data; // 渲染初始頁面

  init(data);
}); // 渲染頁面

function init(data) {
  var str = "";
  data.forEach(function (item) {
    // console.log(item);
    str += "\n  <div class=\"col-md-6 col-lg-4\">\n    <li class=\"shadow-sm border rounded-2 h-100\">\n      <div class=\"ticketCard-img | position-relative\">\n        <a href=\"#\" class=\"d-block overflow-hidden\">\n          <img src=\"".concat(item.imgUrl, "\" class=\"img-cover w-100\" alt=\"\">\n        </a>\n        <div class=\"position-absolute start-0 top-m13 rounded-end d-inline-block text-white bg-secondary fs-4 py-3 px-6\">").concat(item.area, "</div>\n        <div class=\"position-absolute start-0 bottom-m16 rounded-end d-inline-block text-white bg-primary py-1 px-3\">").concat(item.rate, "</div>\n      </div>\n      <div class=\"ticketCard-content | d-flex flex-column justify-content-between p-6\">\n        <a href=\"#\">\n          <h2 class=\"ticketCard-name | border-bottom border-success border-2 fw-medium fs-5 pb-1 mb-5\">").concat(item.name, "</h2>\n        </a>\n        <p class=\"text-dark\">").concat(item.description, "</p>\n        <div class=\"d-flex justify-content-between align-items-center\">\n          <div class=\"d-flex align-items-center\">\n            <span class=\"material-icons-outlined text-primary me-1\">error</span>\n            <p class=\"fw-medium text-primary\">\u5269\u4E0B\u6700\u5F8C ").concat(item.group, " \u7D44</p>\n          </div>\n          <div class=\"d-flex align-items-center\">\n            <span class=\"fw-medium text-primary me-1\">TWD</span>\n            <p class=\"fw-medium fs-6 text-primary\">$").concat(item.price, "</p>\n        </div>\n      </div>\n      </div>\n    </li>\n  </div>");
  });
  ticketCardArea.innerHTML = str;
} // 註冊 click 監聽事件


addTicketBtn.addEventListener("click", addData); // 驗證表單欄位

function checkInput() {
  var num = 0;
  inputGroup.forEach(function (item) {
    var input = document.querySelector("#".concat(item.id));
    var messageArea = document.querySelector("#".concat(item.id, "-message")); // console.log(input.id);

    if (input.value === "") {
      messageArea.innerHTML = "<span class=\"material-icons-outlined text-danger me-2\">error</span>\n      <span class=\"text-danger\">\u5FC5\u586B\uFF01</span>";
    } else {
      // 判斷星級是否在1~10分 & 判斷描述字數是否在100字以內
      if (input.id === "ticketRate" && (parseInt(input.value) > 10 || parseInt(input.value) < 1)) {
        messageArea.innerHTML = "<span class=\"material-icons-outlined text-danger me-2\">error</span>\n      <span class=\"text-danger\">\u661F\u7D1A\u5340\u9593\u662F 1-10 \u5206\uFF01</span>";
      } else if (input.id === "ticketDescription" && input.value.length > 100) {
        messageArea.innerHTML = "<span class=\"material-icons-outlined text-danger me-2\">error</span>\n      <span class=\"text-danger\">\u5B57\u6578\u4E0D\u5F97\u8D85\u904E 100 \u500B\u5B57\uFF01</span>";
      } else {
        messageArea.innerHTML = "";
        num += 1;
      }
    }
  }); // 回傳 num 結果給 addData() 判斷是否新增資料

  return num;
} // 新增套票


function addData() {
  var num = checkInput();

  if (num === 7) {
    var obj = {
      id: data.length,
      name: ticketName.value,
      imgUrl: ticketImgUrl.value,
      area: ticketRegion.value,
      description: ticketDescription.value,
      group: ticketNum.value,
      price: ticketPrice.value,
      rate: ticketRate.value
    };
    data.push(obj); // 清空表單欄位

    addTicketForm.reset(); // 渲染頁面

    updateList();
  }
} // 註冊 change 監聽事件


regionSearch.addEventListener("change", updateList); // 搜尋區域

function updateList() {
  var showData = data.filter(function (item) {
    if (regionSearch.value === item.area) {
      return item;
    } else if (regionSearch.value === "All" || regionSearch.value === "") {
      return item;
    }
  }); // 渲染頁面，用篩選好的 showData

  init(showData); // 搜尋筆數 & 搜尋不到頁面渲染，用篩選好的 showData

  searchResultNum(showData);
} // 搜尋筆數 & 搜尋不頁面顯示


function searchResultNum(data) {
  // 搜尋比數顯示
  var dataLength = data.length;
  searchResult.textContent = "\u672C\u6B21\u641C\u5C0B\u5171 ".concat(dataLength, " \u7B46\u8CC7\u6599"); // 搜尋不到顯示畫面

  if (dataLength === 0) {
    cantFindArea.classList.remove("d-none");
  } else {
    cantFindArea.classList.add("d-none");
  }
}
//# sourceMappingURL=all.js.map

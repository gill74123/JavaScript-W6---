// 表單內元件宣告
const addTicketForm = document.querySelector(".addTicket-form")
const addTicketBtn = document.querySelector("#addTicketBtn");
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const inputGroup = [ticketName, ticketImgUrl, ticketRegion, ticketPrice, ticketNum, ticketRate, ticketDescription];

// 搜尋區域
const regionSearch = document.querySelector("#regionSearch");
const searchResult = document.querySelector("#searchResult");
const cantFindArea = document.querySelector(".cantFind-area");

// 顯示列表內元件宣告
const ticketCardArea = document.querySelector("#ticketCardArea");

// console.log(inputGroup);

let data;
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    data = response.data.data;

    // 渲染初始頁面
    init(data);

    // 渲染初始資料圓餅圖
    areaRatio(data);
  })
  .catch(function (error) { // 呼叫 API 錯誤時可以印出錯誤
    console.log(error);
  })

// 渲染頁面
function init(data) {
  let str = "";
  data.forEach(item => {
    // console.log(item);
    str += `
  <div class="col-md-6 col-lg-4">
    <li class="shadow-sm border rounded-2 h-100">
      <div class="ticketCard-img | position-relative">
        <a href="#" class="d-block overflow-hidden">
          <img src="${item.imgUrl}" class="img-cover w-100" alt="">
        </a>
        <div class="position-absolute start-0 top-m13 rounded-end d-inline-block text-white bg-secondary fs-4 py-3 px-6">${item.area}</div>
        <div class="position-absolute start-0 bottom-m16 rounded-end d-inline-block text-white bg-primary py-1 px-3">${item.rate}</div>
      </div>
      <div class="ticketCard-content | d-flex flex-column justify-content-between p-6">
        <a href="#">
          <h2 class="ticketCard-name | border-bottom border-success border-2 fw-medium fs-5 pb-1 mb-5">${item.name}</h2>
        </a>
        <p class="text-dark">${item.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <span class="material-icons-outlined text-primary me-1">error</span>
            <p class="fw-medium text-primary">剩下最後 ${item.group} 組</p>
          </div>
          <div class="d-flex align-items-center">
            <span class="fw-medium text-primary me-1">TWD</span>
            <p class="fw-medium fs-6 text-primary">$${item.price}</p>
        </div>
      </div>
      </div>
    </li>
  </div>`;
  });
  ticketCardArea.innerHTML = str;
}

// 註冊 click 監聽事件
addTicketBtn.addEventListener("click",addData);

// 驗證表單欄位
function checkInput() {
  let num = 0;
  inputGroup.forEach(function(item){
    const input = document.querySelector(`#${item.id}`);
    const messageArea = document.querySelector(`#${item.id}-message`);
    // console.log(input.id);

    if (input.value === "") {
      messageArea.innerHTML = `<span class="material-icons-outlined text-danger me-2">error</span>
      <span class="text-danger">必填！</span>`;
    } else{
      // 判斷星級是否在1~10分 & 判斷描述字數是否在100字內 & 判斷圖片網址是否為正確格式
      if (input.id === "ticketRate" && (parseInt(input.value) > 10 || parseInt(input.value) < 1)) {
        messageArea.innerHTML = `<span class="material-icons-outlined text-danger me-2">error</span>
      <span class="text-danger">星級區間是 1-10 分！</span>`;
      } else if (input.id === "ticketDescription" && input.value.length > 100) {
        messageArea.innerHTML = `<span class="material-icons-outlined text-danger me-2">error</span>
      <span class="text-danger">字數不得超過 100 個字！</span>`;
      } else if (input.id === "ticketImgUrl" && validUrl(input)){
        messageArea.innerHTML = `<span class="material-icons-outlined text-danger me-2">error</span>
      <span class="text-danger">請填入正確圖片網址格式！</span>`;
      } else{
        messageArea.innerHTML = ``;
        num += 1;
      }
    }
  })
  // 回傳 num 結果給 addData() 判斷是否新增資料
  return num;
}

// 驗證圖片網址是否為正確格式
function validUrl(input) {
  let value = input.value;
  if (!value.match(/jpg|jpeg|png|gif/i)) {
    return true
  }
}

// 新增套票
function addData() {
  let num = checkInput();
  if (num === 7) {
    let obj = {
      id: data.length,
      name: ticketName.value,
      imgUrl: ticketImgUrl.value,
      area: ticketRegion.value,
      description: ticketDescription.value,
      group: ticketNum.value,
      price: ticketPrice.value,
      rate: ticketRate.value
    };
  
    data.push(obj);
  
    // 清空表單欄位
    addTicketForm.reset();
  
    // 渲染頁面
    updateList();
  }
}

// 註冊 change 監聽事件
regionSearch.addEventListener("change", updateList)

// 搜尋區域
function updateList() {
  let showData = data.filter(item => {
    if (regionSearch.value === item.area) {
      return item;
    } else if (regionSearch.value === "All" || regionSearch.value === ""){
      return item;
    }
  })

  // 渲染頁面，用篩選好的 showData
  init(showData);

  // 搜尋筆數 & 搜尋不到頁面渲染，用篩選好的 showData
  searchResultNum(showData);

  // 渲染新的資料到圓餅圖
  areaRatio(showData);
}

// 搜尋筆數 & 搜尋不頁面顯示
function searchResultNum(data) {
  // 搜尋比數顯示
  let dataLength = data.length;
  searchResult.textContent = `本次搜尋共 ${dataLength} 筆資料`;

  // 搜尋不到顯示畫面
  if (dataLength === 0) {
    cantFindArea.classList.remove("d-none");
  } else{
    cantFindArea.classList.add("d-none");
  }
}

// C3 圖表
function areaRatio(data) {
  // output[['高雄', 1],['台北', 2],['台中', 3]]
  // 將資料內所要用的 area 資料取出
  let areaNum = {};
  data.forEach(function(item){
    if(areaNum[item.area]){
      areaNum[item.area] += 1;
    } else{
      areaNum[item.area] = 1;
    }
  })
  // console.log(areaNum);

  // 將 areaNum 物件的 key 值取出並回傳陣列
  let areaName = Object.keys(areaNum);
  // console.log(areaName);

  // 將 areaNum 物件的 value 取出並拼湊成 output 的樣子
  let newArea = [];
  areaName.forEach(function(item){
    let ary = [];
    ary.push(item);
    ary.push(areaNum[item]);
    newArea.push(ary);
  })
  // console.log(newArea);

  let chart = c3.generate({
    bindto: "#chart",
    padding: {
      bottom: 10
    },
    data: {
      columns: newArea,
      type: 'donut',
      colors: {
        '高雄': '#E68618',
        '台中': '#5151D3',
        '台北': '#26BFC7'
      }
    },
    donut: {
      title: "套票地區比重",
      label: {
        show: false
      },
      width: 15
    },
    size: {
      height: 180
    }
  });
}


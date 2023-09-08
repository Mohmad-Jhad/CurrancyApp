// currency convert without validation
// note : the api owner is currencyapi and because is it free i have just 300 request in month

const dropDown = document.querySelectorAll(".dropdown");
const inputs = document.querySelectorAll(".select");
const convertBtn = document.querySelector(".convert");
const amount = document.querySelector(".amount");
const result = document.querySelector(".result");
const arrData = [];
let failed = [];

// get data by api
async function getData() {
  let request = new XMLHttpRequest();
  await request.open(
    "GET",
    "https://api.currencyapi.com/v3/latest?apikey=cur_live_DbspsnwkUQKb9SOG7QCxFdhJORXtFAq2gXuEjhJT"
  );
  await request.send();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      main(data);
    }
  };
}
getData();

function main(data) {
  convertToArrayOfObj(data);
  setValueInDropDown();
  isClick(failed);
}

// convert object to array of object [{},{}]
function convertToArrayOfObj(data) {
  Object.keys(data.data).forEach((key) => {
    arrData.push({
      name: key,
      about: data.data[key],
    });
  });
}

//add elements inside dropDown by the
function setValueInDropDown() {
  let str = ``;
  arrData.forEach((el) => {
    str += `<span class="failed" data-value="${el.name}">${el.name}</span>`;
  });
  //set the elements inside dropdown
  dropDown[1].innerHTML = str;
  dropDown[0].innerHTML = str;

  // init input
  dropDown[0].previousElementSibling.value = "ILS";
  dropDown[1].previousElementSibling.value = "USD";

  failed = document.querySelectorAll(".failed");
}

// when user click to element in dropdown
function isClick() {
  failed.forEach((el) => {
    el.onclick = function () {
      el.parentElement.style.display = "none";
      el.parentElement.previousElementSibling.value = el.dataset.value;
    };
  });
}
//  when the user click on input
inputs.forEach((el) => {
  el.onclick = function () {
    if (el.nextElementSibling.style.display == "flex") {
      el.nextElementSibling.style.display = "none";
      return;
    }
    el.nextElementSibling.style.display = "flex";
  };
});

// convert button

convertBtn.onclick = function (e) {
  const { value } = amount;
  const [firstInput, secondInput] = inputs;
  // check if the value in first input exist
  const isExistFirstInput = arrData.filter((el) =>
    el.name === firstInput.value.toUpperCase() ? el.about.value : false
  );
  // check if the value in scound input exist
  const isExistSecundInput = arrData.filter((el) =>
    el.name === secondInput.value.toUpperCase() ? el.about.value : false
  );
  //check if exist
  if (!isExistFirstInput || !isExistSecundInput) {
    alert("something wrong");
    return;
  }
  // first state -> USD exist first input or last input
  if (
    firstInput.value.toUpperCase() == "USD" ||
    secondInput.value.toUpperCase() == "USD"
  ) {
    // if exist in first input
    if (firstInput.value.toUpperCase() == "USD") {
      const output = value * isExistSecundInput[0].about.value;
      result.innerHTML = `result : ${output}`;
      return;
    }
    // if exist in secund input
    const output = value / isExistFirstInput[0].about.value;
    result.innerHTML = `result : ${output}`;
    return;
  }
  // secund state -> usd not exist in the first input or secund input
  const output =
    (value / isExistFirstInput[0].about.value) *
    isExistSecundInput[0].about.value;
  result.innerHTML = `result : ${output}`;
};

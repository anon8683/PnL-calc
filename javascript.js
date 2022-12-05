const slider = document.querySelector("#leverage");
const inputLeverage = document.querySelector(".lev");
const qty = document.querySelector("#qty");
const entry = document.querySelector("#entry");
const collateral = document.querySelector(".collateral");
const closes = document.querySelector("#close");
const profitLoss = document.querySelector("#profit");
const profitP = document.querySelector("#profitP");
const roi = document.querySelector("#roi");
const shortButton = document.querySelector(".short");
const longButton = document.querySelector(".long");

let leverage = 0;
let quantity = 0;
let entryPrice = 0;
let closePrice = 0;
let iniMargin = 0;
let realPnl = 0;

let long = true;
let short = false;

longButton.addEventListener("click", (e) => {
  longButton.classList.add("buttonBorder");
  shortButton.classList.remove("buttonBorder");
  long = true;
  short = false;
  pnl();
});

shortButton.addEventListener("click", (e) => {
  longButton.classList.remove("buttonBorder");
  shortButton.classList.add("buttonBorder");

  long = false;
  short = true;
  pnl();
});

slider.addEventListener("input", (e) => {
  leverage = slider.value;
  inputLeverage.value = slider.value;
  margin();
  checkClose();
});

inputLeverage.addEventListener("change", (e) => {
  leverage = +inputLeverage.value;
  slider.value = +inputLeverage.value;
  margin();
  checkClose();
});

qty.addEventListener("change", (e) => {
  quantity = +qty.value;
  margin();
  checkClose();
});

entry.addEventListener("change", (e) => {
  entryPrice = +entry.value;
  margin();
  checkClose();
});

closes.addEventListener("change", (e) => {
  closePrice = +closes.value;
  checkClose();
});

function margin() {
  iniMargin = +((quantity * entryPrice) / leverage).toFixed(1);
  collateral.textContent = `${((quantity * entryPrice) / leverage).toFixed(
    1
  )} USDT`;
}

function pnl() {
  if (long === true) {
    realPnl = +(quantity * closePrice - quantity * entryPrice).toFixed(1);
    profitLoss.textContent = `${realPnl} USDT`;
    profitP.textContent = `${((realPnl / entryPrice) * 100).toFixed(2)}%`;
    roi.textContent = `${((realPnl / iniMargin) * 100).toFixed(2)}%`;
    return;
  }

  realPnl = +(quantity * entryPrice - quantity * closePrice).toFixed(1);

  profitLoss.textContent = `${realPnl} USDT`;
  profitP.textContent = `${((realPnl / entryPrice) * 100).toFixed(2)}%`;
  roi.textContent = `${((realPnl / iniMargin) * 100).toFixed(2)}%`;

  return;
}

function checkClose() {
  if (closePrice > 0) {
    pnl();
  } else {
    defaults();
  }
}

function defaults() {
  profitLoss.textContent = "0.00 USDT";
  profitP.textContent = "0%";
  roi.textContent = "0%";
}

const slider = document.querySelector("#leverage");
const inputLeverage = document.querySelector(".lev");
const qty = document.querySelector("#qty");
const entry = document.querySelector("#entry");
const collateral = document.querySelector(".collateral");
const close = document.querySelector("#close");
const profitLoss = document.querySelector("#profit");
const profitP = document.querySelector("#profitP");
const roi = document.querySelector("#roi");
const shortButton = document.querySelector(".short");
const longButton = document.querySelector(".long");

let leverage = 1;
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
});

shortButton.addEventListener("click", (e) => {
  longButton.classList.remove("buttonBorder");
  shortButton.classList.add("buttonBorder");

  long = false;
  short = true;
});

slider.addEventListener("input", (e) => {
  leverage = slider.value;
  inputLeverage.value = slider.value;
  margin();
  pnl();
});

inputLeverage.addEventListener("change", (e) => {
  leverage = +inputLeverage.value;
  slider.value = +inputLeverage.value;
  margin();
  pnl();
});

qty.addEventListener("change", (e) => {
  quantity = +qty.value;
  margin();
  pnl();
});

entry.addEventListener("change", (e) => {
  entryPrice = +entry.value;
  margin();
  pnl();
});

close.addEventListener("change", (e) => {
  closePrice = +close.value;
  margin();
  pnl();
});

function margin() {
  iniMargin = +((quantity * entryPrice) / leverage).toFixed(1);
  collateral.textContent = `${((quantity * entryPrice) / leverage).toFixed(
    1
  )} USDT`;
}

function pnl() {
  realPnl = +(quantity * closePrice - quantity * entryPrice).toFixed(1);
  profitLoss.textContent = `${realPnl} USDT`;
  profitP.textContent = `${((realPnl / entryPrice) * 100).toFixed(2)}%`;
  roi.textContent = `${((realPnl / iniMargin) * 100).toFixed(2)}%`;

  return;
}

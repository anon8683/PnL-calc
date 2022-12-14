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
const liquidation = document.querySelector("#liq");
const intro = document.querySelector(".intro");
const prices = Array.from(document.querySelectorAll(".price"));
const ethPrice = document.querySelector(".ethPrice");

let leverage = 0;
let quantity = 0;
let entryPrice = 0;
let closePrice = 0;
let iniMargin = 0;
let realPnl = 0;
let liq = 0;
let orderValue = 0;
let price = 0;

let long = true;
let short = false;

longButton.addEventListener("click", (e) => {
  longButton.classList.add("buttonBorder");
  shortButton.classList.remove("buttonBorder");
  long = true;
  short = false;
  checkClose();
  liqPrice();
});

shortButton.addEventListener("click", (e) => {
  longButton.classList.remove("buttonBorder");
  shortButton.classList.add("buttonBorder");

  long = false;
  short = true;
  checkClose();
  liqPrice();
});

slider.addEventListener("input", (e) => {
  leverage = slider.value;
  inputLeverage.value = slider.value;
  margin();
  checkClose();
  liqPrice();
});

inputLeverage.addEventListener("change", (e) => {
  leverage = +inputLeverage.value;
  slider.value = +inputLeverage.value;
  margin();
  checkClose();
  liqPrice();
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
  liqPrice();
});

closes.addEventListener("change", (e) => {
  closePrice = +closes.value;
  checkClose();
  liqPrice();
});

function margin() {
  iniMargin = +((quantity * entryPrice) / leverage).toFixed(2);
  collateral.textContent = `${numberWithCommas(
    ((quantity * entryPrice) / leverage).toFixed(1)
  )} USDT`;
}

function pnl() {
  //Changes pnl formula based on side
  if (long === true) {
    realPnl = numberWithCommas(
      +(quantity * closePrice - quantity * entryPrice).toFixed(1)
    );
  } else {
    // else if short is true
    realPnl = numberWithCommas(
      +(quantity * entryPrice - quantity * closePrice).toFixed(1)
    );
  }

  //Calculates our pnl percents
  let orderValue = entryPrice * quantity;
  let percent = ((realPnl / orderValue) * 100).toFixed(2);
  let roiPerecent = ((realPnl / iniMargin) * 100).toFixed(2);

  //Displays pnl
  profitLoss.textContent = `${realPnl} USDT`;
  profitP.textContent = `${percent} %`;
  roi.textContent = `${roiPerecent}%`;
  // Adds/removes CSS color class to our text
  checkColor();
}

//Calcs our liquidation price based on leverage,quantity,entry price
function liqPrice() {
  if (leverage > 0 && quantity > 0 && entryPrice > 0) {
    orderValue = entryPrice * quantity;

    if (long === true) {
      //   liq = liq + (iniMargin / 100) * 5;
      liq = numberWithCommas((orderValue - iniMargin) / quantity);
      liquidation.textContent = `${liq} USDT`;
    } else {
      liq = numberWithCommas((orderValue + iniMargin) / quantity);
      liquidation.textContent = `${liq} USDT`;
    }
  }
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

function checkColor() {
  if (realPnl > 0) {
    profitLoss.classList.remove("loss");
    profitP.classList.remove("loss");
    roi.classList.remove("loss");
    profitLoss.classList.add("profit");
    profitP.classList.add("profit");
    roi.classList.add("profit");
  } else {
    profitLoss.classList.remove("profit");
    profitP.classList.remove("profit");
    roi.classList.remove("profit");
    profitLoss.classList.add("loss");
    profitP.classList.add("loss");
    roi.classList.add("loss");
  }
}

function fetchData() {
  fetch("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT")
    .then((response) => response.json())
    .then((data) => {
      price = Math.round(+data.price * 10) / 10;
      //   prices.textContent = `$${numberWithCommas(price)}`;

      prices.forEach((el) => {
        el.textContent = `$${numberWithCommas(price)}`;
      });
    });

  fetch("https://api.binance.com/api/v3/avgPrice?symbol=ETHUSDT")
    .then((response) => response.json())
    .then((data) => {
      ethPrice.textContent = `$${numberWithCommas(
        Math.round(+data.price * 10) / 10
      )}`;
    });
}

//Call fetch every 5 seconds after window loads
window.addEventListener("load", (e) => {
  fetchData();
  const fetchInterval = 5000;
  setInterval(fetchData, fetchInterval);
});

// Give numbers commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

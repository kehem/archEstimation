import { showToast } from "https://cdn.jsdelivr.net/gh/surajit-singha-sisir/mastorsCDN@v1.1.01/mastors.js";

document.addEventListener("DOMContentLoaded", () => {
  let counter = 1;
  let pileTable = document.querySelector(".pileTable");
  const stirrupTable = document.querySelector(".stirrupTable");

  //   ON SUBMIT BUTTON CLICKED
  const submit = document.getElementById("pileSubmit");
  submit.addEventListener("click", (event) => {
    let pileInputs = allPileInputs();

    if (isValidInputs(pileInputs)) {
      showToast("New Row has been added");
      const pileTotalRodLength =
        pileInputs.pileQty * pileInputs.pileRod * pileInputs.pileLength;
      const pileUnitWeightOfBar =
        (pileInputs.pileBar * pileInputs.pileBar) / 533;
      const tr = document.createElement("tr");
      tr.classList.add(`pileTr-${counter}`);
      const pileRow = `
                    <td>Column-${counter}</td>
                    <td>${pileInputs.pileBar}</td>
                    <td>${pileInputs.pileQty}</td>
                    <td>${pileInputs.pileRod}</td>
                    <td>${pileInputs.pileLength}</td>
                    <!-- Quantity x Rod x Length -->
                    <td>${pileTotalRodLength}</td>
                    <!-- (Bar x Bar)/533 -->
                    <td>${pileUnitWeightOfBar.toFixed(3)}</td>
                    <!-- Total Rod Length x Unit Weight of Bar -->
                    <td class="pileTotalWeight">${(
                      pileTotalRodLength * pileUnitWeightOfBar
                    ).toFixed(3)}</td>
                    <td><button class="deleteBtn btn btn-warning"><i class="m-trash"></i></button></td>
        `;
      let pileTableTbody = pileTable.querySelector("tbody");

      tr.innerHTML = pileRow;
      const lastTr = pileTableTbody.querySelector(".pileSubTotalTr");
      lastTr.before(tr);

      //   CALCULATE SUBTOTAL
      const pileSubTotal = pileTableTbody.querySelector(".pileSubTotal");
      const allTotals = pileTableTbody.querySelectorAll(".pileTotalWeight");
      let allSubSums = 0;
      allTotals.forEach((x) => (allSubSums += parseFloat(x.textContent)) || 0);
      const subTotal = pileTableTbody.querySelector(".pileSubTotal");
      subTotal.textContent = allSubSums.toFixed(3);

      // STIRRUP TABLE
      stirrupTableGet(
        stirrupTable,
        pileInputs.pileQty,
        pileInputs.pileLength,
        counter
      );
      counter++;
    } else {
      showToast("Please Fillup all Inputs", "warning");
    }
  });
  stirrupInputs();
});
function isValidInputs(pileInputs) {
  return (
    !isNaN(pileInputs.pileBar) &&
    pileInputs.pileBar > 0 &&
    !isNaN(pileInputs.pileQty) &&
    pileInputs.pileQty > 0 &&
    !isNaN(pileInputs.pileRod) &&
    pileInputs.pileRod > 0 &&
    !isNaN(pileInputs.pileLength) &&
    pileInputs.pileLength > 0
  );
}

function allPileInputs() {
  const pileBar = parseFloat(document.getElementById("pileBar").value);
  const pileQty = parseFloat(document.getElementById("pileQty").value);
  const pileRod = parseFloat(document.getElementById("pileRod").value);
  const pileLength = parseFloat(document.getElementById("pileLength").value);
  return { pileBar, pileQty, pileRod, pileLength };
}

function stirrupTableGet(stirrupTable, pileQty, pileLength, counter) {
  const row = `
  <tr class="column-${counter}">
    <td>Col-${counter}</td>
    <td pile-length="${pileLength}" class="pileQty">${pileQty}</td>
    <td class="stBarInput" contenteditable="true"></td>
    <td class="stRadiusInput" contenteditable="true">0</td>
    <td class="stArea">0</td>
    <td class="stExtraRodInput" contenteditable="true">0</td>
    <td class="stTotalRunningLength">0</td>
    <td class="stX2Length" contenteditable="true">0</td>
    <td class="stX2Dedumption" contenteditable="true">0</td>
    <td class="stX2Qty">0</td>
    <td class="stX1Length" contenteditable="true">0</td>
    <td class="stX1Dedumption" contenteditable="true">0</td>
    <td class="stX1Qty">0</td>
    <td class="totalRings">0</td>
    <td class="w">0</td>
    <td class="v">0</td>
  </tr>
  `;
  const tbody = stirrupTable.querySelector("tbody");
  const lastTr = tbody.lastElementChild;

  // CREATE TR
  const tr = document.createElement("tr");
  tr.classList.add(`column-${counter}`);
  tr.innerHTML = row;
  lastTr.insertAdjacentHTML("beforebegin", row);
}

function stirrupInputs() {
  const stirrupTable = document.querySelector(".stirrupTable");
  stirrupTable.addEventListener("click", (event) => {
    const currentTr = event.target.parentElement;

    const editableCells = currentTr.querySelectorAll(
      '[contenteditable="true"]'
    );
    editableCells.forEach((cell) => {
      cell.addEventListener("blur", () => {
        const x = currentRowInputs(currentTr);

        const area = currentTr.querySelector(".stArea");
        const rad12 = x.radius / 12;
        area.textContent = (3.1414 * rad12 * rad12).toFixed(3);

        const totalRunningLength = currentTr.querySelector(
          ".stTotalRunningLength"
        );

        totalRunningLength.textContent = (2 * 3.1416 * rad12).toFixed(3);
        const x2Qty = currentTr.querySelector(".stX2Qty");
        x2Qty.textContent = (x.x2Length / (x.x2Dedumption / 12)).toFixed(3);
        const x1Qty = currentTr.querySelector(".stX1Qty");
        x1Qty.textContent = (x.x1Length / (x.x1Dedumption / 12)).toFixed(3);

        const totalRing = currentTr.querySelector(".totalRings");
        const pileQty = currentTr.querySelector(".pileQty");
        const pileQtys = parseFloat(pileQty.textContent);
        totalRing.textContent = (
          (parseFloat(x2Qty.textContent) + parseFloat(x1Qty.textContent)) *
          pileQtys
        ).toFixed(3);
        // W
        const w = currentTr.querySelector(".w");
        const bar = x.bar;
        const totalRunningLengthValue = parseFloat(
          totalRunningLength.textContent
        );
        const totalRingValue = parseFloat(totalRing.textContent);
        w.textContent = (
          ((bar * bar) / 533) *
          totalRunningLengthValue *
          totalRingValue
        ).toFixed(3);

        // V
        const v = currentTr.querySelector(".v");
        const pileQtyValue = parseFloat(pileQty.textContent);

        const pileLength = parseFloat(pileQty.getAttribute("pile-length"));

        const areaValue = parseFloat(
          currentTr.querySelector(".stArea").textContent
        );

        v.textContent = (pileLength * pileQtyValue * areaValue).toFixed(3);

        // SUB TOTAL
        const tbody = stirrupTable.querySelector("tbody");
        const subtotal = tbody.lastElementChild;
        const allW = tbody.querySelectorAll("tr .w");
        let wCounter = 0;
        allW.forEach((x) => (wCounter += parseFloat(x.textContent)));
        const allV = tbody.querySelectorAll("tr .v");
        let vCounter = 0;
        allV.forEach((x) => (vCounter += parseFloat(x.textContent)));
        let vSubTotal = 0;
        if (wCounter > 0) {
          const wSubTotal = subtotal.querySelector(".stirrupWSubTotal");
          const vSubTotal = subtotal.querySelector(".stirrupVSubTotal");
          wSubTotal.textContent = wCounter;
          vSubTotal.textContent = vCounter;
          // rcc calculation here
          rccCalc(vCounter);
        }
      });
    });
  });
}

// const deleteBtn = document.querySelector(".deleteBtn");
// deleteBtn.addEventListener("click", () => {
//   const ActiveTr = deleteBtn.closest("tr");
//   ActiveTr.remove();
// });

function currentRowInputs(currentTr) {
  const bar = parseFloat(currentTr.querySelector(".stBarInput").textContent);
  const radius = parseFloat(
    currentTr.querySelector(".stRadiusInput").textContent
  );
  const extraRod = parseFloat(
    currentTr.querySelector(".stExtraRodInput").textContent
  );
  const x2Length = parseFloat(
    currentTr.querySelector(".stX2Length").textContent
  );
  const x2Dedumption = parseFloat(
    currentTr.querySelector(".stX2Dedumption").textContent
  );
  const x1Length = parseFloat(
    currentTr.querySelector(".stX1Length").textContent
  );
  const x1Dedumption = parseFloat(
    currentTr.querySelector(".stX1Dedumption").textContent
  );
  return {
    bar,
    radius,
    extraRod,
    x2Length,
    x2Dedumption,
    x1Length,
    x1Dedumption,
  };
}
function rccCalc(vTotal) {
  const DVCFT = document.querySelector(".DVCFT");
  DVCFT.textContent = vTotal;
  const WVCFT = document.querySelector(".WVCFT");
  WVCFT.textContent = (vTotal * 0.0283168).toFixed(3);
  const DVCM = document.querySelector(".DVCM");
  DVCM.textContent = (vTotal * 1.54).toFixed(3);
  const WVCM = document.querySelector(".WVCM");
  WVCM.textContent = (parseFloat(WVCFT.textContent) * 1.54).toFixed(3);

  // MAIN TABLE
  const rccTable = document.querySelector(".rccCalculation");
  const tbody = rccTable.querySelector("tbody");

  const cement = tbody.querySelector("tr .cement");
  const sand = tbody.querySelector("tr .sand");
  const stone = tbody.querySelector("tr .stone");
  const brick = tbody.querySelector("tr .brick");
  const allInputs = tbody.querySelectorAll(".contenteditable");
  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // CEMENT CALCULATION
      let totalRatio =
        parseFloat(cement.textContent) +
        parseFloat(sand.textContent) +
        parseFloat(stone.textContent);

      const cementVCFT = cement.nextElementSibling;
      const cementQty = cementVCFT.nextElementSibling;

      // NEED
      const cementVCFTValue =
        parseFloat(cement.textContent) * parseFloat(DVCM.textContent); //CHANGED to DVCM
      // NEED
      const cementQtyValue = parseFloat(cementVCFT.textContent) / 1.25;
      const unRound1 = cementVCFTValue / totalRatio;
      cementVCFT.textContent = unRound1.toFixed(2) + " CFT";
      cementQty.textContent = cementQtyValue.toFixed(2) + " Bag's";

      const cementTotal = cementQty.nextElementSibling;
      // NEED

      const cementTotalValue = cementQtyValue * 550;
      cementTotal.textContent = cementTotalValue.toFixed(2);

      // SAND CALCULATION

      const sandVCFT = sand.nextElementSibling;
      const sandQty = sandVCFT.nextElementSibling;

      // NEED
      const sandVCFTValue =
        parseFloat(sand.textContent) * parseFloat(DVCM.textContent);
      const unRound2 = sandVCFTValue / totalRatio;
      sandVCFT.textContent = unRound2.toFixed(2) + " CFT";

      const sandTotal = sandQty.nextElementSibling;
      // NEED
      const sandTotalValue = unRound2 * 60;
      sandTotal.textContent = sandTotalValue.toFixed(2);

      // stone CALCULATION

      const stoneVCFT = stone.nextElementSibling;
      const stoneQty = stoneVCFT.nextElementSibling;

      // NEED
      const stoneVCFTValue =
        parseFloat(stone.textContent) * parseFloat(DVCM.textContent);
      const unRound4 = stoneVCFTValue / totalRatio;
      stoneVCFT.textContent = unRound4.toFixed(2) + " CFT";

      const stoneTotal = stoneQty.nextElementSibling;
      // NEED
      const stoneTotalValue = unRound4 * 230;
      stoneTotal.textContent = stoneTotalValue.toFixed(2);

      // brick CALCULATION

      const brickVCFT = brick.nextElementSibling;
      const brickQty = brickVCFT.nextElementSibling;
      // NEED
      const brickVCFTValue =
        parseFloat(stone.textContent) * parseFloat(DVCM.textContent); //CHANGED to DVCM
      // NEED
      const brickQtyValue = parseFloat(stoneVCFT.textContent) * 9;
      const unRound5 = brickVCFTValue / totalRatio;
      brickVCFT.textContent = unRound5.toFixed(2) + " CFT";
      brickQty.textContent = brickQtyValue.toFixed(2) + " Brick's";

      const brickTotal = brickQty.nextElementSibling;
      // NEED

      const brickTotalValue = brickQtyValue * 12;
      brickTotal.textContent = brickTotalValue.toFixed(2);

      // TOTAL
      const total = tbody.querySelector("tr .subtotal");
      const totalValue = total.nextElementSibling;
      const allPrices = tbody.querySelectorAll("tr .totalPrices");
      let updatedTotal = 0;
      allPrices.forEach((x) => (updatedTotal += parseFloat(x.textContent)));
      totalValue.textContent = updatedTotal.toFixed(3);
    });
  });
}

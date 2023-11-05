let cols = 26;
let rows = 100;

const serialContainer = document.querySelector(".srno");  
const rowHeadContainer = document.querySelector(".row-head");  
const gridContainer = document.querySelector(".grid");  

const cellNamePlaceholder = document.querySelector("#active-cell");
const fontSizeInput = document.querySelector("#fontsize");
const fontFamilyInput = document.querySelector("#fontfamily");
const form = document.querySelector("#form");


function createSrNoCells(){
    for(let i=0; i<=rows; i++){
        const srnoCell = document.createElement("div");
        srnoCell.className = "srno-cell";
        if(i !== 0){
            srnoCell.innerText = i;
        }
        serialContainer.appendChild(srnoCell);
    }
}
createSrNoCells();

function createRowHeadCells(){
    for(let i=1; i<=cols; i++){
        const rowHeadCell = document.createElement("div");
        rowHeadCell.className = "rowHead-Cell cell"
        rowHeadCell.innerText = String.fromCharCode(64+i);
        rowHeadContainer.appendChild(rowHeadCell);
    }
}
createRowHeadCells();

function createGridRows(rowNo){
    console.log("inside createGridRows");
    const gridrow = document.createElement("div");
    gridrow.className = "grid-row";
    for(let i=1; i<=cols; i++){
        const gridcell = document.createElement("div");
        gridcell.className = "grid-cell cell";
        gridcell.contentEditable = true;
        gridrow.appendChild(gridcell);

        gridcell.id = String.fromCharCode(64 + i) + rowNo;
        gridcell.addEventListener("focus",onCellFocus);
    }
    gridContainer.appendChild(gridrow);
}
function createGrid(){
    console.log("inside createGrid");
    for(let i=1; i<=rows; i++){
        createGridRows(i);
    }
}
createGrid();

let activeElement = null;
const state = {};

const defaultProperties = {
    fontFamily: 'sans',
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
    backgroundColor: "#ffffff",
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    value: ''
}

function resetOptions(optionsState) {
    form.fontfamily.value = optionsState.fontFamily;
    form.fontsize.value = optionsState.fontSize;
    form.textalign.value = optionsState.textAlign;
    form.bold.checked = optionsState.isBold
    form.italic.checked = optionsState.isItalic;
    form.underlined.checked = optionsState.isUnderlined;
    form.textcolor.value = optionsState.color;
    form.bgcolor.value = optionsState.backgroundColor;
}

function onCellFocus(event){
    const elementID = event.target.id;
    cellNamePlaceholder.innerText = elementID;
    activeElement = event.target;
    if(state[elementID]){
        resetOptions(state[elementID]);
    }else{
        resetOptions(defaultProperties);
    }
}

function onFormChange() {
    if (!activeElement) {
        alert("Please select a cell to make changes");
        form.reset();
        return;
    }

    let currentState = {
        textColor: form.textcolor.value,
        backgroundColor: form.bgcolor.value,
        fontSize: form.fontsize.value,
        fontFamily: form.fontfamily.value,
        isBold: form.bold.checked,
        isItalic: form.italic.checked,
        isUnderlined: form.underlined.checked,
        textAlign: form.textalign.value
    }

    // below function applies all the styles to the active cell.
    applyStylesToCell(currentState);

    // update the state object for the current cell.
    // state = {} 
    // state["C2"] = currentState ;
    // state = { C2: currentState }
    state[activeElement.id] = { ...currentState, value: activeElement.innerText };
}

function applyStylesToCell(styleObject) {
    // it will take the style object and applies it to the currently selected cell.
    activeElement.style.fontSize = `${styleObject.fontSize}px`;
    activeElement.style.fontFamily = styleObject.fontFamily;
    activeElement.style.color = styleObject.textColor;
    activeElement.style.backgroundColor = styleObject.backgroundColor;
    activeElement.style.textAlign = styleObject.textAlign;

    activeElement.style.fontWeight = styleObject.isBold ? "bold" : "normal";
    activeElement.style.fontStyle = styleObject.isItalic ? "italic" : "normal";
    activeElement.style.textDecoration = styleObject.isUnderlined ? "underline" : "none";
}
function exportData() {
    let fileData = JSON.stringify(state);
    let blob = new Blob([fileData], { type: "application/json" })
    let url = URL.createObjectURL(blob);
    // <a href="fileaddress" download="sheet.json"></a>
    let link = document.createElement("a");
    link.href = url;
    link.download = "sheet.json";
    link.click();
}
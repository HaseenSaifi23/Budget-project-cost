let conversionRate = 1; 
let selectedCurrency = "INR"; 
let totalWorkingHours = 0;
let totalHoursWorked = 0;
let remaining_time = 0;



function setCurrency(currency) {
 selectedCurrency = currency;
 if (currency === "USD") {
 conversionRate = 1 / 86.40; 
 } else if (currency === "INR") {
 conversionRate = 1; 
 }
 updateCurrencyDisplay(); 
 updateCurrencySymbol(); 
}


function updateCurrencyDisplay() {
 let totalCostInputs = document.querySelectorAll(".totalCostInput");
 let perHourCostInputs = document.querySelectorAll(".perHourCost");
 let budgetField = document.querySelector(".budget");


 let budget = parseFloat(budgetField.value);


 if (!isNaN(budget)) {
 if (selectedCurrency === "USD") {
 budgetField.value = (budget / 86.40).toFixed(2); 
 } else {
 budgetField.value = budget.toFixed(2);
 }
 }

 totalCostInputs.forEach((input) => {
 let value = parseFloat(input.value);
 if (!isNaN(value)) {
 if (selectedCurrency === "USD") {
 input.value = (value / 86.40).toFixed(2); 
 } else {
 input.value = value.toFixed(2);
 }
 }
 });

 perHourCostInputs.forEach((input) => {
 let value = parseFloat(input.value);
 if (!isNaN(value)) {
 if (selectedCurrency === "USD") {
 input.value = (value / 86.40).toFixed(2); 
 } else {
 input.value = value.toFixed(2);
 }
 }
 });



}


function updateCurrencySymbol() {
 let currencySymbolElement = document.querySelector(".currencySymbol");
 let ctcInputs = document.querySelectorAll(".costInput");

 if (selectedCurrency === "USD") {
 currencySymbolElement.innerText = "$";
 ctcInputs.forEach((input) => {
 input.placeholder = "$ " + input.placeholder.replace(/^(\$|₹)/, ""); 
 });
 } else if (selectedCurrency === "INR") {
 currencySymbolElement.innerText = "₹";
 ctcInputs.forEach((input) => {
 input.placeholder = "₹ " + input.placeholder.replace(/^(\$|₹)/, ""); 
 });
 }
}


function table() {
 let budget = document.querySelector(".budget").value;
 let team = document.querySelector(".teamCount").value;
 let tabelContainer = document.querySelector(".tableContainer");
 let nextRowBtn=document.querySelector(".Next-row-button")

 if (budget <= 0) {
 alert("Please enter a valid budget");
 return;
 }
 if (team <= 0) {
 alert("Please enter a team member count");
 return;
 }

 let tabel = document.createElement("table");
 let head = `<tr>
 <th>Team Member</th>
 <th>CTC</th>
 <th>Per Hour Cost</th>
 <th>Optimistic (O)</th>
 <th>Most Likely (M)</th>
 <th>Pessimistic (P)</th>
 <th>Estimated Time</th>
 <th>Total Cost</th>
 <th>Action </th>
 </tr>`;
 tabel.innerHTML = head;

 for (let i = 1; i <= team; i++) {
 let row = `<tr>
 <td><input type="text" class ="teamMemberInput" placeholder="Enter Name"></td>
 <td><input type="number" placeholder="Employee CTC" class="costInput" onchange="CTC(this)"></td>
 <td><input type="number" placeholder="Employee Per Hour Cost" class="perHourCost" readonly></td>
 <td><input type="number" placeholder="Enter Optimistic (O)" class="optimisticInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Enter Most Likely (M)" class="mostLikelyInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Enter Pessimistic (P)" class="pessimisticInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Estimated Time (hrs)" class="estimatedTime" readonly></td>
 <td><input type="text" placeholder="Total Cost" readonly class="totalCostInput"></td>
 <td><button type="Button" class="remove">Delete</button></td> 
 </tr>`;
 tabel.innerHTML += row;
 }

 tabelContainer.innerHTML = "";
 tabelContainer.append(tabel);

 nextRowBtn.style.display = 'inline-block';
 addDeleteEventListeners();
}


function addDeleteEventListeners() {
    let deleteButtons = document.querySelectorAll(".remove");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            let row = button.closest("tr");
            let estimatedTime = parseFloat(row.querySelector(".estimatedTime").value) || 0;
            let previousTotalCost = parseFloat(row.querySelector(".totalCostInput").value) || 0;

            remaining_time += estimatedTime;  
            totalCost -= previousTotalCost;  

            remaintime();  
           
            row.remove();
        });
    });
}





function CTC(input) {
 let ctc = parseFloat(input.value);
 let perHourCostField = input.closest("tr").querySelector(".perHourCost");

 if (!isNaN(ctc) && ctc > 0) {
 totalWorkingHours = 52 * 40;
 let perHourCost = ctc / totalWorkingHours;
 perHourCostField.value = perHourCost.toFixed(2);
 } else {
 perHourCostField.value = "";
 }
}



function calculatePERT(o, m, p) {
 return (o + 4 * m + p) / 6;
}



function calculateTime(input) {
 let row = input.closest("tr");
 let optimistic = parseFloat(row.querySelector(".optimisticInput").value);
 let mostLikely = parseFloat(row.querySelector(".mostLikelyInput").value);
 let pessimistic = parseFloat(row.querySelector(".pessimisticInput").value);
 let perHourCost = parseFloat(row.querySelector(".perHourCost").value);

 if (!isNaN(optimistic) && !isNaN(mostLikely) && !isNaN(pessimistic)) {
 let estimatedTime = calculatePERT(optimistic, mostLikely, pessimistic);
 let totalCost = perHourCost * estimatedTime;
 
 row.querySelector(".estimatedTime").value = Math.floor(estimatedTime); 
 row.querySelector(".totalCostInput").value = totalCost.toFixed(2); 
 } else {
 row.querySelector(".estimatedTime").value = "";
 row.querySelector(".totalCostInput").value = "";
 }
}



function nextTBL() {
 let tabelContainer = document.querySelector(".tableContainer");
 let container=document.querySelector(".container")
 let oldTabel = tabelContainer.querySelector("table");

 if (oldTabel == null) {
 alert("Please create the first table by clicking 'Create Table' button.");
 return;
 }

 let newRow = document.createElement('tr');
 newRow.innerHTML = `<tr>
 <td><input type="text" placeholder="Enter Name"></td>
 <td><input type="number" placeholder="Employee CTC" class="costInput" onchange="CTC(this)"></td>
 <td><input type="number" placeholder="Employee Per Hour Cost" class="perHourCost" readonly></td>
 <td><input type="number" placeholder="Enter Optimistic (O)" class="optimisticInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Enter Most Likely (M)" class="mostLikelyInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Enter Pessimistic (P)" class="pessimisticInput" onchange="calculateTime(this)"></td>
 <td><input type="number" placeholder="Estimated Time (hrs)" class="estimatedTime" readonly></td>
 <td><input type="text" placeholder="Total Cost" readonly class="totalCostInput"></td>
 <td><button type="Button" class="remove">Delete</button></td> 
 </tr>`;

 oldTabel.append(newRow);
 console.log(oldTabel);
 addDeleteEventListeners()
 
}



function totaltime() {
 let budget = parseFloat(document.querySelector(".budget").value);
 let totalCost = 0;

 
 let totalCostInputs = document.querySelectorAll(".totalCostInput");
 let estimatedTimeInputs = document.querySelectorAll(".estimatedTime");

 totalCostInputs.forEach((input, index) => {
 let perHourCost = parseFloat(input.closest("tr").querySelector(".perHourCost").value);
 let estimatedTime = parseFloat(input.closest("tr").querySelector(".estimatedTime").value);

 if (!isNaN(perHourCost) && !isNaN(estimatedTime)) {
 let totalTeamCost = perHourCost * estimatedTime;
 totalCost += totalTeamCost;
 totalHoursWorked += estimatedTime;

 totalCostInputs[index].value = totalTeamCost.toFixed(2);
 }
 });

 if (totalCost <= 0 || totalHoursWorked <= 0) {
 alert("Please enter valid cost and hours for the team members.");
 return;
 }

 let remainingBudget = budget - totalCost;
 let profitOrLoss = remainingBudget >= 0 ? "Profit" : "Loss";
 remainingBudget = Math.abs(remainingBudget);

 let fullDays = Math.floor(totalHoursWorked / 24);
 let remainingHours = totalHoursWorked % 24;

 let timeInMonths = fullDays / 30;

 let time = document.querySelector("p");
 let currencySymbol = selectedCurrency === "USD" ? "$" : "₹"; 
 
 let message = `
 Total Team Cost: ${currencySymbol}${totalCost.toFixed(2)} <br>
 Total Available Hours: ${totalHoursWorked} hours <br>

 Time to complete the work: ${fullDays} days + ${remainingHours} hours (~${Math.floor(timeInMonths)} months) <br>
 Remaining Budget: ${currencySymbol}${remainingBudget.toFixed(2)} (${profitOrLoss}) <br>
`;

remaintime()

 time.innerHTML = message;



 AddTask()
} 
function AddTask() {
 let container = document.querySelector(".container");
 let team = document.querySelector(".teamCount").value;
 
 
 let teamMemberNames = [];
 let teamNameInputs = document.querySelectorAll(".tableContainer .teamMemberInput");
 
 teamNameInputs.forEach((input) => {
 if (input.value.trim() !== "") {
 teamMemberNames.push(input.value); 
 }
 });
 
 
 let TBL = document.querySelector(".taskTable"); 
 if (!TBL) {
 TBL = document.createElement("table");
 TBL.classList.add("taskTable"); 
 container.innerHTML = ""; 
 container.append(TBL);
 
 
 let headerRow = `<tr class="tabelrow"> <th>Task</th> 
 <th>Description</th> 
 <th>Complicity</th> 
 
 `;

teamMemberNames.forEach((name) => {
 headerRow += `<th>${name}</th>`;
 
 });
 
 
 headerRow += `<th>Total</th><th>Action</th></tr>`; 
 
 TBL.innerHTML = headerRow;
 }
 
 if (TBL.rows.length === 1) {
 addRow(TBL, teamMemberNames);
 }
 
 let addRowButton = document.querySelector(".addRowButton");
 if (!addRowButton) {
 addRowButton = document.createElement("button");
 addRowButton.textContent = "Add Row";
 addRowButton.classList.add("addRowButton");
 container.append(addRowButton);
 
 
 addRowButton.addEventListener("click", () => {
 addRow(TBL, teamMemberNames);
 });
 }
 }
 
 function addRow(TBL, teamMemberNames) {



   if (remaining_time <= 0) {
    alert("You have run out of time. You cannot add more rows.");
    return; 
}


 let newRow = TBL.insertRow();

 let taskCell = newRow.insertCell();
 taskCell.innerHTML = `<input type="text" placeholder="Enter TASK">`;
 

 let descCell = newRow.insertCell();
 descCell.innerHTML = `<input type="text" placeholder="Enter DESCRIPTION">`;

 let selectLevel = newRow.insertCell();
 let dropdown = document.createElement("select");
 dropdown.classList.add("difficultyLevel"); 
 
 let options = ["Select", "Good", "Average", "Hard", "Very Hard"];
 options.forEach(optionText => {
 let option = document.createElement("option");
 option.value = optionText;
 option.textContent = optionText;
 dropdown.appendChild(option);
 });
 selectLevel.appendChild(dropdown);
 

 teamMemberNames.forEach((name) => {
 let memberCell = newRow.insertCell();
 memberCell.innerHTML = `<input type="number" placeholder="Enter value" readonly>`;
 memberCell.classList.add("teamMemberInputField"); 
 });
 

 let totalCell = newRow.insertCell();
 totalCell.innerHTML = `<input type="text" class="total" readonly>`; 
 
 
 let actionCell = newRow.insertCell();
 actionCell.innerHTML = `<button type="Button" class="remove">Delete</button>`;
 

 addDeleteEventListeners();
 

 dropdown.addEventListener("change", function () {
 updateTeamMemberValues(newRow, teamMemberNames);
 remaintime();
 });
 }
 
 function updateTeamMemberValues(row, teamMemberNames) {
 let difficulty = row.querySelector(".difficultyLevel").value;
 let percentage = 0;

 if (difficulty === "Very Hard") percentage = 40;
 else if (difficulty === "Hard") percentage = 30;
 else if (difficulty === "Average") percentage = 20;
 else if (difficulty === "Good") percentage = 10;
 

 let teamMemberInputs = row.querySelectorAll(".teamMemberInputField");
 let tableRows = document.querySelectorAll(".tableContainer table tr");
 
 let total = 0; 
 

 teamMemberInputs.forEach((input, index) => {
 if (index < teamMemberNames.length) {
 let estimatedTimeInput = tableRows[index + 1]?.querySelector(".estimatedTime");
 if (estimatedTimeInput) {
 let estimatedTime = parseFloat(estimatedTimeInput.value) || 0;
 let calculatedValue = (estimatedTime * percentage) / 100;
 input.querySelector("input").value = calculatedValue.toFixed(2);
 total += calculatedValue; 
 }
 }
 });
 

 row.querySelector(".total").value = total.toFixed(2);
 }
   








function addDeleteEventListeners() {
    let deleteButtons = document.querySelectorAll(".remove");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            
  
            let totalTimeCell = row.querySelector(".total");
            let totalTimeValue = parseFloat(totalTimeCell.value) || 0;

       
            remaining_time += totalTimeValue;

        
            row.remove();

          
            let rows = document.querySelectorAll("tableContainer table tr");
            if (rows.length === 0) {
                remaining_time = remaining_time; 
            }

            remaintime();
            
            console.log(remaining_time,"rem");
            console.log(totalTimeValue,"time");
            
            
        });
    });
}

addDeleteEventListeners()

 function remaintime() {
    let totalvalue = 0;
    document.querySelectorAll(".total").forEach(input => {
        let value = parseFloat(input.value) || 0; 
        totalvalue += value;   
    });
    remaining_time = totalHoursWorked - totalvalue;


  let remainingTimeDisplay = document.querySelector(".para1");

  if (remaining_time <= 0) {
      remainingTimeDisplay.innerHTML= "No Remaining time Available";
      remainingTimeDisplay.style.color = "red"; 
  } else {
      remainingTimeDisplay.innerHTML = `Remaining Time: ${remaining_time} hours`;
      remainingTimeDisplay.style.color = "black"; 
  }

    return remaining_time;
    
}


 
function PDF() {
 let { jsPDF } = window.jspdf;
 let doc = new jsPDF('p', 'mm', 'a4'); 

 doc.setFontSize(16);
 doc.text("PROJECT BUDGET ESTIMATION", 100, 20, { align: "center" });

 let img = new Image();
 img.src = "https://login.salesforce.com/img/logo214.svg"; 
 img.onload = function () {
 doc.addImage(img, "PNG", 150, 10, 40, 20);
 };

 let table = document.querySelector(".container table");

 if (!table) {
 alert("Please generate the table first");
 return;
 }

 let headers = [];
 let rows = [];

 let tableRows = table.querySelectorAll("tr");

 tableRows.forEach((row, index) => {
 let rowData = [];
 let columns = row.querySelectorAll("td, th");

 columns.forEach((col, colIndex) => {
 
 if (colIndex !== columns.length - 1 && colIndex !== 2) { 
 if (index === 0) {
 headers.push(col.textContent); 
 } else {
 if (col.querySelector("input")) {
 rowData.push(col.querySelector("input").value); 
 } else {
 rowData.push(col.textContent); 
 }
 }
 }
 });

 if (index > 0) {
 rows.push(rowData);
 }
 });

 doc.autoTable({
 head: [headers], 
 body: rows,
 margin: { top: 5 },
 styles: { fontSize: 10, cellPadding: 2 },
 headerStyles: { fillColor: [19, 155, 233], textColor: [255, 255, 255], fontSize: 12 },
 startY: 30,
 theme: 'grid',
 columnStyles: {
 halign: 'right',
 0: { cellWidth: '100' },
 halign: 'right', 
 1: { cellWidth: '100', halign: 'left', valign: 'middle' },
 
 },
 });

 doc.save("Team_Detail.pdf");
}

 
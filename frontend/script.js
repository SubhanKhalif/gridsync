const BASE_URL = "https://gridsync.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
    const spreadsheetContainer = document.getElementById("spreadsheet-container");
    const addRowBtn = document.getElementById("add-row");
    const addColBtn = document.getElementById("add-col");
    const deleteRowBtn = document.getElementById("delete-row");
    const deleteColBtn = document.getElementById("delete-column");
    const undoBtn = document.getElementById("undo");
    const redoBtn = document.getElementById("redo");
    const exportXlsxBtn = document.getElementById("export-xlsx");

    let activeCollection = localStorage.getItem("activeCollection") || "defaultCollection";
    let tableData = [];
    let rows = 5, columns = 5;
    let selectedCell = { row: 1, col: 1 };

    let historyStack = [];
    let redoStack = [];

    // Set initial collection
    await fetch(`${BASE_URL}/setCollection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: activeCollection }),
    });

    async function loadTable() {
        try {
            const response = await fetch(`${BASE_URL}/getTable`);
            const { metadata, data } = await response.json();
            if (metadata) ({ rows, columns } = metadata);
            tableData = data;
            renderTable();
        } catch (error) {
            console.error("Error fetching table:", error);
        }
    }

    function renderTable() {
        spreadsheetContainer.innerHTML = "";
        const table = document.createElement("table");
        table.appendChild(createHeader());
        table.appendChild(createBody());
        spreadsheetContainer.appendChild(table);
        updateTableData();
    }

    function createHeader() {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        for (let j = 0; j <= columns; j++) {
            const th = document.createElement("th");
            th.innerText = j === 0 ? "Sr No" : j;
            Object.assign(th.style, { position: "sticky", top: "0", backgroundColor: "#d3d3d3", zIndex: "2" });
            if (j === 0) th.style.left = "0";
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        return thead;
    }

    function createBody() {
        const tbody = document.createElement("tbody");
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j <= columns; j++) {
                const td = document.createElement("td");
                td.dataset.row = i;
                td.dataset.col = j;

                if (j === 0) {
                    td.innerText = i;
                    Object.assign(td.style, {
                        position: "sticky",
                        left: "0",
                        backgroundColor: "#d3d3d3",
                        fontWeight: "bold",
                        zIndex: "3"
                    });
                } else {
                    td.contentEditable = true;
                    td.addEventListener("blur", saveCellData);
                    td.addEventListener("click", (e) => selectedCell = { row: +e.target.dataset.row, col: +e.target.dataset.col });
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        return tbody;
    }

    function updateTableData() {
        tableData.forEach(({ row, col, value }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) cell.innerText = value;
        });
    }

    function saveCellData(event) {
        const { row, col } = event.target.dataset;
        const newValue = event.target.innerText;
        const existingCell = tableData.find(cell => cell.row == row && cell.col == col);
        const prevValue = existingCell ? existingCell.value : "";

        if (!existingCell) tableData.push({ row: +row, col: +col, value: newValue });
        else existingCell.value = newValue;

        pushToHistory([{ row: +row, col: +col, prevValue, newValue }]);
        saveTableToDB();
    }

    async function saveTableToDB() {
        try {
            await fetch(`${BASE_URL}/saveTable`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows, columns, data: tableData }),
            });
        } catch (error) {
            console.error("Error saving table:", error);
        }
    }

    function pushToHistory(changes) {
        historyStack.push(changes);
        redoStack = []; 
    }

    function undo() {
        if (historyStack.length === 0) return;
        const lastChanges = historyStack.pop();
        redoStack.push(lastChanges);

        lastChanges.forEach(({ row, col, prevValue }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) cell.innerText = prevValue;

            const existingCell = tableData.find(cell => cell.row == row && cell.col == col);
            if (existingCell) existingCell.value = prevValue;
        });

        saveTableToDB();
    }

    function redo() {
        if (redoStack.length === 0) return;
        const redoChanges = redoStack.pop();
        historyStack.push(redoChanges);

        redoChanges.forEach(({ row, col, newValue }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) cell.innerText = newValue;

            const existingCell = tableData.find(cell => cell.row == row && cell.col == col);
            if (existingCell) existingCell.value = newValue;
        });

        saveTableToDB();
    }

    addRowBtn.addEventListener("click", async () => {
        rows++;
        await saveTableToDB();
        renderTable();
    });

    addColBtn.addEventListener("click", async () => {
        columns++;
        await saveTableToDB();
        renderTable();
    });

    deleteRowBtn.addEventListener("click", async () => {
        let rowIndexes = prompt("Enter row numbers to delete (comma-separated):");
        if (!rowIndexes) return;

        let rowNumbers = rowIndexes.split(",").map(num => parseInt(num.trim())).filter(num => num >= 1 && num < rows);
        if (rowNumbers.length === 0) return alert("Cannot delete row 0 (headers).");

        tableData = tableData.filter(cell => !rowNumbers.includes(cell.row));
        rows -= rowNumbers.length;
        await saveTableToDB();
        renderTable();
    });

    deleteColBtn.addEventListener("click", async () => {
        let colIndexes = prompt("Enter column numbers to delete (comma-separated):");
        if (!colIndexes) return;

        let colNumbers = colIndexes.split(",").map(num => parseInt(num.trim())).filter(num => num >= 1 && num < columns);
        if (colNumbers.length === 0) return alert("Cannot delete column 0 (headers).");

        tableData = tableData.filter(cell => !colNumbers.includes(cell.col));
        columns -= colNumbers.length;
        await saveTableToDB();
        renderTable();
    });

    undoBtn.addEventListener("click", undo);
    redoBtn.addEventListener("click", redo);

    exportXlsxBtn.addEventListener("click", () => {
        const table = document.querySelector("table");
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "spreadsheet.xlsx");
    });

document.addEventListener("paste", (event) => {
    event.preventDefault();
    
    const clipboardData = event.clipboardData.getData("Text").trim().split("\n").map(row => row.split("\t"));
    let { row, col } = selectedCell;

    const changes = []; // Track changes for undo/redo

    rows = Math.max(rows, row + clipboardData.length);
    columns = Math.max(columns, col + clipboardData[0].length);
    renderTable();

    clipboardData.forEach((rowData, rowIndex) => {
        rowData.forEach((cellValue, colIndex) => {
            const targetRow = row + rowIndex;
            const targetCol = col + colIndex;
            const cell = document.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);

            if (cell) {
                const prevValue = cell.innerText;
                cell.innerText = cellValue;

                // Store changes for undo
                changes.push({ row: targetRow, col: targetCol, prevValue, newValue: cellValue });

                saveCellData({ target: cell });
            }
        });
    });

    if (changes.length > 0) pushToHistory(changes);
    saveTableToDB();
});


await loadTable();
});

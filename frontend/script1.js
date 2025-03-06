document.addEventListener("DOMContentLoaded", function () {
            enableResizableColumns();
            setupSearchFeature();
            enableTableSelection();
        });

        function enableResizableColumns() {
            const headers = document.querySelectorAll("th");

            headers.forEach((th, index) => {
                if (index === 0) return;

                const resizer = document.createElement("div");
                resizer.classList.add("resize-handle");
                th.appendChild(resizer);

                let startX, startWidth;

                resizer.addEventListener("mousedown", function (event) {
                    startX = event.clientX;
                    startWidth = th.offsetWidth;

                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                });

                function handleMouseMove(event) {
                    const newWidth = startWidth + (event.clientX - startX);
                    th.style.width = newWidth + "px";
                    document.querySelectorAll(`td:nth-child(${index + 1})`).forEach(td => {
                        td.style.width = newWidth + "px";
                    });
                }

                function handleMouseUp() {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                }
            });
        }

        function setupSearchFeature() {
            const searchInput = document.getElementById("search-input");

            searchInput.addEventListener("input", function () {
                const searchTerm = searchInput.value.toLowerCase();
                const cells = document.querySelectorAll("td");

                let firstMatch = null;

                cells.forEach(cell => {
                    cell.classList.remove("highlight");

                    if (searchTerm && cell.textContent.toLowerCase().includes(searchTerm)) {
                        cell.classList.add("highlight");
                        if (!firstMatch) firstMatch = cell;
                    }
                });

                if (firstMatch) firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }

        function enableTableSelection() {
    let isSelecting = false;
    let startCell = null;
    let endCell = null;

    document.addEventListener("mousedown", function (event) {
        if (event.target.tagName === "TD") {
            isSelecting = true;
            document.querySelectorAll(".selected").forEach(cell => cell.classList.remove("selected"));
            startCell = event.target;
        }
    });

    document.addEventListener("mouseover", function (event) {
        if (isSelecting && event.target.tagName === "TD") {
            endCell = event.target;
            selectRectangularArea(startCell, endCell);
        }
    });

    document.addEventListener("mouseup", () => {
        isSelecting = false;
    });

    function selectRectangularArea(start, end) {
        const table = document.querySelector("table");
        const cells = [...table.getElementsByTagName("td")];

        let startRow = start.parentElement.rowIndex;
        let startCol = start.cellIndex;
        let endRow = end.parentElement.rowIndex;
        let endCol = end.cellIndex;

        let minRow = Math.min(startRow, endRow);
        let maxRow = Math.max(startRow, endRow);
        let minCol = Math.min(startCol, endCol);
        let maxCol = Math.max(startCol, endCol);

        cells.forEach(cell => {
            let row = cell.parentElement.rowIndex;
            let col = cell.cellIndex;

            if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) {
                cell.classList.add("selected");
            } else {
                cell.classList.remove("selected");
            }
        });
    }

    document.addEventListener("copy", function (event) {
        const selectedCells = document.querySelectorAll(".selected");
        if (selectedCells.length === 0) return;

        let copiedData = [];
        let rowMap = new Map();

        selectedCells.forEach(cell => {
            let rowIndex = cell.parentElement.rowIndex;
            if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
            rowMap.get(rowIndex).push(cell.innerText);
        });

        rowMap = new Map([...rowMap.entries()].sort((a, b) => a[0] - b[0]));

        rowMap.forEach(row => copiedData.push(row.join("\t")));
        event.clipboardData.setData("text/plain", copiedData.join("\n"));
        event.preventDefault();
    });
}
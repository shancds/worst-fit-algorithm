// script.js

document.getElementById("simulateButton").addEventListener("click", function () {
    const memoryBlocks = document.getElementById("memoryBlocks").value.split(",").map(Number);
    const processes = document.getElementById("processes").value.split(",").map(Number);
    const resultsDiv = document.getElementById("results");

    // Check input validity
    if (memoryBlocks.includes(NaN) || processes.includes(NaN)) {
        resultsDiv.innerHTML = "Invalid input! Please enter numbers separated by commas.";
        return;
    }

    let allocations = [];
    let freeBlocks = memoryBlocks.map((size, index) => ({ id: index + 1, size }));

    // Start building table
    let tableHTML = `
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead>
                <tr>
                    <th>Process ID</th>
                    <th>Process Size</th>
                    <th>Allocated Block</th>
                    <th>Remaining Memory Blocks</th>
                </tr>
            </thead>
            <tbody>
    `;

    processes.forEach((process, processIndex) => {
        let largestBlock = null;
        let largestBlockIndex = -1;

        // Find the largest block
        freeBlocks.forEach((block, index) => {
            if (block.size >= process && (!largestBlock || block.size > largestBlock.size)) {
                largestBlock = block;
                largestBlockIndex = index;
            }
        });

        if (largestBlock) {
            // Allocate memory
            allocations.push(`Process ${processIndex + 1} allocated ${process} from Block ${largestBlock.id}`);
            largestBlock.size -= process;

            // Remove block if fully utilized
            if (largestBlock.size === 0) {
                freeBlocks.splice(largestBlockIndex, 1);
            }

            // Add row to table
            tableHTML += `
                <tr>
                    <td>P${processIndex + 1}</td>
                    <td>${process}</td>
                    <td>Block ${largestBlock.id}</td>
                    <td>${freeBlocks.map(block => `Block ${block.id}: ${block.size}`).join("<br>")}</td>
                </tr>
            `;
        } else {
            // Allocation failed
            allocations.push(`Process ${processIndex + 1} could not be allocated`);
            tableHTML += `
                <tr>
                    <td>P${processIndex + 1}</td>
                    <td>${process}</td>
                    <td>Not Allocated</td>
                    <td>${freeBlocks.map(block => `Block ${block.id}: ${block.size}`).join("<br>")}</td>
                </tr>
            `;
        }
    });

    // Close table
    tableHTML += `
            </tbody>
        </table>
    `;

    // Display results
    resultsDiv.innerHTML = tableHTML;
});

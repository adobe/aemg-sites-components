window.addEventListener('DOMContentLoaded', function () {
  // Check if the chart already exists to prevent multiple creations
  if (document.querySelector(".chart-container .assets-evaluation-polar")) {
    return; // Exit if a canvas already exists
  }

  // Create a canvas element
  var canvas = document.createElement("canvas");
  canvas.classList.add('assets-evaluation-polar');

  // Ensure the chart container exists before appending
  var chartContainer = document.querySelector(".chart-container");
  if (!chartContainer) {
    console.warn("Chart container not found");
    return;
  }

  // Append the canvas to the ".chart-container" element
  chartContainer.appendChild(canvas);

  // Get the 2D context of the canvas
  var ctx = canvas.getContext('2d');


  var tableObj = getTableData();
  renderChart(ctx, tableObj)
});

function renderChart(ctx, tableObj) {
  // Create the chart
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: tableObj.col1,
      datasets: [{
        label: 'Eligible Assets Evaluation',
        data: tableObj.col2,  // Data values for the chart
        backgroundColor: [
          '#2C2C2E',
          '#DE6D00',
          '#07635E',
          '#04C2C7',
          '#013220'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "left",
          align: "start",
          labels: {
            font: {
              size: 14,
              family: 'Manrope, sans-serif',
              color: '#2C343B'
            }
          }
        }
      },
      layout: {
        padding: {
          top: 40,
          bottom: 20,
          left: 10,
          right: 10
        }
      }
    }
  });

}

function getTableData() {
  // Get the table by ID
  var table = document.querySelector('.eligbility-cat-table .tgroup');

  // Initialize two empty arrays for the columns
  var column1Data = [];
  var column2Data = [];

  // Loop through each row of the table
  for (var i = 1; i < table.rows.length; i++) {
    // Get the cells of the current row
    var cells = table.rows[i].cells;

    // Push the data of the columns into their respective arrays
    if (cells.length > 1) {
      column1Data.push(cells[0].textContent); // Column 1 data
      column2Data.push(cells[1].textContent); // Column 2 data
    }
  }

  // Return the arrays containing the column data
  return { col1: column1Data, col2: column2Data };
}
window.addEventListener('DOMContentLoaded', function () {
    var parent = document.querySelector(".chart-container");
    if (document.querySelector(".chart-container canvas.eligible-categories-bar")) return;
  
    var canvas = document.createElement("canvas");
    canvas.classList.add("eligible-categories-bar");
  
    var ctx = canvas.getContext('2d');
  
    // Get the table data dynamically
    var table = document.querySelector('.eligibility-bar-table') || document.createElement("div");
    var rows = table.querySelectorAll('tbody .row');

    // Arrays to hold chart data
    var labels = [];
    var assetsEvaluationData = [];
    var selectionProcessData = [];
  
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      labels.push(cells[0].innerText); // Year
      assetsEvaluationData.push(parseInt(cells[1].innerText)); // Assets Evaluation
      selectionProcessData.push(parseInt(cells[2].innerText)); // Selection Process
    });
  
    if(!labels.length) {
      return;
    }
 
    parent.appendChild(canvas);
    
    const asisColor = "#87A3FB";
  
    // Create the chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Assets Evaluation',
            data: assetsEvaluationData,
            backgroundColor: '#FFD700',
            borderColor: '#FFD700',  // Use the CSS variable for border color
            borderWidth: 1
          },
          {
            label: 'Selection Process',
            data: selectionProcessData,
            backgroundColor: '#01EA57',
            borderColor: '#01EA57',  // Use the CSS variable for border color
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          x: {
            grid: {
              color: asisColor, // Grid line color
              borderColor: asisColor,  // Border color for x-axis
              borderWidth: 1 // Optional: Set width of the axis border
            },
            ticks: {
              color: asisColor, // Tick label color for x-axis
              font: {
                size: 16,  // Set font size for x-axis labels
                weight: 'bold' // Optional: Set font weight for x-axis labels
              }
            }
          },
          y: {
            grid: {
              color: asisColor, // Grid line color
              borderColor: asisColor, // Border color for y-axis
              borderWidth: 1 // Optional: Set width of the axis border
            },
            ticks: {
              beginAtZero: true,
              color: asisColor, // Tick label color for y-axis
              font: {
                size: 14,  // Set font size for y-axis labels
                weight: 'bold' // Optional: Set font weight for y-axis labels
              }
            }
          }
        },
        legend: {
          labels: {
            color: asisColor  // Change the color of the legend labels (dataset label colors)
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: asisColor,  // Dataset label color (legend label)
              font: {
                size: 14  // Optional: Set the font size for the legend
              }
            }
          }
        }
      }
    });
  });

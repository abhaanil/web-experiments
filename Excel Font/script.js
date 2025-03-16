let cols = 90;
let rows = 90;
let colWidths = [];
let rowHeights = [];
let cellColors = [];
let cellShapes = [];
let dragCol = -1;
let dragRow = -1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let selectedColor;
let drawShape = 'rect';
let roundBtn, triangleBtn, fillBtn; // Store buttons globally
let blackBtn, darkGreyBtn, greyBtn, lightGreyBtn; // Swatches as buttons


let cnv; // Canvas variable

function setup() {
  // Create the p5.js canvas
  cnv = createCanvas(windowWidth * 0.9, windowHeight * 0.75);
  cnv.parent('canvasContainer');

  // Ensure canvas resizes on page load
  resizeCanvasToFit();
  window.addEventListener('resize', resizeCanvasToFit);

  // Initialize grid setup
  for (let i = 0; i < cols; i++) colWidths[i] = 10000 / cols;
  for (let j = 0; j < rows; j++) rowHeights[j] = 3000 / rows;

  for (let i = 0; i < cols; i++) {
    cellColors[i] = [];
    cellShapes[i] = [];
    for (let j = 0; j < rows; j++) {
      cellColors[i][j] = j == 0 || i == 0 ? color(33, 115, 70) : color(255);
      cellShapes[i][j] = 'rect';
    }
  }

  selectedColor = color(0);

  // Create shape buttons
  roundBtn = createButton('Round');
  triangleBtn = createButton('Triangle');
  fillBtn = createButton('Fill');

  // Style buttons
  roundBtn.style('width', '80px');
  roundBtn.style('border', '1px solid black');
  triangleBtn.style('width', '80px');
  triangleBtn.style('border', '1px solid black');
  fillBtn.style('width', '80px');
  fillBtn.style('border', '1px solid black');

  // Set click actions
  roundBtn.mousePressed(() => drawShape = 'circle');

  triangleBtn.mousePressed(() => drawShape = 'triangle');

  fillBtn.mousePressed(() => drawShape = 'rect');


  // Create color buttons (swatches)
  blackBtn = createColorButton(color(0, 0, 0));        // Black
  darkGreyBtn = createColorButton(color(78, 78, 78));  // Dark Grey
  greyBtn = createColorButton(color(150, 150, 150));   // Grey
  lightGreyBtn = createColorButton(color(230, 230, 230)); // Light Grey

  // Position buttons & color swatches
  positionControls();

  let downloadBtn = select('#downloadBtn');
  downloadBtn.mousePressed(downloadCanvas);
}

// Function to correctly position buttons (shapes + colors)
function positionControls() {
  let canvasBottom = cnv.position().y + height + 20; // 20px padding below canvas
  let leftOffset = cnv.position().x; // Align with canvas left side

  // Position shape buttons
  roundBtn.position(leftOffset, canvasBottom);
  triangleBtn.position(leftOffset + 90, canvasBottom);
  fillBtn.position(leftOffset + 180, canvasBottom);

  // Position color buttons next to shape buttons
  let colorOffset = leftOffset + 280; // Place color buttons after shape buttons
  blackBtn.position(colorOffset, canvasBottom);
  darkGreyBtn.position(colorOffset + 90, canvasBottom);
  greyBtn.position(colorOffset + 180, canvasBottom);
  lightGreyBtn.position(colorOffset + 270, canvasBottom);
}

// Function to create color buttons
function createColorButton(col) {
  let btn = createButton('');
  btn.style('width', '80px');
  btn.style('height', '23px');
  btn.style('background-color', col.toString('#rrggbb')); // Convert p5 color to hex
  btn.style('border-radius', '3px'); // Rounded corners
  btn.style('border', '1px solid black');
  btn.mousePressed(() => selectedColor = col); // Change color on click

  return btn;
}

// Ensure canvas resizes properly and reposition buttons
function resizeCanvasToFit() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.75);
  positionControls(); // Reposition everything when resizing
}

function windowResized() {
  resizeCanvasToFit();
}

function draw() {
  background(255);
  drawGrid();
}

// Function to ensure canvas resizes properly
function resizeCanvasToFit() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
}


function drawGrid() {
  let x = 0;
  let y = 0;

  textAlign(CENTER, CENTER);
  textSize(16);
  strokeWeight(0.5);

  // Draw columns
  for (let i = 0; i <= cols; i++) {
    if (i < cols) {
      x += colWidths[i];
      // Draw column labels (A-Z, AA-AZ, BA-BZ, etc.) excluding the first null column
      if (i > 0) {
        text(getColumnName(i), x - colWidths[i] / 2, rowHeights[0] / 2);
      }
    }
    line(x, 0, x, height);
  }

  // Draw rows
  for (let j = 0; j <= rows; j++) {
    if (j < rows) {
      y += rowHeights[j];
      // Draw row labels (1-18) excluding the first null row
      if (j > 0) {
        text(j, colWidths[0] / 2, y - rowHeights[j] / 2);
      }
    }
    line(0, y, width, y);
  }

  // Draw cells with their respective colors and shapes
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      fill(cellColors[i][j]);
      if (cellShapes[i][j] === 'circle') {
        ellipse(x + colWidths[i] / 2, y + rowHeights[j] / 2, colWidths[i], rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleTopLeft') {
        triangle(x, y, x + colWidths[i], y, x, y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleTopRight') {
        triangle(x + colWidths[i], y, x, y, x + colWidths[i], y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleBottomRight') {
        triangle(x + colWidths[i], y + rowHeights[j], x + colWidths[i], y, x, y + rowHeights[j]);
      } else if (cellShapes[i][j] === 'triangleBottomLeft') {
        triangle(x, y + rowHeights[j], x + colWidths[i], y + rowHeights[j], x, y);
      } else {
        rect(x, y, colWidths[i], rowHeights[j]);
      }
      // Draw column labels in the first row
      if (j == 0 && i > 0) { // Skip the first cell (i = 0)
        fill(255); // Text color white
        text(getColumnName(i), x + colWidths[i] / 2, y + rowHeights[j] / 2);
      }
      // Draw row labels in the first column
      if (i == 0 && j > 0) { // Skip the first cell (j = 0)
        fill(255); // Text color white
        text(j, x + colWidths[i] / 2, y + rowHeights[j] / 2);
      }
      y += rowHeights[j];
    }
    x += colWidths[i];
  }
}

function mousePressed() {
  let x = 0;
  let y = 0;

  // Check for column drag (only in the first row) and exclude the null column
  if (mouseY < rowHeights[0] && mouseX > colWidths[0]) {
    for (let i = 1; i < cols; i++) { // Start from 1 to exclude the null column
      x += colWidths[i - 1];
      if (mouseX > x - 5 && mouseX < x + 5) {
        dragCol = i;
        offsetX = mouseX - x;
        dragging = true;
        return;
      }
    }
  }

  // Check for row drag (only in the first column) and exclude the null row
  if (mouseX < colWidths[0] && mouseY > rowHeights[0]) {
    for (let j = 1; j < rows; j++) { // Start from 1 to exclude the null row
      y += rowHeights[j - 1];
      if (mouseY > y - 5 && mouseY < y + 5) {
        dragRow = j;
        offsetY = mouseY - y;
        dragging = true;
        return;
      }
    }
  }

  // Check for cell click to change color and shape
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      if (i == 0 || j == 0) {
        y += rowHeights[j];
        continue;
      }
      if (mouseX > x && mouseX < x + colWidths[i] && mouseY > y && mouseY < y + rowHeights[j]) {
        if (cellShapes[i][j] === 'triangleTopLeft') {
          cellShapes[i][j] = 'triangleTopRight';
        } else if (cellShapes[i][j] === 'triangleTopRight') {
          cellShapes[i][j] = 'triangleBottomRight';
        } else if (cellShapes[i][j] === 'triangleBottomRight') {
          cellShapes[i][j] = 'triangleBottomLeft';
        } else if (cellShapes[i][j] === 'triangleBottomLeft') {
          cellColors[i][j] = color(255); // Toggle to white
          cellShapes[i][j] = 'rect'; // Toggle to rectangle
        } else {
          cellColors[i][j] = selectedColor;
          cellShapes[i][j] = drawShape === 'triangle' ? 'triangleTopLeft' : drawShape;
        }
        return;
      }
      y += rowHeights[j];
    }
    x += colWidths[i];
  }
}


function mouseDragged() {
  // Set dragging flag to true if mouse is moved while pressed
  dragging = true;

  // Resize columns
  if (dragCol > 0) { // Prevent resizing the null column
    let xOffset = mouseX - offsetX;
    let newWidth = xOffset - sumArray(colWidths, dragCol - 1);
    colWidths[dragCol - 1] = max(newWidth, 20); // Minimum column width
  }

  // Resize rows
  if (dragRow > 0) { // Prevent resizing the null row
    let yOffset = mouseY - offsetY;
    let newHeight = yOffset - sumArray(rowHeights, dragRow - 1);
    rowHeights[dragRow - 1] = max(newHeight, 20); // Minimum row height
  }
}

function mouseReleased() {
  dragCol = -1;
  dragRow = -1;
  dragging = false;
}

function createSwatch(col, x, y) {
  let swatch = createDiv('');
  swatch.style('width', '20px');
  swatch.style('height', '20px');
  swatch.style('background-color', col);
  swatch.position(x, y);
  swatch.mousePressed(() => selectedColor = col);
}

function downloadCanvas() {
  saveCanvas('myCanvas', 'jpg');
}

function sumArray(arr, end) {
  let sum = 0;
  for (let i = 0; i < end; i++) {
    sum += arr[i];
  }
  return sum;
}

function getColumnName(index) {
  let name = '';
  while (index > 0) {
    index--;
    name = String.fromCharCode(65 + (index % 26)) + name;
    index = Math.floor(index / 26);
  }
  return name;
}

function mousePressed() {
  let x = 0;
  let y = 0;

  // Check for column drag (only in the first row) and exclude the null column
  if (mouseY < rowHeights[0] && mouseX > colWidths[0]) {
    for (let i = 1; i < cols; i++) { // Start from 1 to exclude the null column
      x += colWidths[i - 1];
      if (mouseX > x - 5 && mouseX < x + 5) {
        dragCol = i;
        offsetX = mouseX - x;
        dragging = true;
        return;
      }
    }
  }

  // Check for row drag (only in the first column) and exclude the null row
  if (mouseX < colWidths[0] && mouseY > rowHeights[0]) {
    for (let j = 1; j < rows; j++) { // Start from 1 to exclude the null row
      y += rowHeights[j - 1];
      if (mouseY > y - 5 && mouseY < y + 5) {
        dragRow = j;
        offsetY = mouseY - y;
        dragging = true;
        return;
      }
    }
  }

  // Check for cell click to change color and shape
  x = 0;
  for (let i = 0; i < cols; i++) {
    y = 0;
    for (let j = 0; j < rows; j++) {
      // Skip the cells in the first row and first column
      if (i == 0 || j == 0) {
        y += rowHeights[j];
        continue;
      }
      if (mouseX > x && mouseX < x + colWidths[i] && mouseY > y && mouseY < y + rowHeights[j]) {
        if (cellColors[i][j].toString() === selectedColor.toString() && cellShapes[i][j] === drawShape) {
          cellColors[i][j] = color(255); // Toggle back to white
          cellShapes[i][j] = 'rect'; // Toggle back to default shape
        } else if (cellShapes[i][j] === 'triangleTopLeft') {
          cellShapes[i][j] = 'triangleTopRight';
        } else if (cellShapes[i][j] === 'triangleTopRight') {
          cellShapes[i][j] = 'triangleBottomRight';
        } else if (cellShapes[i][j] === 'triangleBottomRight') {
          cellShapes[i][j] = 'triangleBottomLeft';
        } else if (cellShapes[i][j] === 'triangleBottomLeft') {
          cellColors[i][j] = color(255); // Toggle back to white
          cellShapes[i][j] = 'rect'; // Toggle back to default shape
        } else {
          cellColors[i][j] = selectedColor;
          cellShapes[i][j] = drawShape === 'triangle' ? 'triangleTopLeft' : drawShape;
        }
        return; // Exit after finding the cell
      }
      y += rowHeights[j];
    }
    x += colWidths[i];
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.8);
  drawGrid();
}

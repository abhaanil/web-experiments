// Get the grid container and the download button
const grid = document.getElementById('circleGrid');
const downloadBtn = document.getElementById('downloadBtn');
let isMouseDown = false;

// Total number of circles (28 columns x 14 rows = 392 circles)
const totalCircles = 28 * 14;

// Function to toggle circle color
function toggleCircleColor(circle) {
    circle.classList.toggle('active');
}

// Loop to create the circles
for (let i = 0; i < totalCircles; i++) {
    // Create a new div element for each circle
    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    // Add click event listener to toggle color
    circle.addEventListener('click', function() {
        toggleCircleColor(circle);
    });
    
    // Add event listener for mouse over
    circle.addEventListener('mouseover', function() {
        if (isMouseDown) {
            toggleCircleColor(circle);
        }
    });
    
    // Append the circle to the grid container
    grid.appendChild(circle);
}

// Event listeners to track mouse down and up states
document.addEventListener('mousedown', function(event) {
    // Prevent interaction if the download button is clicked
    if (!downloadBtn.contains(event.target)) {
        isMouseDown = true;
    }
});

document.addEventListener('mouseup', function() {
    isMouseDown = false;
});

// Function to download the artwork as a JPEG
downloadBtn.addEventListener('click', function() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 1037;
    canvas.height = 523;
    const ctx = canvas.getContext('2d');

    // Fill the background with black color
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each circle on the canvas
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        const col = index % 28;
        const row = Math.floor(index / 28);
        const x = col * (35.6 + 1.2);
        const y = row * (35.6 + 1.2);
        ctx.beginPath();
        ctx.arc(x + 17.8, y + 17.8, 17.8, 0, 2 * Math.PI);
        ctx.fillStyle = circle.classList.contains('active') ? 'white' : '#191919';
        ctx.fill();
    });

    // Create a link element to download the canvas as JPEG
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = 'artwork.jpg';
    link.click();
});

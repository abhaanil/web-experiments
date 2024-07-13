function checkImageName() {
    const input = document.getElementById('image-name').value.toLowerCase().replace(/\s+/g, '-');
    const hiddenImages = document.querySelectorAll('.hidden-image');
    let found = false;

    hiddenImages.forEach(image => {
        const imageName = image.id.toLowerCase();
        if (input === imageName) {
            image.style.display = 'block';
            found = true;
            addFloatingBox(image.id);
        }
    });

    if (!found) {
        alert('No image found with the given coordinates.');
    }
}

function addFloatingBox(imageId) {
    const container = document.getElementById('floating-box-container');
    const existingBox = document.getElementById(`box-${imageId}`);

    // Check if the image is already added
    if (existingBox) return;

    const box = document.createElement('div');
    box.className = 'floating-box';
    box.id = `box-${imageId}`;
    box.innerHTML = `
        <span>${imageId.replace(/-/g, ' ')}</span>
        <button class="close-btn" onclick="removeImage('${imageId}')">&times;</button>
    `;
    container.appendChild(box);
}

function removeImage(imageId) {
    const image = document.getElementById(imageId);
    if (image) {
        image.style.display = 'none';
    }
    const box = document.getElementById(`box-${imageId}`);
    if (box) {
        box.remove();
    }
}

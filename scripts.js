// Button event listeners
document.getElementById('startButton').addEventListener('click', showUpload);
document.getElementById('uploadButton').addEventListener('click', handleSkinUpload);
document.getElementById('applyButton').addEventListener('click', applyCustomization);
document.getElementById('downloadButton').addEventListener('click', downloadImage);
document.getElementById('homeButton').addEventListener('click', showHome);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // 2D rendering context so we can manipulate the canvas image data
let baseSkin, customization;

const skinUpload = document.getElementById('skinUpload');
const fileNameSpan = document.getElementById('fileName');

skinUpload.addEventListener('change', function() {
    if (skinUpload.files.length > 0) {
        fileNameSpan.textContent = skinUpload.files[0].name;
    } else {
        fileNameSpan.textContent = '';
    }
});

function showUpload() { // Show the upload screen and hide the home screen
    document.getElementById('home').classList.add('hidden');
    document.getElementById('upload').classList.remove('hidden');
}

function handleSkinUpload() { 
    const file = document.getElementById('skinUpload').files[0]; 
    // get 1 file only
    const reader = new FileReader(); // Create a new FileReader object to read the file
    // reader will save the file as a data URL on buffer and then we can use it to create an image
    reader.onload = function(e) {
        baseSkin = new Image(); // Create a new Image object
        baseSkin.src = e.target.result; // Set the source of the image to the data URL
        baseSkin.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear before redrawing
            ctx.drawImage(baseSkin, 0, 0, canvas.width, canvas.height);  
            // Draw the image on the canvas ctx
            showSelect();
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

function showSelect() {
    document.getElementById('upload').classList.add('hidden');
    document.getElementById('select').classList.remove('hidden');
    loadCustomizations(); // Load the customizations
}

async function loadCustomizations() {
    const customizations = [
        'pumpkin',
        'scary_pumpkin',
        'face_mask_1',
        'face_mask_2',
        'body_mask_1'
    ]; // List of customizations
    const container = document.getElementById('customizations');
    container.innerHTML = ''; // Clear previous customizations

    customizations.forEach(customization => {
        const img = document.createElement('img');
        img.src = `public/assets/ui/${customization}.png`;
        img.alt = customization;
        img.classList.add('customization');
        img.addEventListener('click', () => selectCustomization(customization));
        container.appendChild(img); // Append the image to the container
    });
}

function selectCustomization(customizationFile) {
    // Remove 'selected' class from all icons
    document.querySelectorAll('.customizations img').forEach(img => {
        img.classList.remove('selected');
    });

    // Add 'selected' class to the clicked icon
    const selectedImg = document.querySelector(`img[src="public/assets/ui/${customizationFile}.png"]`);
    if (selectedImg) {
        selectedImg.classList.add('selected');
    }

    customization = new Image(); // Create a new Image object
    customization.src = `public/assets/customizations/${customizationFile}.png`; // Set the source of the image to the customization file

    customization.onload = function() {
        ctx.drawImage(customization, 0, 0, canvas.width, canvas.height); 
        // Draw the customization on the canvas ctx
    };
}

function applyCustomization() {
    document.getElementById('select').classList.add('hidden');
    document.getElementById('product').classList.remove('hidden');
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'customized_skin.png';
    link.click();
}

function showHome() {
    document.getElementById('product').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('upload').classList.add('hidden');
    document.getElementById('select').classList.add('hidden');
}
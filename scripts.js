document.getElementById('startButton').addEventListener('click', showUpload);
document.getElementById('uploadButton').addEventListener('click', handleSkinUpload);
document.getElementById('applyButton').addEventListener('click', applyCustomization);
document.getElementById('downloadButton').addEventListener('click', downloadImage);
document.getElementById('homeButton').addEventListener('click', showHome);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let baseSkin, customization;

function showUpload() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('upload').classList.remove('hidden');
}

function handleSkinUpload() {
    const file = document.getElementById('skinUpload').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        baseSkin = new Image();
        baseSkin.src = e.target.result;
        baseSkin.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseSkin, 0, 0, canvas.width, canvas.height);
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
    loadCustomizations();
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
        container.appendChild(img);
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

    customization = new Image();
    customization.src = `public/assets/customizations/${customizationFile}.png`;

    customization.onload = function() {
        ctx.drawImage(customization, 0, 0, canvas.width, canvas.height);
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
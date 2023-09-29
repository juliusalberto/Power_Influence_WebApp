let selectedDot = null;

function addDot(event) {
    const svg = document.getElementById('matrix');

    // Create the circle (dot) element
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", event.offsetX);
    circle.setAttribute("cy", event.offsetY);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", "#FFB3E8");
    circle.onclick = openModal;

    // Assign a unique ID to the circle
    const uniqueId = `dot-${Date.now()}`;
    circle.setAttribute("id", uniqueId);
    svg.appendChild(circle);

    // Create the text element (label) and link it to the circle using the unique ID
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", event.offsetX + 10);  // position text 10 units to the right of the dot
    text.setAttribute("y", event.offsetY);
    text.textContent = "";  // default to an empty string
    text.style.fontSize = "12px";
    text.style.fontFamily = "Arial, sans-serif";
    text.classList.add("dot-label");
    text.setAttribute("data-dot-id", uniqueId);
    svg.appendChild(text);

    // Add a row to the table for the new dot
    addRowToTable(circle, text, uniqueId);  // Passing the uniqueId here
}


function addRowToTable(dot, text, uniqueId) {
    const table = document.getElementById('dotTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();

    // Name column
    const nameCell = row.insertCell(0);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.addEventListener('input', function() {
        dot.setAttribute('data-name', nameInput.value);
        text.textContent = nameInput.value;  // Update the SVG text as well
    });
    nameCell.appendChild(nameInput);

    // Color column
    const colorCell = row.insertCell(1);
    const pastelColors = ['#FFB3E8', '#FFCCB3', '#FFD966', '#B3FFB3', '#7286D3'];

    pastelColors.forEach((color, index) => {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = `color-${uniqueId}`; 
        radioButton.value = color;
        radioButton.id = `color-${uniqueId}-${index}`;
        radioButton.addEventListener('change', function() {
            dot.setAttribute('fill', this.value);
        });
    
        const label = document.createElement('label');
        label.setAttribute('for', radioButton.id);
        label.style.backgroundColor = color;
        label.classList.add('color-option');
    
        colorCell.appendChild(radioButton);
        colorCell.appendChild(label);
    });


    // Action column (to delete the dot)
    const actionCell = row.insertCell(2);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        dot.remove();
        text.remove();  // remove the SVG text
        row.remove();
    });
    actionCell.appendChild(deleteButton);
}

function openModal(event) {
    event.stopPropagation();  // Prevent triggering parent's click event
    selectedDot = event.target;
    const modal = document.getElementById('dotModal');
    modal.style.display = 'block';
    const nameInput = document.getElementById('dotName');
    const associatedText = document.querySelector(`.dot-label[data-dot-id="${selectedDot.id}"]`);
    nameInput.value = associatedText.textContent || '';
    const colorInput = document.getElementById('dotColor');
    colorInput.value = selectedDot.getAttribute('fill');
}


function closeModal() {
    const modal = document.getElementById('dotModal');
    modal.style.display = 'none';
}

function updateDot() {
    const nameInput = document.getElementById('dotName');
    const colorInput = document.getElementById('dotColor');
    selectedDot.setAttribute('data-name', nameInput.value);
    selectedDot.setAttribute('fill', colorInput.value);
    
    // Find the associated text element using the dot's ID and update its content
    const associatedText = document.querySelector(`.dot-label[data-dot-id="${selectedDot.id}"]`);
    if (associatedText) {
        associatedText.textContent = nameInput.value;
    }

    closeModal();
}

function exportToPng() {
    const svgElement = document.getElementById('matrix');
    
    // Convert SVG to dataURL
    const xml = new XMLSerializer().serializeToString(svgElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;
    
    // Create a new Image object
    const img = new Image();
    img.src = image64;
    
    // Once the image is loaded, draw it on the canvas and then download it
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.width.baseVal.value;
        canvas.height = svgElement.height.baseVal.value;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const pngData = canvas.toDataURL('image/png');
        
        const a = document.createElement('a');
        a.href = pngData;
        a.download = 'matrix.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
}


// Prevent modal from closing when clicking inside it
document.querySelector('.modal-content').onclick = function(event) {
    event.stopPropagation();
}

// Close modal when clicking outside of it
document.getElementById('dotModal').onclick = closeModal;

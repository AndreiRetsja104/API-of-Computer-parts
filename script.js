// Sample external API endpoints
const jsonApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.json';
const xmlApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.xml';

// Function to fetch data from the external JSON API
function fetchJsonData() {
    fetch(jsonApiEndpoint)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched JSON data:', data); // Add this line for debugging
            displayComputerParts(data, '#computer-parts-info-json');
            visualizeData(data);
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}


// Function to fetch data from the external XML API
function fetchXmlData() {
    return fetch(xmlApiEndpoint)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'application/xml');
            const parts = parseXmlData(xmlDoc);
            displayComputerParts(parts, '#computer-parts-info-xml');
        })
        .catch(error => {
            console.error('Error fetching XML data:', error);
            // Display an error message on the webpage
            document.querySelector('#computer-parts-info-xml').innerHTML = 'Error fetching XML data. Please try again later.';
            throw error; // Re-throw the error to keep it consistent with the promise chain
        });
}

// Function to parse XML data
function parseXmlData(xmlDoc) {
    const parts = [];
    const items = xmlDoc.querySelectorAll('part');
    
    items.forEach(item => {
        const part = {
            name: item.querySelector('name').textContent,
            type: item.querySelector('type').textContent,
            price: parseFloat(item.querySelector('price').textContent),
            manufacturer: item.querySelector('manufacturer').textContent,
            stock: parseInt(item.querySelector('stock').textContent),
        };
        parts.push(part);
    });

    return parts;
}

// Function to display computer parts
function displayComputerParts(parts, targetElement) {
    const computerPartsInfo = document.querySelector(targetElement);

    // Check if the target element exists
    if (!computerPartsInfo) {
        console.error('Target element not found:', targetElement);
        return;
    }

    // Clear existing content
    computerPartsInfo.innerHTML = '';

    // If parts is an array, iterate over each part and display information
    if (Array.isArray(parts)) {
        parts.forEach(part => {
            const partInfo = createPartInfo(part);
            computerPartsInfo.innerHTML += partInfo;
        });
    } else if (typeof parts === 'object') {
        // If parts is a single object, display information for that part
        const partInfo = createPartInfo(parts);
        computerPartsInfo.innerHTML = partInfo;
    } else {
        console.error('Invalid parts data:', parts);
    }
}


function createPartInfo(part) {
    // Create a string containing HTML markup with information about the part
    const stockInfo = part.stock !== undefined ? `<p>Stock: ${part.stock}</p>` : '';
    const quantityInfo = part.quantity !== undefined ? `<p>Quantity: ${part.quantity}</p>` : ''; // Add this line for quantity
    const specificationsInfo = part.specifications
        ? `<p>Cores: ${part.specifications.cores}</p><p>Clock Speed: ${part.specifications.clockSpeed}</p>`
        : '';

    return `
        <div class="part">
            <h2>ID: ${part.id}</h2>
            <h2>${part.name}</h2>
            <p>Type: ${part.type}</p>
            <p>Price: € ${part.price}</p>
            <p>Manufacturer: ${part.manufacturer}</p>
            ${quantityInfo}
            ${stockInfo}
            ${specificationsInfo}
        </div>
    `;
}





function performSearch() {
    fetchJsonData()
        .then(data => {
            const typeInput = document.getElementById('type-input').value.trim().toLowerCase();
            const manufacturerInput = document.getElementById('manufacturer-input').value.trim().toLowerCase();
            const priceInput = document.getElementById('price-input').value.trim();

            // Extracting min and max values from the priceInput
            const [minPrice, maxPrice] = priceInput.split('-').map(val => parseFloat(val.trim()));

            const filteredData = data.filter(part => {
                const matchType = !typeInput || part.type.toLowerCase().includes(typeInput);
                const matchManufacturer = !manufacturerInput || part.manufacturer.toLowerCase().includes(manufacturerInput);

                // Check if the price is within the specified range
                const matchPrice = isNaN(minPrice) || isNaN(maxPrice) ||
                    (minPrice <= part.price && part.price <= maxPrice);

                return matchType && matchManufacturer && matchPrice;
            });

            displayComputerParts(filteredData, '#computer-parts-info-json');
        })
        .catch(error => console.error('Error performing search:', error));
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch JSON data
        const jsonData = await fetchJsonData();
        // Display and visualize JSON data
        displayComputerParts(jsonData, '#computer-parts-info-json');
        visualizeData(jsonData);

        // Fetch XML data
        const xmlData = await fetchXmlData();
        
		// Display XML data
        displayComputerParts(xmlData, '#computer-parts-info-xml');
    } catch (error) {
        
		// Handle errors
        console.error('Error:', error);
        document.querySelector('#computer-parts-info-json').innerHTML = 'Error fetching JSON data. Please try again later.';
        document.querySelector('#computer-parts-info-xml').innerHTML = 'Error fetching XML data. Please try again later.';
    }
});

async function fetchJsonData() {
    const response = await fetch(jsonApiEndpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

async function fetchXmlData() {
    try {
        const response = await fetch(xmlApiEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        return parseXmlData(xmlDoc);
    } catch (error) {
        console.error('Error fetching XML data:', error);
        throw error; // Propagate the error to the caller
    }
}

// Function for data visualization using D3.js
function visualizeData(data) {
    // Example: Create a bar chart of stock levels using D3.js
    const svg = d3.select('#computer-parts-info')
        .append('svg')
        .attr('width', 400)
        .attr('height', 200);

    const stockValues = data.map(part => part.stock);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(stockValues)])
        .range([0, 400]);

    svg.selectAll('rect')
        .data(stockValues)
        .enter()
        .append('rect')
        .attr('x', 10)
        .attr('y', (d, i) => i * 40)
        .attr('width', d => xScale(d))
        .attr('height', 30)
        .attr('fill', 'blue');
}

// Fetch data on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchJsonData();
    fetchXmlData();
});




function addData() {
    // Get values from the form
    const type = document.getElementById('type').value;
    const name = document.getElementById('name').value;
    const manufacturer = document.getElementById('manufacturer').value;
    const price = parseFloat(document.getElementById('price').value);
    const cores = parseInt(document.getElementById('cores').value);
    const clockSpeed = document.getElementById('clockSpeed').value;

    // Create a new data object
    const newData = {
        type: type,
        name: name,
        manufacturer: manufacturer,
        price: price,
        specifications: {
            cores: cores,
            clockSpeed: clockSpeed
        }
    };

    // Fetch the existing data from the JSON file
     fetch('data.json')
        .then(response => response.json())
        .then(existingData => {
            // Add the new data to the existing array
            existingData.push(newData);

            // Write the updated data back to the JSON file
            return fetch('data.json', {
                method: 'PUT', // Use 'PUT' method to update the file
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(existingData)
            });
        })
        .then(response => {
            if (response.ok) {
                console.log('Data added successfully!');
            } else {
                console.error('Failed to add data:', response.statusText);
            }
        })
        .catch(error => console.error('Error:', error));
}
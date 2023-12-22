// Sample external API endpoints
const jsonApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.json';
const xmlApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.xml';

/*
* Nov 25, 2023 by
*
*@ refernece  https://developer.mozilla.org/en-US/docs/Web/API/fetch
* Author MDN contributors
*
*/
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

/*
* Nov 25, 2023 by
*
*@ refernece  https://developer.mozilla.org/en-US/docs/Web/API/fetch
* Author MDN contributors
*
*/
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

/*
* Dec 20, 2023 
*
* @ reference  https://developer.mozilla.org/en-US/docs/Web/XML/Parsing_and_serializing_XML 
*
* Author MDN contributors
*/
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

/*
*
*
*
*
*
*/
//  Displays computer parts information on the webpage
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

/*
*
*
*
*
*
*/
//Creates HTML markup for displaying information about a computer part
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

/*
*
*
*
*
*
*/
//Performs a search based on user input and displays filtered results.
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

/*
*
*
*
*
*
*/
// async Fetches data from the external Json API 
async function fetchJsonData() {
    const response = await fetch(jsonApiEndpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

/*
*
*
*
*
*
*/
// async Fetches data from the external XML API 
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

/*
*
*
*
*
*
*/
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

/*
*
*
*
*
*
*/
// Fetch data on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchJsonData();
    fetchXmlData();
});

// Function for Add the data connector will added here in the future 

// Function for connector between MySql main fork will added here in the future 



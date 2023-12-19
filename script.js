// Sample external API endpoints
const jsonApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.json';
const xmlApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/API-of-Computer-parts/main/data.xml';

// Function to fetch data from the external JSON API
function fetchJsonData() {
    fetch(jsonApiEndpoint)
        .then(response => response.json())
        .then(data => {
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
    return `
        <div class="part">
            <h2>${part.name}</h2>
            <p>Type: ${part.type}</p>
            <p>Price: € ${part.price}</p>
            <p>Manufacturer: ${part.manufacturer}</p>
            <p>Stock: ${part.stock}</p>
        </div>
    `;
}

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


// Function for data visualization using D3.js
function visualizeData3D(data, targetElement, chartWidth, chartHeight) {
    // Clear existing chart
    d3.select(targetElement + ' svg').remove();

    // Example: Create a 3D bar chart of stock levels using D3.js
    const svg = d3.select(targetElement)
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    const stockValues = data.map(part => part.stock);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(stockValues)])
        .range([0, chartWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map((_, i) => i))
        .range([0, chartHeight])
        .padding(0.1);

    const zScale = d3.scaleLinear()
        .domain([0, d3.max(stockValues)])
        .range([0, 100]);

    svg.selectAll('rect')
        .data(stockValues)
        .enter()
        .append('rect')
        .attr('x', 10)
        .attr('y', (d, i) => yScale(i))
        .attr('width', d => xScale(d))
        .attr('height', yScale.bandwidth())
        .attr('fill', 'blue')
        .attr('opacity', d => zScale(d) / 100);
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

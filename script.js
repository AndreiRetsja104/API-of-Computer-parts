// Sample external API endpoints
   const jsonApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/APIOfComputerParts/main/data.json';
   const xmlApiEndpoint = 'https://raw.githubusercontent.com/AndreiRetsja104/APIOfComputerParts/main/data.xml';
// Function to fetch data from the external API
async function fetchData(apiEndpoint, parser, targetElement) {
    try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');

        let data;

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else if (contentType.includes('text/plain')) {
            // Manually parse JSON from plain text
            const textData = await response.text();
            data = JSON.parse(textData);
        } else if (contentType.includes('application/xml')) {
            const xmlData = await response.text();
            data = parser(xmlData);
        } else {
            throw new Error(`Unsupported content type: ${contentType}`);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching data from ${apiEndpoint}:`, error);

        if (targetElement) {
            // Display an error message on the webpage
            const element = document.querySelector(targetElement);
            if (element) {
                element.innerHTML = `Error fetching data. Please try again later.`;
            } else {
                console.error('Target element not found:', targetElement);
            }
        } else {
            console.error('Error:', error);
            throw error; // Propagate the error to the caller
        }
    }
}

function parseXmlData(xmlString) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

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
    } catch (error) {
        console.error('Error parsing XML data:', error);
        return []; // Return an empty array in case of an error
    }
}

function visualizeData(data) {
    // Clear existing chart
    d3.select('#computer-parts-info svg').remove();

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

document.addEventListener('DOMContentLoaded', function () {
    const ajaxButton = document.getElementById('ajaxButton');

    ajaxButton.addEventListener('click', async function () {
        try {
            // Replace 'yourAdditionalApiEndpoint' with the actual URL of your additional API endpoint
            const additionalData = await fetchData('yourAdditionalApiEndpoint');

            // Call visualizeData with the new data
            visualizeData(additionalData);
        } catch (error) {
            console.error('Error fetching additional data:', error);
            // Handle error as needed
        }
    });
});
// Various polyfills to use newer ECMAScript syntax in older browsers like async/await
import "@babel/polyfill";

/**
 * Asynchronously load a script instead of blocking the HTML rendering
 *
 * @param {string} url
 * @return {Promise<void>}
 */
const loadScript = url => new Promise(resolve => {
    const script = document.createElement("script");

    script.setAttribute("src", url);
    script.setAttribute("async", true);

    document.head.appendChild(script);

    script.addEventListener("load", resolve);
});

// Asynchronous main function (thanks ECMAScript for NOT implementing top-level await...)
async function main() {
    await loadScript("https://cdn.anychart.com/releases/v8/js/anychart-base.min.js");
    await loadScript("https://cdn.anychart.com/releases/v8/js/anychart-tag-cloud.min.js");

    // Endpoint for analyzing and processing requested data from Tweets
    const analyzeEndpoint = "http://localhost:8081/analyze";

    try {
        // Fetch data processed by the server for the chart
        const response = await fetch("http://localhost:8081/analyze");

        // JSON response formatted for the chart
        const {data} = await response.json();

        // create a tag (word) cloud chart
        const chart = anychart.tagCloud(data);

        // set a chart title
        chart.title("Ressenti général sur l'échantillon de Tweets analysés pour l'émission #Popcorn");

        // set an array of angles at which the words will be laid out
        chart.angles([0]);

        // enable a color range (with category property in data)
        chart.colorRange(false);

        // set the color range length
        chart.colorRange().length('80%');

        // display the word cloud chart
        chart.container("container");
        chart.draw();
    } catch (error) {
        console.log(`An error occcured while fetching data from ${analyzeEndpoint}`);
        console.error(error.message);
    }
}

// Waiting for the DOM to be loaded before trying to inserting the word cloud
window.addEventListener("load", main);

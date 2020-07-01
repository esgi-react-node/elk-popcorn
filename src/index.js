import "@babel/polyfill";

async function main() {
    console.log("GET http://localhost:8081/search");
    const response = await fetch("http://localhost:8081/search");

    if (!response.ok) {
        throw new Error("Unable to fetch data. Did you forgot to ingest data?");
    }

    const {hits: {hits}} = await response.json();

    console.log(hits);

    const data = [
        {"x": "Mandarin chinese", "value": 1090000000},
        {"x": "English", "value": 983000000},
        {"x": "Hindustani", "value": 544000000},
        {"x": "Spanish", "value": 527000000},
        {"x": "Arabic", "value": 422000000},
        {"x": "Malay", "value": 281000000},
        {"x": "Russian", "value": 267000000},
        {"x": "Bengali", "value": 261000000},
        {"x": "Portuguese", "value": 229000000},
        {"x": "French", "value": 229000000},
        {"x": "Hausa", "value": 150000000},
        {"x": "Punjabi", "value": 148000000},
        {"x": "Japanese", "value": 129000000},
        {"x": "German", "value": 129000000},
        {"x": "Persian", "value": 121000000}
    ];

    // create a tag (word) cloud chart
    const chart = anychart.tagCloud(data);

    // set a chart title
    chart.title("Mots les plus utilisés dans les Tweets de #Popcorn");

    // set an array of angles at which the words will be laid out
    chart.angles([0]);

    // enable a color range (with category property in data)
    chart.colorRange(false);

    // set the color range length
    chart.colorRange().length('80%');

    // display the word cloud chart
    chart.container("container");
    chart.draw();
}

window.addEventListener("load", () => {
    main();
});

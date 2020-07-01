import "@babel/polyfill";

async function main() {
    console.log("GET http://localhost:8081/search");

    const response = await fetch("http://localhost:8081/search");

    const jsonResponse = await response.json();
    const tokens = jsonResponse.data.tokens;
    const normalizedTokens = tokens.map(({token}) => token);
    const occurrences = normalizedTokens.reduce((occurrences, word) => ({...occurrences, [word]: occurrences[word] ? occurrences[word] + 1 : 1}), {});
    const sortedOccurrences = Object.entries(occurrences).sort(([, x], [, y]) => y - x).slice(0, 200);
    const data = sortedOccurrences.map(([x, value]) => ({x, value}));

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

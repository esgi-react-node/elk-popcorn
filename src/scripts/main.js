define(['./d3.v3', './elasticsearch'], function (d3, elasticsearch) {
    "use strict";
    var client = new elasticsearch.Client({
        hosts: [
          'http://localhost:9200/',
        ]
      });
    client.search({
        index: 'nfl',
        size: 5,
        body: {
            // Begin query.
            query: {
                // Boolean query for matching and excluding items.
                bool: {
                    must: { match: { "description": "TOUCHDOWN" }},
                    must_not: { match: { "qtr": 5 }}
                }
            },
            // Aggregate on the results
            aggs: {
                touchdowns: {
                    terms: {
                        field: "qtr",
                        // order by quarter, ascending
                        order: { "_term" : "asc" }
                    }
                }
            }
            // End query.
        }
    }).then(function (resp) {
        console.log(resp);
        // D3 code goes here.
    });
});
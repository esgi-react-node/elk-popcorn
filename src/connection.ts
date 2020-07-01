import elasticsearch from "elasticsearch"

export const client = new elasticsearch.Client( {
  hosts: [
    'http://localhost:9200/',
  ]
});

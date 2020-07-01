import { client } from "./connection";

export interface Tweet {
  created_at: string;
  full_text: string;
  retweet_count: number;
  favorite_count: number;
  lang: string;
}

export const bulk = async (data: Tweet[]) => {
  client.indices.create({
    index: 'tweet',
    body: {
      mappings: {
        properties: {
          created_at: { type: 'text' },
          full_text: { type: 'text' },
          retweet_count: { type: 'Numeric' },
          favorite_count: { type: 'Numeric' },
          lang: { type: 'text' }
        }
      }
    }
  }, { ignore: [400] });
  const body = data.flatMap(doc => [{ index: { _index: 'tweet' } }, doc])
  await client.bulk({
    refresh: true,
    body
  })
  const {count} = await client.count({index: 'tweet'})
  console.log('Documents added : ' + count);
}

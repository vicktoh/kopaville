import algoliasearch from "algoliasearch";
import { ALGOLIA_API_SEARCH_KEY, ALGOLIA_APP_ID } from "../constants/Storage";

export const algoliaIndex = (indexName: string) => {
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_SEARCH_KEY);
  return client.initIndex(indexName);
};

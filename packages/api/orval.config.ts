import { defineConfig } from "orval";
import responseTransformer from "./orval.transformer";

export default defineConfig({
  jiho: {
    input: {
      target: "http://localhost:4000/api/v1/docs/json",
    },
    output: {
      target: "src/_generated/index.ts",
      schemas: "src/_generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      baseUrl: "http://localhost:4000/api/v1",
      override: {
        transformer: responseTransformer,
        query: {
          version: 5,
          useQuery: true,
          useMutation: true,
          useInfinite: true,
          usePrefetch: true,
          useInvalidate: true,
          shouldExportHttpClient: false,
          shouldExportQueryKey: true,
          shouldSplitQueryKey: true,
        },
      },
    },
  },
});

import { defineConfig } from "orval";
import responseTransformer from "./orval.transformer";

export default defineConfig({
  jiho: {
    input: {
      target: "https://uosjudo.com/v3/api-docs",
    },
    output: {
      target: "src/shared/api/_generated/index.ts",
      schemas: "src/shared/api/_generated/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      baseUrl: "https://uosjudo.com",
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

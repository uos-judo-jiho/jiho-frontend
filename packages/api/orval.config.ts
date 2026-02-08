import { defineConfig, QueryOptions } from "orval";
import responseTransformer from "./orval.transformer";

const IS_PROD = process.env.NODE_ENV === "production";

const docTargets = IS_PROD
  ? {
      v2Api: "https://api.uosjudo.com/api/docs/v2-api/json",
      v2Admin: "https://api.uosjudo.com/api/docs/v2-admin/json",
    }
  : {
      v2Api: "http://localhost:4000/api/docs/v2-api/json",
      v2Admin: "http://localhost:4000/api/docs/v2-admin/json",
    };

const baseUrl = IS_PROD ? "https://api.uosjudo.com" : "http://localhost:4000";

const tanstackQueryOptions: QueryOptions = {
  version: 5,
  useQuery: true,
  useMutation: true,
  useInfinite: true,
  usePrefetch: true,
  useSuspenseQuery: true,
  useInvalidate: true,
  shouldExportHttpClient: false,
  shouldExportQueryKey: true,
  shouldSplitQueryKey: true,
};

export default defineConfig({
  v2Api: {
    input: {
      target: docTargets.v2Api,
    },
    output: {
      target: "src/_generated/v2/api/index.ts",
      schemas: "src/_generated/v2/api/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      baseUrl,
      override: {
        transformer: responseTransformer,
        query: tanstackQueryOptions,
      },
    },
  },
  v2Admin: {
    input: {
      target: docTargets.v2Admin,
    },
    output: {
      target: "src/_generated/v2/admin/index.ts",
      schemas: "src/_generated/v2/admin/model",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      baseUrl,
      override: {
        transformer: responseTransformer,
        query: tanstackQueryOptions,
      },
    },
  },
});

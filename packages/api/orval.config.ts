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

const baseQueryOptions = {
  version: 5,
  useInfinite: true,
  usePrefetch: true,
  useSuspenseQuery: true,
  useInvalidate: true,
  shouldExportHttpClient: false,
  shouldExportQueryKey: true,
  shouldSplitQueryKey: true,
} as const;

// NOTE: orval's method-based hook selection is fragile when the useQuery/
// useMutation booleans are set explicitly:
//   - `useQuery: true` forces EVERY operation (incl. POST/PUT/DELETE) to be a
//     query hook → mutations lose `.mutate` ("o.mutate is not a function").
//   - `useMutation: true` on an all-GET spec forces every GET into a mutation
//     → no `*QueryOptions`/suspense hooks ("(void 0) is not a function").
//
// v2Api is entirely read-only GET endpoints, so we force queries only.
const apiQueryOptions: QueryOptions = {
  ...baseQueryOptions,
  useQuery: true,
  useMutation: false,
};

// v2Admin is mixed (GET + write endpoints). Leave useQuery/useMutation unset so
// orval decides per HTTP method: GET → query/suspense, POST/PUT/DELETE → mutation.
const adminQueryOptions: QueryOptions = {
  ...baseQueryOptions,
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
        query: apiQueryOptions,
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
        query: adminQueryOptions,
      },
    },
  },
});

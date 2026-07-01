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

// NOTE: orval generates a GET operation as a *mutation* (not a query) when
// `useMutation` is enabled alongside `useQuery`. v2Api is entirely read-only
// GET endpoints consumed via query/suspense hooks, so it must NOT enable
// useMutation — otherwise no `*QueryOptions`/suspense hooks are emitted and
// SSR (and the client) crash with "(void 0) is not a function".
const apiQueryOptions: QueryOptions = {
  ...baseQueryOptions,
  useQuery: true,
  useMutation: false,
};

// v2Admin has write endpoints, so it keeps mutation hooks.
const adminQueryOptions: QueryOptions = {
  ...baseQueryOptions,
  useQuery: true,
  useMutation: true,
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

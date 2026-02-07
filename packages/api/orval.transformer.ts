import type { GeneratorVerbOptions } from "@orval/core";
import { pascal } from "@orval/core";

type RenameMap = Record<string, string>;

const RESPONSE_NAME_PATTERN = /^(.*?)(\d{3})$/;

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

const renameText = (value: string | undefined, renames: RenameMap) => {
  if (!value) return value;
  const keys = Object.keys(renames);
  if (!keys.length) return value;

  const pattern = new RegExp(
    `\\b(?:${keys.map(escapeRegExp).join("|")})\\b`,
    "g",
  );

  return value.replace(pattern, (match) => renames[match] ?? match);
};

const renameResponseSchemas = (
  verb: GeneratorVerbOptions,
): GeneratorVerbOptions => {
  if (!verb.response.schemas?.length) {
    return verb;
  }

  const baseName = `${pascal(verb.operationName)}Response`;
  const renames = verb.response.schemas.reduce<RenameMap>((acc, schema) => {
    const match = schema.name.match(RESPONSE_NAME_PATTERN);
    if (!match) {
      return acc;
    }

    const statusCode = match[2];
    const newName =
      statusCode === "200" ? baseName : `${baseName}${statusCode}`;

    if (schema.name !== newName) {
      acc[schema.name] = newName;
    }

    return acc;
  }, {});

  if (!Object.keys(renames).length) {
    return verb;
  }

  const replace = (value?: string) => renameText(value, renames);

  return {
    ...verb,
    response: {
      ...verb.response,
      imports:
        verb.response.imports?.map((imp) => ({
          ...imp,
          name: imp.name && renames[imp.name] ? renames[imp.name] : imp.name,
          schemaName:
            imp.schemaName && renames[imp.schemaName]
              ? renames[imp.schemaName]
              : imp.schemaName,
        })) ?? [],
      definition: {
        success:
          replace(verb.response.definition.success) ??
          verb.response.definition.success,
        errors:
          replace(verb.response.definition.errors) ??
          verb.response.definition.errors,
      },
      types: {
        ...verb.response.types,
        success: verb.response.types.success.map((type) => ({
          ...type,
          value: replace(type.value) ?? type.value,
          formData: replace(type.formData) ?? type.formData,
          formUrlEncoded: replace(type.formUrlEncoded) ?? type.formUrlEncoded,
        })),
        errors: verb.response.types.errors.map((type) => ({
          ...type,
          value: replace(type.value) ?? type.value,
          formData: replace(type.formData) ?? type.formData,
          formUrlEncoded: replace(type.formUrlEncoded) ?? type.formUrlEncoded,
        })),
      },
      schemas: verb.response.schemas.map((schema) => {
        const newName = renames[schema.name];
        if (!newName) {
          return schema;
        }

        return {
          ...schema,
          name: newName,
          model: replace(schema.model) ?? schema.model,
          dependencies: schema.dependencies?.map((dep) => renames[dep] ?? dep),
        };
      }),
    },
  };
};

const responseTransformer = (
  verb: GeneratorVerbOptions,
): GeneratorVerbOptions => {
  return renameResponseSchemas(verb);
};

export default responseTransformer;

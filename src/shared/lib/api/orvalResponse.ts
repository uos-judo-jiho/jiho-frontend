import type { AxiosResponse } from "axios";

const isBlob = (value: unknown): value is Blob => {
  return typeof Blob !== "undefined" && value instanceof Blob;
};

const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
  return typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer;
};

const bufferToString = (buffer: ArrayBuffer): string => {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder().decode(buffer);
  }

  // Fallback for environments without TextDecoder
  let result = "";
  const view = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < view.length; i += chunkSize) {
    result += String.fromCharCode(
      ...view.subarray(i, Math.min(i + chunkSize, view.length))
    );
  }
  return result;
};

const tryParseJson = <T>(value: unknown): T => {
  if (typeof value === "string") {
    return JSON.parse(value) as T;
  }

  if (isArrayBuffer(value)) {
    return JSON.parse(bufferToString(value)) as T;
  }

  return value as T;
};

export const parseAxiosResponse = async <T>(
  response: AxiosResponse<unknown>
): Promise<T> => {
  const { data } = response;

  if (isBlob(data)) {
    const text = await data.text();
    return JSON.parse(text) as T;
  }

  return tryParseJson<T>(data);
};

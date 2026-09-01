import type { FieldError } from "react-hook-form";

/** 필드 아래에 붙는 검증 메시지. 에러가 없으면 아무것도 그리지 않는다. */
export const FieldErrorMessage = ({ error }: { error?: FieldError }) =>
  error?.message ? (
    <small className="text-red-600">{error.message}</small>
  ) : null;

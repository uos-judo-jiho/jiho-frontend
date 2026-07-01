import { RouterUrl } from "@/app/routers/router-url";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { v2Admin } from "@packages/api";
import { useState } from "react";
import {
  useForm,
  type FieldError,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

/* ------------------------------------------------------------------ */
/* 추가 정보(선택) — 가입 시점 / 승인 전 모두 동일 필드를 공유한다.        */
/* ------------------------------------------------------------------ */

const additionalSchema = z.object({
  name: z.string().trim().max(20, "이름은 20자 이하여야 합니다.").optional(),
  major: z.string().trim().max(20, "학과는 20자 이하여야 합니다.").optional(),
  year: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\d+$/.test(v) && Number(v) > 0),
      "기수는 1 이상의 정수여야 합니다.",
    )
    .optional(),
  studentId: z
    .string()
    .trim()
    .max(20, "학번은 20자 이하여야 합니다.")
    .optional(),
  // 010 프리픽스는 UI 에서 고정되고, 폼에는 뒤 8자리(1234-5678)만 담는다.
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\d{4}-\d{4}$/.test(v),
      "연락처 뒤 8자리를 입력해주세요. (예: 1234-5678)",
    )
    .optional(),
});

const PHONE_PREFIX = "010";

/** 010 이후 8자리를 1234-5678 형태로 포맷한다(부분 입력도 점진적으로 포맷). */
const formatPhoneSuffix = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

type AdditionalValues = z.infer<typeof additionalSchema>;

type AdditionalPayload = {
  name?: string;
  major?: string;
  year?: number;
  studentId?: string;
  phoneNumber?: string;
};

/** 빈 문자열 필드는 제외하고, year 는 숫자로 변환한 payload 를 만든다. */
const toAdditionalPayload = (values: AdditionalValues): AdditionalPayload => {
  const payload: AdditionalPayload = {};
  if (values.name) payload.name = values.name;
  if (values.major) payload.major = values.major;
  if (values.studentId) payload.studentId = values.studentId;
  // 010 프리픽스를 붙이고 하이픈을 제거해 숫자 11자리로 전송한다.
  if (values.phoneNumber) {
    const digits = values.phoneNumber.replace(/\D/g, "");
    if (digits) payload.phoneNumber = `${PHONE_PREFIX}${digits}`;
  }
  if (values.year && values.year.trim() !== "")
    payload.year = Number(values.year);
  return payload;
};

const EMPTY_ADDITIONAL: AdditionalValues = {
  name: "",
  major: "",
  year: "",
  studentId: "",
  phoneNumber: "",
};

/* ------------------------------------------------------------------ */
/* 1단계: 필수 가입 정보 (+ 선택 추가 정보)                              */
/* ------------------------------------------------------------------ */

/* 회원 유형(권한) — API 스키마상 optional 이지만 가입 UX 상 필수로 받는다. */
const REQUESTED_ROLE_OPTIONS = [
  { value: "general", label: "재학생" },
  { value: "graduate", label: "졸업생" },
] as const;

const signupSchema = additionalSchema.extend({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("유효한 이메일 주소를 입력해주세요."),
  requestedRole: z.enum(["general", "graduate"], {
    error: "회원 유형을 선택해주세요.",
  }),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(/[0-9]/, "숫자를 1개 이상 포함해야 해요."),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
});

const signupSchemaWithMatch = signupSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "비밀번호가 일치하지 않습니다.", path: ["confirmPassword"] },
);

type SignupValues = z.infer<typeof signupSchema>;

export const Register = () => {
  // 가입 성공 후 받은 임시 토큰(살아있는 동안 추가정보 반복 갱신 가능)
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  // 가입 폼에서 입력한 추가정보를 승인 전 입력 화면의 기본값으로 넘긴다.
  const [initialAdditional, setInitialAdditional] =
    useState<AdditionalValues>(EMPTY_ADDITIONAL);

  return (
    <AuthShell
      title={pendingToken ? "추가 정보 입력" : "회원가입"}
      description={
        pendingToken
          ? "관리자 승인 전까지 추가 정보를 입력·수정할 수 있어요."
          : "회원가입 후 서비스를 이용할 수 있어요."
      }
    >
      {pendingToken ? (
        <SignupProfileForm
          pendingToken={pendingToken}
          initialValues={initialAdditional}
        />
      ) : (
        <SignupForm
          onSignedUp={(token, additional) => {
            setInitialAdditional(additional);
            setPendingToken(token);
          }}
        />
      )}
    </AuthShell>
  );
};

const SignupForm = ({
  onSignedUp,
}: {
  onSignedUp: (token: string, additional: AdditionalValues) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchemaWithMatch),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ...EMPTY_ADDITIONAL,
    },
  });

  const signupMutation = v2Admin.usePostApiV2AdminSignup({
    axios: { withCredentials: true },
    mutation: {
      onError: (error: unknown) => {
        toast.error(extractMessage(error, "회원가입에 실패했습니다."));
      },
    },
  });

  const onSubmit = (values: SignupValues) => {
    const additional: AdditionalValues = {
      name: values.name ?? "",
      major: values.major ?? "",
      year: values.year ?? "",
      studentId: values.studentId ?? "",
      phoneNumber: values.phoneNumber ?? "",
    };

    signupMutation.mutate(
      {
        data: {
          email: values.email,
          password: values.password,
          passwordConfirm: values.confirmPassword,
          requestedRole: values.requestedRole,
          ...toAdditionalPayload(additional),
        },
      },
      {
        onSuccess: (res) => {
          toast.success("회원가입이 완료되었어요. 추가 정보를 입력해보세요.");
          onSignedUp(res.data.pendingToken, additional);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <Field label="이메일" required error={errors.email}>
        <TextInput
          type="email"
          placeholder="이메일 주소"
          invalid={!!errors.email}
          registration={register("email")}
        />
      </Field>

      <Field label="비밀번호" required error={errors.password}>
        <TextInput
          type="password"
          placeholder="비밀번호 (8자 이상, 숫자 포함)"
          invalid={!!errors.password}
          registration={register("password")}
        />
      </Field>

      <Field label="비밀번호 확인" required error={errors.confirmPassword}>
        <TextInput
          type="password"
          placeholder="비밀번호 확인"
          invalid={!!errors.confirmPassword}
          registration={register("confirmPassword")}
        />
      </Field>

      <Field label="회원 유형" required error={errors.requestedRole}>
        <div className="flex gap-3">
          {REQUESTED_ROLE_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              label={option.label}
              value={option.value}
              registration={register("requestedRole")}
            />
          ))}
        </div>
      </Field>

      <AdditionalFieldsSection
        register={register}
        errors={errors}
        hint="선택 항목이에요. 가입 후 승인 전까지 입력·수정할 수 있어요."
      />

      <div className="pt-2">
        <SubmitButton
          pending={signupMutation.isPending}
          pendingLabel="가입 중..."
        >
          회원가입
        </SubmitButton>
      </div>

      <p className="mt-4 text-center text-sm text-slate-800">
        이미 계정이 있으신가요?
        <br />
        <Link
          to={RouterUrl.로그인}
          className="ml-1 font-medium text-slate-900 hover:underline"
        >
          로그인하기
        </Link>
      </p>
    </form>
  );
};

const SignupProfileForm = ({
  pendingToken,
  initialValues,
}: {
  pendingToken: string;
  initialValues: AdditionalValues;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdditionalValues>({
    resolver: zodResolver(additionalSchema),
    defaultValues: { ...EMPTY_ADDITIONAL, ...initialValues },
  });

  const profileMutation = v2Admin.usePutApiV2AdminSignupProfile({
    axios: { headers: { Authorization: `Bearer ${pendingToken}` } },
    mutation: {
      onSuccess: () => toast.success("추가 정보를 저장했어요."),
      onError: (error: unknown) =>
        toast.error(
          extractMessage(
            error,
            "추가 정보 저장에 실패했어요. 토큰이 만료되었을 수 있어요.",
          ),
        ),
    },
  });

  const onSubmit = (values: AdditionalValues) => {
    profileMutation.mutate({ data: toAdditionalPayload(values) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <AdditionalFieldsSection
        register={register}
        errors={errors}
        hint="관리자 승인 전까지 언제든 다시 저장할 수 있어요."
      />

      <div className="space-y-3 pt-2">
        <SubmitButton
          pending={profileMutation.isPending}
          pendingLabel="저장 중..."
        >
          추가 정보 저장
        </SubmitButton>
        <button
          type="button"
          onClick={() => navigate(RouterUrl.로그인)}
          className="h-11 w-full rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          나중에 입력하고 로그인하기
        </button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* 공유 UI                                                             */
/* ------------------------------------------------------------------ */

const AuthShell = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-white text-slate-900">
    <div className="mx-auto flex min-h-screen max-w-lg items-center px-6 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const ADDITIONAL_FIELDS: {
  name: keyof AdditionalValues;
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: "numeric";
  maxLength?: number;
  /** 좌측에 고정 표시되는 프리픽스(예: 연락처 "010"). */
  prefix?: string;
  /** 입력 시 숫자만 남기고 뒤 8자리를 1234-5678 로 포맷한다(연락처). */
  digitsOnly?: boolean;
}[] = [
  { name: "name", label: "이름", placeholder: "이름" },
  { name: "major", label: "학과", placeholder: "소속 학과" },
  { name: "year", label: "기수", placeholder: "예) 15", type: "number" },
  { name: "studentId", label: "학번", placeholder: "학번" },
  {
    name: "phoneNumber",
    label: "연락처",
    placeholder: "1234-5678",
    type: "tel",
    inputMode: "numeric",
    maxLength: 9, // 1234-5678
    prefix: PHONE_PREFIX,
    digitsOnly: true,
  },
];

const AdditionalFieldsSection = ({
  register,
  errors,
  hint,
}: {
  // 두 폼(가입/프로필)이 공유 — AdditionalValues 필드를 register 할 수 있으면 된다.
  register: (
    name: keyof AdditionalValues,
    options?: { onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void },
  ) => UseFormRegisterReturn;
  errors: Partial<Record<keyof AdditionalValues, FieldError>>;
  hint: string;
}) => (
  <div className="space-y-5 border-t border-slate-100 pt-5">
    <p className="text-sm font-medium text-slate-700">
      추가 정보
      <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>
    </p>
    {ADDITIONAL_FIELDS.map((field) => (
      <Field key={field.name} label={field.label} error={errors[field.name]}>
        <TextInput
          type={field.type}
          inputMode={field.inputMode}
          maxLength={field.maxLength}
          prefix={field.prefix}
          placeholder={field.placeholder}
          invalid={!!errors[field.name]}
          registration={register(
            field.name,
            field.digitsOnly
              ? {
                  // 숫자만 받아 뒤 8자리를 1234-5678 형태로 자동 포맷해 표시한다.
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    e.target.value = formatPhoneSuffix(e.target.value);
                  },
                }
              : undefined,
          )}
        />
      </Field>
    ))}
  </div>
);

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error?.message && <p className="text-xs text-red-500">{error.message}</p>}
  </div>
);

const TextInput = ({
  registration,
  invalid,
  type = "text",
  placeholder,
  inputMode,
  maxLength,
  prefix,
}: {
  registration: UseFormRegisterReturn;
  invalid?: boolean;
  type?: string;
  placeholder?: string;
  inputMode?: "numeric";
  maxLength?: number;
  prefix?: string;
}) => {
  const borderClass = invalid
    ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
    : "border-slate-200 focus-within:border-slate-400 focus-within:ring-slate-200";

  if (prefix) {
    return (
      <div
        className={cn(
          "flex h-11 w-full items-center rounded-lg border bg-white focus-within:ring-2",
          borderClass,
        )}
      >
        <span className="select-none border-r border-slate-200 px-3 text-sm text-slate-500">
          {prefix}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          {...registration}
          className="h-full w-full rounded-r-lg bg-transparent px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      {...registration}
      className={cn(
        "h-11 w-full rounded-lg border bg-white px-4 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2",
        invalid
          ? "border-red-500 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-slate-400 focus:ring-slate-200",
      )}
    />
  );
};

const RadioCard = ({
  label,
  value,
  registration,
}: {
  label: string;
  value: string;
  registration: UseFormRegisterReturn;
}) => (
  <label className="flex-1 cursor-pointer">
    <input
      type="radio"
      value={value}
      {...registration}
      className="peer sr-only"
    />
    <span
      className={cn(
        "flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition",
        "border-slate-200 bg-white text-slate-600",
        "peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white",
        "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-200",
      )}
    >
      {label}
    </span>
  </label>
);

const SubmitButton = ({
  pending,
  pendingLabel,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
}) => (
  <button
    type="submit"
    disabled={pending}
    className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
  >
    {pending ? pendingLabel : children}
  </button>
);

const extractMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: { message?: string } } })
    ?.response?.data;
  return data?.message ?? fallback;
};

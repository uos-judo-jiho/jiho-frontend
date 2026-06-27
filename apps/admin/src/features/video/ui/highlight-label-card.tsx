import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  type CreateVideoLabelBody,
  type Score,
  type TechniqueResult,
  type VideoHighlight,
} from "../api";
import { useCreateHighlightLabel } from "../hooks";

const TECHNIQUE_RESULTS: { value: TechniqueResult; label: string }[] = [
  { value: "NONE", label: "없음" },
  { value: "ATTEMPT", label: "시도" },
  { value: "SUCCESS", label: "성공" },
];

const SCORES: { value: Score; label: string }[] = [
  { value: "NONE", label: "없음" },
  { value: "YUKO", label: "유효" },
  { value: "WAZA_ARI", label: "절반" },
  { value: "IPPON", label: "한판" },
];

const labelFormSchema = z.object({
  techniqueResult: z.enum(["NONE", "ATTEMPT", "SUCCESS"]),
  score: z.enum(["NONE", "YUKO", "WAZA_ARI", "IPPON"]),
  technique: z.string().max(100, "기술명은 100자 이하여야 합니다."),
  highlightScore: z
    .string()
    .refine(
      (v) =>
        v.trim() === "" ||
        (/^\d+$/.test(v.trim()) && Number(v) >= 0 && Number(v) <= 10),
      "0~10 사이 정수여야 합니다.",
    ),
  correctedEventSec: z
    .string()
    .refine(
      (v) => v.trim() === "" || !Number.isNaN(Number(v)),
      "숫자를 입력해주세요.",
    ),
  memo: z.string().max(1000, "메모는 1000자 이하여야 합니다."),
});

type LabelFormValues = z.infer<typeof labelFormSchema>;

const formatSec = (sec: number) => `${sec.toFixed(1)}초`;

const toNullable = (value: string) => (value.trim() === "" ? null : value.trim());

interface Props {
  index: number;
  highlight: VideoHighlight;
  jobId: number;
}

export const HighlightLabelCard = ({ index, highlight, jobId }: Props) => {
  const label = highlight.latestLabel;

  const mutation = useCreateHighlightLabel(jobId);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      techniqueResult: label?.techniqueResult ?? "NONE",
      score: label?.score ?? "NONE",
      technique: label?.technique ?? "",
      highlightScore:
        label?.highlightScore != null ? String(label.highlightScore) : "",
      correctedEventSec:
        label?.correctedEventSec != null ? String(label.correctedEventSec) : "",
      memo: label?.memo ?? "",
    },
  });

  const memoLength = watch("memo").length;

  const onSubmit = (values: LabelFormValues) => {
    const body: CreateVideoLabelBody = {
      techniqueResult: values.techniqueResult,
      score: values.score,
      technique: toNullable(values.technique),
      highlightScore:
        values.highlightScore.trim() === ""
          ? null
          : Number(values.highlightScore),
      correctedEventSec:
        values.correctedEventSec.trim() === ""
          ? null
          : Number(values.correctedEventSec),
      memo: toNullable(values.memo),
    };

    mutation.mutate(
      { highlightId: highlight.id, data: body },
      {
        onSuccess: () => toast.success("라벨을 저장했어요."),
        onError: () => toast.error("라벨 저장에 실패했어요."),
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm md:flex-row">
      <div className="md:w-1/2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-800">
            #{index + 1}
          </span>
          {label && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              라벨 있음
            </span>
          )}
        </div>
        <video
          src={highlight.clipUrl}
          controls
          preload="metadata"
          className="aspect-video w-full rounded-lg bg-black"
        />
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-500">
          <div className="flex justify-between">
            <dt>이벤트</dt>
            <dd className="font-medium text-neutral-700">
              {formatSec(highlight.eventSec)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>구간</dt>
            <dd className="font-medium text-neutral-700">
              {formatSec(highlight.startSec)} ~ {formatSec(highlight.endSec)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>신뢰도</dt>
            <dd className="font-medium text-neutral-700">
              {(highlight.confidence * 100).toFixed(0)}%
            </dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 md:w-1/2"
      >
        <Field label="기술 결과" required>
          <Controller
            control={control}
            name="techniqueResult"
            render={({ field }) => (
              <SegmentedControl
                options={TECHNIQUE_RESULTS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="점수">
          <Controller
            control={control}
            name="score"
            render={({ field }) => (
              <SegmentedControl
                options={SCORES}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="기술명" error={errors.technique?.message}>
          <Input
            {...register("technique")}
            maxLength={100}
            placeholder="예) 업어치기"
            aria-invalid={!!errors.technique}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="하이라이트 점수 (0~10)"
            error={errors.highlightScore?.message}
          >
            <Input
              {...register("highlightScore")}
              type="number"
              min={0}
              max={10}
              step={1}
              placeholder="0~10"
              aria-invalid={!!errors.highlightScore}
            />
          </Field>

          <Field
            label="보정 이벤트 시각(초)"
            error={errors.correctedEventSec?.message}
          >
            <Input
              {...register("correctedEventSec")}
              type="number"
              step="0.1"
              placeholder={highlight.eventSec.toFixed(1)}
              aria-invalid={!!errors.correctedEventSec}
            />
          </Field>
        </div>

        <Field label={`메모 (${memoLength}/1000)`} error={errors.memo?.message}>
          <Textarea
            {...register("memo")}
            maxLength={1000}
            rows={3}
            placeholder="특이사항을 적어주세요."
            aria-invalid={!!errors.memo}
          />
        </Field>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-1 self-end"
        >
          {mutation.isPending ? "저장 중..." : "라벨 저장"}
        </Button>
      </form>
    </div>
  );
};

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-neutral-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </label>
);

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            value === opt.value
              ? "border-neutral-900 bg-neutral-900 font-semibold text-white"
              : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

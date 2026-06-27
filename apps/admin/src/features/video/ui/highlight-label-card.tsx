import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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

const formatSec = (sec: number) => `${sec.toFixed(1)}초`;

interface Props {
  index: number;
  highlight: VideoHighlight;
  jobId: number;
}

export const HighlightLabelCard = ({ index, highlight, jobId }: Props) => {
  const label = highlight.latestLabel;

  const [techniqueResult, setTechniqueResult] = useState<TechniqueResult>(
    label?.techniqueResult ?? "NONE",
  );
  const [score, setScore] = useState<Score>(label?.score ?? "NONE");
  const [technique, setTechnique] = useState(label?.technique ?? "");
  const [highlightScore, setHighlightScore] = useState(
    label?.highlightScore != null ? String(label.highlightScore) : "",
  );
  const [correctedEventSec, setCorrectedEventSec] = useState(
    label?.correctedEventSec != null ? String(label.correctedEventSec) : "",
  );
  const [memo, setMemo] = useState(label?.memo ?? "");

  const mutation = useCreateHighlightLabel(jobId);

  const highlightScoreError = useMemo(() => {
    if (highlightScore.trim() === "") return null;
    const n = Number(highlightScore);
    if (!Number.isInteger(n) || n < 0 || n > 10) {
      return "0~10 사이 정수여야 합니다.";
    }
    return null;
  }, [highlightScore]);

  const handleSubmit = () => {
    if (highlightScoreError) {
      toast.error(highlightScoreError);
      return;
    }
    if (memo.length > 1000) {
      toast.error("메모는 1000자 이하여야 합니다.");
      return;
    }

    const body: CreateVideoLabelBody = {
      techniqueResult,
      score: score === "NONE" ? "NONE" : score,
      technique: technique.trim() === "" ? null : technique.trim(),
      highlightScore:
        highlightScore.trim() === "" ? null : Number(highlightScore),
      correctedEventSec:
        correctedEventSec.trim() === "" ? null : Number(correctedEventSec),
      memo: memo.trim() === "" ? null : memo.trim(),
    };

    mutation.mutate(
      { highlightId: highlight.id, body },
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

      <div className="flex flex-col gap-3 md:w-1/2">
        <Field label="기술 결과" required>
          <SegmentedControl
            options={TECHNIQUE_RESULTS}
            value={techniqueResult}
            onChange={setTechniqueResult}
          />
        </Field>

        <Field label="점수">
          <SegmentedControl
            options={SCORES}
            value={score}
            onChange={setScore}
          />
        </Field>

        <Field label="기술명">
          <Input
            value={technique}
            maxLength={100}
            placeholder="예) 업어치기"
            onChange={(e) => setTechnique(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="하이라이트 점수 (0~10)">
            <Input
              type="number"
              min={0}
              max={10}
              step={1}
              value={highlightScore}
              aria-invalid={!!highlightScoreError}
              placeholder="0~10"
              onChange={(e) => setHighlightScore(e.target.value)}
            />
            {highlightScoreError && (
              <p className="mt-1 text-xs text-red-600">{highlightScoreError}</p>
            )}
          </Field>

          <Field label="보정 이벤트 시각(초)">
            <Input
              type="number"
              step="0.1"
              value={correctedEventSec}
              placeholder={highlight.eventSec.toFixed(1)}
              onChange={(e) => setCorrectedEventSec(e.target.value)}
            />
          </Field>
        </div>

        <Field label={`메모 (${memo.length}/1000)`}>
          <Textarea
            value={memo}
            maxLength={1000}
            rows={3}
            placeholder="특이사항을 적어주세요."
            onChange={(e) => setMemo(e.target.value)}
          />
        </Field>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="mt-1 self-end"
        >
          {mutation.isPending ? "저장 중..." : "라벨 저장"}
        </Button>
      </div>
    </div>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm font-medium text-neutral-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </span>
    {children}
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

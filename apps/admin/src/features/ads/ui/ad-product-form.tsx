import type { v2AdminModel } from "@packages/api/model";
import { DatePicker } from "@packages/jds/ui";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  getAdMutationErrorMessage,
  useCreateAdProduct,
  useUpdateAdProduct,
} from "../api";

type AdProduct = v2AdminModel.AdminAdProduct;

/** 서버의 `AD_CATEGORIES` 와 같은 값. */
const CATEGORY_LABELS: Record<AdProduct["category"], string> = {
  uniform: "도복·가방",
  "training-gear": "훈련 용품",
  recovery: "회복 용품",
  nutrition: "보충제·음료",
};

/**
 * 서버가 거부하는 가장 이른 게재 시작일 (api 의 `AD_EARLIEST_START_AT`).
 * 공지한 개정 시행일이라 이보다 이르게 시작하면 공지 없이 광고가 나간다.
 */
const AD_LAUNCH_DATE = "2026-12-01";

/** 서버의 `AD_PLACEMENTS` 와 같은 값. */
const PLACEMENT_LABELS: Record<AdProduct["placement"], string> = {
  "article-end": "글 상세 하단 (지호지·훈련일지)",
};

type FormState = {
  name: string;
  linkUrl: string;
  imageUrl: string;
  category: AdProduct["category"];
  placement: AdProduct["placement"];
  priority: string;
  startsAt: string;
  endsAt: string;
};

const emptyForm: FormState = {
  name: "",
  linkUrl: "",
  imageUrl: "",
  category: "training-gear",
  placement: "article-end",
  priority: "0",
  startsAt: "",
  endsAt: "",
};

const toFormState = (product: AdProduct): FormState => ({
  name: product.name,
  linkUrl: product.linkUrl,
  imageUrl: product.imageUrl ?? "",
  category: product.category,
  placement: product.placement,
  priority: String(product.priority),
  startsAt: toLocalInput(product.startsAt),
  endsAt: toLocalInput(product.endsAt),
});

/** ISO 문자열을 `datetime-local` 입력이 읽는 모양으로. */
const toLocalInput = (iso: string | null): string => {
  if (!iso) return "";

  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** `datetime-local` 값을 오프셋이 붙은 ISO 로. 서버가 offset 을 요구한다. */
const toIsoOrNull = (local: string): string | null =>
  local ? new Date(local).toISOString() : null;

type AdProductFormProps = {
  /** 주면 수정, 없으면 등록 */
  product?: AdProduct;
  onDone?: () => void;
};

/**
 * 광고 상품 등록·수정 폼.
 *
 * 입력 규칙은 **서버 DTO 가 유일한 판정자**다. 여기서 같은 검증을 다시 구현하면
 * 두 곳이 갈라지므로, 실패하면 서버가 필드별로 돌려준 사유를 그대로 띄운다.
 * 대신 운영자가 규칙을 미리 알 수 있도록 각 입력 아래에 설명을 붙였다.
 */
export const AdProductForm = ({ product, onDone }: AdProductFormProps) => {
  const [form, setForm] = useState<FormState>(
    product ? toFormState(product) : emptyForm,
  );

  const create = useCreateAdProduct();
  const update = useUpdateAdProduct();

  const saving = create.isPending || update.isPending;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();

    const body = {
      name: form.name.trim(),
      linkUrl: form.linkUrl.trim(),
      imageUrl: form.imageUrl.trim() || null,
      category: form.category,
      placement: form.placement,
      priority: Number(form.priority) || 0,
      startsAt: toIsoOrNull(form.startsAt),
      endsAt: toIsoOrNull(form.endsAt),
    };

    try {
      if (product) {
        await update.mutateAsync({ adProductId: product.id, data: body });
        toast.success("광고 상품을 수정했습니다.");
      } else {
        await create.mutateAsync({ data: body });
        toast.success("광고 상품을 등록했습니다.");
        setForm(emptyForm);
      }

      onDone?.();
    } catch (error) {
      toast.error(getAdMutationErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="상품명"
        hint="가격·할인율·'특가'·'쿠폰' 표기는 등록되지 않습니다. 쿠팡 가격은 실시간으로 바뀌어서 적어 두는 것 자체가 파트너스 정책 위반 소지가 있습니다."
      >
        <Input
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
          placeholder="유도 손가락 테이프"
          maxLength={200}
          required
        />
      </Field>

      <Field
        label="상품 링크"
        hint="쿠팡 파트너스에서 받은 '블로그용 링크'(https://link.coupang.com/...)만 등록됩니다."
      >
        <Input
          value={form.linkUrl}
          onChange={(event) => set("linkUrl", event.target.value)}
          placeholder="https://link.coupang.com/a/XXXXXX"
          maxLength={500}
          required
        />
      </Field>

      <Field
        label="이미지 주소 (선택)"
        hint="쿠팡이 제공한 주소(*.coupangcdn.com)를 그대로 넣습니다. 내려받아 우리 서버에 올리면 정책 위반입니다. 비우면 이미지 없이 상품명만 보입니다."
      >
        <Input
          value={form.imageUrl}
          onChange={(event) => set("imageUrl", event.target.value)}
          placeholder="https://thumbnail6.coupangcdn.com/..."
          maxLength={500}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="상품군">
          <Select
            value={form.category}
            onChange={(value) =>
              set("category", value as AdProduct["category"])
            }
            options={CATEGORY_LABELS}
          />
        </Field>

        <Field label="구좌">
          <Select
            value={form.placement}
            onChange={(value) =>
              set("placement", value as AdProduct["placement"])
            }
            options={PLACEMENT_LABELS}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="노출 순서" hint="작은 값이 먼저 보입니다.">
          <Input
            type="number"
            min={0}
            max={9999}
            value={form.priority}
            onChange={(event) => set("priority", event.target.value)}
          />
        </Field>

        <Field
          label="게재 시작 (선택)"
          hint="공지한 시행일(2026-12-01)보다 이르게는 지정할 수 없습니다. 비워도 그 날짜 전에는 노출되지 않습니다."
        >
          {/* min 으로 달력에서 그 이전 날짜를 아예 못 고르게 한다 — 서버도 같은
              하한으로 거부하지만, 거부당하고 나서 알게 되는 것보다 낫다 */}
          <DatePicker
            withTime
            min={AD_LAUNCH_DATE}
            value={form.startsAt}
            onChange={(value) => set("startsAt", value)}
          />
        </Field>

        <Field label="게재 종료 (선택)" hint="비우면 무기한입니다.">
          <DatePicker
            withTime
            min={form.startsAt.slice(0, 10) || AD_LAUNCH_DATE}
            value={form.endsAt}
            onChange={(value) => set("endsAt", value)}
          />
        </Field>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중…" : product ? "수정" : "등록"}
        </Button>
        {product && onDone && (
          <Button type="button" variant="outline" onClick={onDone}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium">{label}</span>
    {children}
    {hint && <span className="text-xs text-neutral-500">{hint}</span>}
  </label>
);

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="border-input h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
  >
    {Object.entries(options).map(([optionValue, label]) => (
      <option key={optionValue} value={optionValue}>
        {label}
      </option>
    ))}
  </select>
);

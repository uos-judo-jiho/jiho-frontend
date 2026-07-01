import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TECHNIQUE_GROUPS = [
  {
    label: "손기술",
    options: [
      "업어치기",
      "한팔업어치기",
      "빗당겨치기",
      "어깨로 메치기",
      "다리들어메치기",
      "띄어치기",
      "모로떨어뜨리기",
      "업어떨어뜨리기",
      "다리잡아메치기",
      "오금잡아메치기",
      "발목잡아메치기",
      "안뒤축되치기",
    ],
  },
  {
    label: "허리기술",
    options: [
      "허리띄기",
      "허리껴치기",
      "허리돌리기",
      "허리채기",
      "허리후리기",
      "허리튀기",
      "뒤허리안아메치기",
      "소매들어 허리채기",
    ],
  },
  {
    label: "발기술",
    options: [
      "나오는발차기",
      "무릎대돌리기",
      "발목받치기",
      "밭다리후리기",
      "안다리후리기",
      "발뒤축후리기",
      "안뒤축후리기",
      "모두걸기",
      "허벅다리걸기",
      "다리대돌리기",
      "허리대돌리기",
      "밭다리걸기",
      "밭다리되치기",
      "안다리되치기",
      "허벅다리되치기",
    ],
  },
  {
    label: "앞 버림기술",
    options: [
      "배대뒤치기",
      "안오금띄기",
      "누우면서던지기",
      "끌어누우며던지기",
      "뒤집어넘기기",
    ],
  },
  {
    label: "옆 버림기술",
    options: [
      "옆으로 떨어뜨리기",
      "모로띄기",
      "오금대떨어뜨리기",
      "모로걸기",
      "모로돌리기",
      "허벅다리감아치기",
      "밭다리감아치기",
      "안쪽감아치기",
      "바깥감아치기",
      "허리후리기감아치기",
      "허리튀겨감아치기",
      "안뒤축감아치기",
    ],
  },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (technique: string) => void;
  selected: string | null;
}

export const TechniqueSheet = ({
  open,
  onClose,
  onSelect,
  selected,
}: Props) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const filtered = TECHNIQUE_GROUPS.map((group) => ({
    ...group,
    options: query
      ? group.options.filter((opt) => opt.includes(query))
      : group.options,
  })).filter((group) => group.options.length > 0);

  if (typeof document === "undefined") return null;

  // 세로 피드 래퍼의 transform 이 fixed 를 가두지 않도록 body 로 포탈한다.
  // (그렇지 않으면 닫힌 시트가 드래그 중 다음 영상보다 먼저 드러난다.)
  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[75dvh] flex-col rounded-t-2xl bg-neutral-900 transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
          <h2 className="font-semibold text-white">기술명 선택</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="기술 검색..."
              className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+var(--safe-bottom))]">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              검색 결과 없음
            </p>
          ) : (
            filtered.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onSelect(opt);
                        onClose();
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        selected === opt
                          ? "border-indigo-400 bg-indigo-500/20 text-indigo-300"
                          : "border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>,
    document.body,
  );
};

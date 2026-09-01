import { Badge } from "@/components/common/badge";
import { Input } from "@/components/ui/input";
import useClickOutside from "@/shared/hooks/useClickOutside";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { cn } from "@/shared/lib/utils";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  DEFAULT_PUBLIC_USER_PAGE_SIZE,
  MAX_PUBLIC_USER_NAME_QUERY_LENGTH,
  formatPublicUserLabel,
  usePublicUsers,
  type PublicUser,
} from "../api";

export type ParticipantSelectProps = {
  /** 선택된 참여 인원 이름. 게시글 tags 로 그대로 저장된다. */
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  /** label 의 htmlFor 와 연결할 검색 입력 id. */
  id?: string;
};

const LISTBOX_ID = "participant-select-listbox";

/**
 * 훈련일지 참여 인원 선택기.
 *
 * 부원은 `/api/v2/users` 검색 결과에서 고르고, 아직 회원가입하지 않은 사람은
 * 입력한 이름을 그대로 추가할 수 있다. 두 경우 모두 저장되는 값은 이름 문자열
 * 하나로, 기존 훈련일지의 tags 와 형식이 같다.
 */
export const ParticipantSelect = ({
  value,
  onChange,
  disabled = false,
  id = "participant-search",
}: ParticipantSelectProps) => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false));

  const debouncedKeyword = useDebouncedValue(keyword);

  const { data, isFetching, isError } = usePublicUsers({
    name: debouncedKeyword,
    limit: DEFAULT_PUBLIC_USER_PAGE_SIZE,
    // 목록을 펼치기 전에는 명부를 받아오지 않는다.
    enabled: open && !disabled,
  });

  const trimmedKeyword = keyword.trim();
  const selected = useMemo(() => new Set(value), [value]);

  const users: PublicUser[] = data?.items ?? [];

  /** 검색 결과에 같은 이름이 이미 있으면 "직접 추가"는 굳이 권하지 않는다. */
  const canAddManually =
    trimmedKeyword.length > 0 &&
    !selected.has(trimmedKeyword) &&
    !users.some((user) => user.name === trimmedKeyword);

  const manualIndex = canAddManually ? users.length : -1;
  const optionCount = users.length + (canAddManually ? 1 : 0);

  // 검색 결과가 줄어들면 예전 하이라이트가 없는 항목을 가리킬 수 있다.
  // 렌더 중에 바로잡으면 되는 값이라 effect 로 되돌리지 않는다.
  const highlighted = activeIndex < optionCount ? activeIndex : -1;

  const addParticipant = (name: string | null) => {
    const next = name?.trim();

    if (!next || selected.has(next)) {
      setKeyword("");
      return;
    }

    onChange([...value, next]);
    setKeyword("");
    setActiveIndex(-1);
  };

  const removeParticipant = (index: number) => {
    onChange(value.filter((_, current) => current !== index));
  };

  const selectAt = (index: number) => {
    if (index === manualIndex) {
      addParticipant(trimmedKeyword);
      return;
    }

    addParticipant(users[index]?.name ?? null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }
      if (optionCount === 0) {
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : -1;
      // 아직 아무것도 고르지 않았으면 ↓ 는 첫 항목, ↑ 는 마지막 항목부터 시작한다.
      setActiveIndex(
        highlighted < 0
          ? step === 1
            ? 0
            : optionCount - 1
          : (highlighted + step + optionCount) % optionCount,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      // 하이라이트된 항목이 있으면 그것을, 없으면 입력한 이름을 그대로 추가한다.
      if (highlighted >= 0) {
        selectAt(highlighted);
      } else {
        addParticipant(trimmedKeyword);
      }
      return;
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Backspace" && keyword === "" && value.length > 0) {
      removeParticipant(value.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
            aria-hidden
          />
          <Input
            id={id}
            className="pl-9"
            autoComplete="off"
            disabled={disabled}
            maxLength={MAX_PUBLIC_USER_NAME_QUERY_LENGTH}
            placeholder="이름으로 검색하거나, 미가입자는 직접 입력하세요"
            role="combobox"
            aria-expanded={open}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              highlighted >= 0 ? `participant-option-${highlighted}` : undefined
            }
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {isFetching && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-gray-400"
              aria-hidden
            />
          )}
        </div>

        {open && !disabled && (
          <ul
            id={LISTBOX_ID}
            role="listbox"
            aria-label="참여 인원 후보"
            className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
          >
            {isError && (
              <li className="px-3 py-2 text-sm text-red-600">
                부원 목록을 불러오지 못했습니다. 직접 입력해 추가할 수 있어요.
              </li>
            )}

            {users.map((user, index) => {
              const isSelected = user.name != null && selected.has(user.name);
              // 이름이 비어 있는 계정은 참여 인원으로 넣을 수 없다.
              const isDisabled = user.name == null || isSelected;

              return (
                <li
                  key={user.id}
                  id={`participant-option-${index}`}
                  role="option"
                  aria-selected={index === highlighted}
                  aria-disabled={isDisabled}
                >
                  <button
                    type="button"
                    disabled={isDisabled}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                      index === highlighted && "bg-gray-100",
                      isDisabled
                        ? "cursor-not-allowed text-gray-400"
                        : "hover:bg-gray-100",
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectAt(index)}
                  >
                    <span className="font-medium">
                      {formatPublicUserLabel(user) || "이름 미입력"}
                    </span>
                    {user.major && (
                      <span className="text-gray-500">{user.major}</span>
                    )}
                    {user.graduated && <Badge theme="gray">졸업</Badge>}
                    {isSelected && (
                      <span className="ml-auto text-xs text-gray-400">
                        추가됨
                      </span>
                    )}
                  </button>
                </li>
              );
            })}

            {canAddManually && (
              <li
                id={`participant-option-${manualIndex}`}
                role="option"
                aria-selected={manualIndex === highlighted}
                className={cn(users.length > 0 && "border-t")}
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                    manualIndex === highlighted
                      ? "bg-gray-100"
                      : "hover:bg-gray-100",
                  )}
                  onMouseEnter={() => setActiveIndex(manualIndex)}
                  onClick={() => selectAt(manualIndex)}
                >
                  <Plus className="size-4" aria-hidden />
                  <span>
                    <span className="font-medium">“{trimmedKeyword}”</span> 직접
                    추가
                  </span>
                  <span className="ml-auto text-xs text-gray-400">
                    미가입자
                  </span>
                </button>
              </li>
            )}

            {!isFetching && !isError && optionCount === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">
                {trimmedKeyword
                  ? "이미 추가된 인원입니다."
                  : "표시할 부원이 없습니다."}
              </li>
            )}

            {data != null && data.total > users.length && (
              <li className="border-t px-3 py-2 text-xs text-gray-500">
                {data.total}명 중 {users.length}명 표시 중 — 이름을 더 입력해
                좁혀보세요.
              </li>
            )}
          </ul>
        )}
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((participant, index) => (
            <li
              key={`${participant}-${index}`}
              className="flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm text-gray-800"
            >
              {participant}
              <button
                type="button"
                disabled={disabled}
                aria-label={`${participant} 삭제`}
                className="rounded-full p-1 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={(event) => {
                  event.preventDefault();
                  removeParticipant(index);
                }}
              >
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

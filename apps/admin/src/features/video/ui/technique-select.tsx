import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { TECHNIQUE_GROUPS } from "../techniques";

interface Props {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

const allOptions = TECHNIQUE_GROUPS.flatMap((group) => group.options);

const findOption = (value: string) =>
  allOptions.find((option) => option.value === value);

export const TechniqueSelect = ({ value, onChange, invalid }: Props) => {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOption = findOption(value);
  const [query, setQuery] = useState(selectedOption?.label ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredGroups = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return TECHNIQUE_GROUPS;

    return TECHNIQUE_GROUPS.map((group) => ({
      ...group,
      options: group.options.filter((option) => {
        const searchable =
          `${option.value} ${option.label}`.toLocaleLowerCase();
        return terms.every((term) => searchable.includes(term));
      }),
    })).filter((group) => group.options.length > 0);
  }, [query]);

  const filteredOptions = useMemo(
    () => filteredGroups.flatMap((group) => group.options),
    [filteredGroups],
  );

  useEffect(() => {
    if (!isOpen) setQuery(selectedOption?.label ?? "");
  }, [isOpen, selectedOption?.label]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectValue = (nextValue: string) => {
    onChange(nextValue);
    setQuery(findOption(nextValue)?.label ?? "");
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        isOpen
          ? Math.min(current + 1, Math.max(filteredOptions.length - 1, 0))
          : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (
      event.key === "Enter" &&
      isOpen &&
      filteredOptions[activeIndex]
    ) {
      event.preventDefault();
      selectValue(filteredOptions[activeIndex].value);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          invalid && "border-red-500",
        )}
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-neutral-400" />
        <input
          ref={inputRef}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-invalid={invalid}
          value={query}
          placeholder="기술명 검색"
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          onFocus={(event) => {
            setIsOpen(true);
            if (selectedOption) {
              setQuery("");
              event.currentTarget.select();
            }
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          aria-label="기술 목록 열기"
          onClick={() => {
            setIsOpen((open) => !open);
            inputRef.current?.focus();
          }}
          className="flex h-full items-center px-3 text-neutral-400 hover:text-neutral-700"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectValue("")}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-50"
          >
            기술 선택 안 함{value === "" && <Check className="h-4 w-4" />}
          </button>

          {filteredGroups.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">
              검색 결과가 없습니다.
            </p>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="sticky top-0 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-500">
                  {group.label}
                </p>
                {group.options.map((option) => {
                  const optionIndex = filteredOptions.findIndex(
                    (item) => item.value === option.value,
                  );
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={value === option.value}
                      onMouseEnter={() => setActiveIndex(optionIndex)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectValue(option.value)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                        optionIndex === activeIndex
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-50",
                      )}
                    >
                      <span>{option.label}</span>
                      {value === option.value && (
                        <Check className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

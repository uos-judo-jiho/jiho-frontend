import { Check } from "lucide-react";

import type { VideoHighlight, VideoJobListItem } from "@/features/video/api";
import { cn } from "@/shared/lib/utils";

interface FullpageNavigationPanelProps {
  jobs: VideoJobListItem[];
  currentJobId: number;
  highlights: VideoHighlight[];
  activeIndex: number;
  onSelectJob: (jobId: number) => void;
  onSelectHighlight: (highlightId: number) => void;
  className?: string;
}

export const FullpageNavigationPanel = ({
  jobs,
  currentJobId,
  highlights,
  activeIndex,
  onSelectJob,
  onSelectHighlight,
  className,
}: FullpageNavigationPanelProps) => (
  <div
    className={cn(
      "overflow-y-auto rounded-xl border border-neutral-200 bg-white p-3 shadow-sm",
      className,
    )}
  >
    <section>
      <h2 className="mb-2 px-2 text-sm font-semibold text-neutral-700">
        영상 목록
      </h2>
      <div className="space-y-1">
        {jobs.map((job) => (
          <button
            key={job.id}
            type="button"
            onClick={() => onSelectJob(job.id)}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left",
              job.id === currentJobId
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100",
            )}
          >
            <span className="block truncate text-sm font-medium">
              #{job.id} {job.originalFilename}
            </span>
            <span
              className={cn(
                "mt-0.5 block text-xs",
                job.id === currentJobId
                  ? "text-neutral-300"
                  : "text-neutral-500",
              )}
            >
              하이라이트 {job.highlightCount}개
            </span>
          </button>
        ))}
      </div>
    </section>

    <section className="mt-4 border-t border-neutral-200 pt-4">
      <h2 className="mb-2 px-2 text-sm font-semibold text-neutral-700">
        현재 영상 하이라이트
      </h2>
      <div className="space-y-1">
        {highlights.map((highlight, index) => (
          <button
            key={highlight.id}
            type="button"
            onClick={() => onSelectHighlight(highlight.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
              index === activeIndex
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "text-neutral-600 hover:bg-neutral-100",
            )}
          >
            <span>하이라이트 {index + 1}</span>
            {highlight.isLabeledByCurrentUser && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </button>
        ))}
      </div>
    </section>
  </div>
);

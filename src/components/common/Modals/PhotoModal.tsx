import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArticleInfoType } from "@/lib/types/ArticleInfoType";
import ModalArticleContainer from "./ModalArticleContainer";

type PhotoModalProps = {
  baseurl: string;
  open: boolean;
  close: (event?: MouseEvent) => void;
  infos: ArticleInfoType[];
  id: string;
  titles: string[];
};

const PhotoModal = ({
  baseurl,
  open,
  close,
  infos,
  id,
  titles,
}: PhotoModalProps) => {
  const navigate = useNavigate();

  const current = infos.findIndex(
    (infoItem) => infoItem.id.toString() === id.toString()
  );

  const nextSlider = useCallback(() => {
    if (current < infos.length - 1) {
      navigate(`/${baseurl}/${infos[current + 1].id}`, { replace: true });
    }
  }, [baseurl, current, infos, navigate]);

  const prevSlider = useCallback(() => {
    if (current > 0) {
      navigate(`/${baseurl}/${infos[current - 1].id}`, { replace: true });
    }
  }, [baseurl, current, infos, navigate]);

  const info = infos.find(
    (infoItem) => infoItem.id.toString() === id.toString()
  );

  const length = infos.length;

  if (!info) {
    return null;
  }

  const handleClose = () => {
    close();
    navigate(`/${baseurl}`, { replace: true });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay />
      <DialogContent className="hidden md:block w-[95vw] h-[95vh] p-0 border-0 bg-transparent shadow-none">
        {/* Navigation Arrows */}
        <div>
          {current > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlider}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          {current < length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlider}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="relative w-full h-full">
          {/* Article Container */}
          <div className="w-full overflow-hidden flex align-center justify-center">
            <ModalArticleContainer info={info} titles={titles} />
          </div>

          {/* Counter - Desktop Only */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {current + 1} / {length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;

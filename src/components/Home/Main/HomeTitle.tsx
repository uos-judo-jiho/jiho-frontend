import { Card, CardTitle } from "@/components/ui/card";

function HomeTitle() {
  return (
    <div className="flex ml-auto mr-0 mb-[60px] pt-[60px] md:w-auto w-full">
      <Card className="p-6 relative flex-1 backdrop-blur-sm bg-white/30 border-none">
        <CardTitle className="flex flex-col gap-4">
          <h1 className="text-2xl">서울시립대학교 유도부 지호</h1>
          <div>
            <br />
            <h2 className="inline-flex gap-2">
              {"University of Seoul. Judo Team Jiho"}
            </h2>
          </div>
        </CardTitle>
        <p className="text-base">Since 1985</p>
      </Card>
    </div>
  );
}

export default HomeTitle;

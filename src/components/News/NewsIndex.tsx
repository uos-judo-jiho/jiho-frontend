import DemoData from "../../assets/jsons/trainingLog.json";
import Carousel from "../../layouts/Carousel";
import NewsCard from "./NewsCard";
import NewsCardContainer from "./NewsCardContainer";

// TODO 데이터 바꾸기
import demoImg from "../../assets/images/demo.jpg";
import demoImg1 from "../../assets/images/demo1.jpg";
import demoImg2 from "../../assets/images/demo2.jpg";
import demoImg3 from "../../assets/images/demo3.jpg";
import demoImg4 from "../../assets/images/demo4.jpg";

function NewsIndex() {
  return (
    <>
      <Carousel
        datas={[demoImg, demoImg1, demoImg2, demoImg3, demoImg4]}
      ></Carousel>
      <NewsCardContainer>
        {/* TODO 뉴스 데이터로 교체하기 */}
        {DemoData.trainingLogs.map((item, index) => {
          return (
            <NewsCard
              key={item.id}
              index={index}
              datas={DemoData.trainingLogs}
            />
          );
        })}
      </NewsCardContainer>
    </>
  );
}

export default NewsIndex;

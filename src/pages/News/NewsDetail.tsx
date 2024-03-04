import { useParams } from "react-router-dom";
import NewsIndex from "../../components/News/NewsIndex";
import MyHelmet from "../../helmet/MyHelmet";
import DefaultLayout from "../../layouts/DefaultLayout";
import SheetWrapper from "../../layouts/SheetWrapper";
import Title from "../../layouts/Title";
import { useNews } from "../../recoills/news";
import { TNewsParams } from "../../types/TNewsParams";

function NewsDetail() {
  const { id, index } = useParams<TNewsParams>();
  const { news } = useNews();

  return (
    <>
      <MyHelmet helmet="News" />
      <DefaultLayout>
        <SheetWrapper>
          <Title title={"지호지"} color="black" />
          <NewsIndex
            articles={news.articles}
            images={news.images}
            selectedIndex={parseInt(index as string)}
          />
        </SheetWrapper>
      </DefaultLayout>
    </>
  );
}

export default NewsDetail;

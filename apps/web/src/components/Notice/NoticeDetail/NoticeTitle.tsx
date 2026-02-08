import Line from "@/components/layouts/Line";

type NoticeTitleProps = {
  title: string;
  author: string;
  dateTime: string;
  tags: string[];
};

function NoticeTitle({ title, author, dateTime, tags }: NoticeTitleProps) {
  return (
    <>
      <div className="py-16 pb-8">
        <h2 className="text-theme-subtitle">{title}</h2>
        <div className="text-theme-default pt-2.5 flex">
          <span className="flex text-theme-black after:content-['|'] after:px-1 last:after:content-none">
            {author}
          </span>
          <span className="flex text-theme-black after:content-['|'] after:px-1 last:after:content-none">
            {dateTime}
          </span>
          <span className="flex text-theme-black">
            {tags.map((tag) => (
              <p key={title + tag} className="text-theme-grey pr-1 last:pr-0">
                #{tag}
              </p>
            ))}
          </span>
        </div>
        <Line borderWidth="1px" margin="2rem 0" />
      </div>
    </>
  );
}

export default NoticeTitle;

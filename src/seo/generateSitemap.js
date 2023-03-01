require("babel-register")({
  presets: ["es5", "react"],
});

const router = require("./sitemapRoutes").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
  return new Sitemap(router)
    .build("https://uosjudo.com") // 여러분의 도메인 이름으로 변경해주세요.
    .save("./public/sitemap.xml"); // sitemap.xml 파일이 생성될 위치입니다.
}

generateSitemap();

/*

/build/server.json을 생성해 아래와 같이 작성합니다
{
  "rewrites": [
    { "source": "/", "destination": "/200.html" },
    { "source": "/index", "destination": "/index.html" }
  ]
}

터미널에서 실행
serve -c server.json build
 
 */

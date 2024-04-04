import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { getTrainings } from "./api/trainings";
import { getNews } from "./api/news";
import { getNotices } from "./api/notice";

const app = express();

const getHtml = (req, res) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some Error Happended!");
    }

    let ssrData = data.replace(`<meta property="og:url" content="http://uosjudo.com"/>`, `<meta property="og:url" content="http://uosjudo.com${req.url}"/>`);

    if (req.url === "/") {
    } else if (/\/photo?(\/[0-9]+)?/.test(req.url)) {
      const photoRes = await getTrainings();
      const currentData = photoRes.find((trainingData) => trainingData.id === req.params.id) || photoRes[0];

      ssrData = ssrData
        .replace(`<meta property="og:title" content="Uos Judo Team Jiho"/>`, `<meta property="og:title" content="서울시립대학교 유도부 지호 | 훈련일지"/>`)
        .replace(
          `<meta property="og:description" content="Uos Judo Team Jiho"/>`,
          `<meta property="og:description" content="서울시립대학교 유도부 지호 ${currentData.dateTime} 훈련일지 | 참여 인원: ${currentData.tags.join(", ")} ${
            currentData.title
          }: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="description" content="서울시립대학교 유도부 지호"/>`,
          `<meta name="description" content="서울시립대학교 유도부 지호 ${currentData.dateTime} 훈련일지 | 참여 인원: ${currentData.tags.join(", ")} ${
            currentData.title
          }: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="google-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="google-site-verification" content="서울시립대학교 유도부 지호 ${currentData.dateTime} 훈련일지 | 참여 인원: ${currentData.tags.join(", ")} ${
            currentData.title
          }: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="naver-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="naver-site-verification" content="서울시립대학교 유도부 지호 ${currentData.dateTime} 훈련일지 | 참여 인원: ${currentData.tags.join(", ")} ${
            currentData.title
          }: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(`<meta property="og:image" content="/favicon-96x96.png"/>`, `<meta property="og:image" content="${currentData.imgSrcs[0] || "/apple-icon-180x180.png"}"/>`);
    } else if (/\/news?(\/[0-9]+4)?(\/[0-9]+)?/.test(req.url)) {
      const newsRes = await getNews(req.params.year);
      const currentData = newsRes.articles.find((newsData) => newsData.id === req.params.id) || newsRes.articles[0];

      ssrData = ssrData
        .replace(`<meta property="og:title" content="Uos Judo Team Jiho"/>`, `<meta property="og:title" content="서울시립대학교 유도부 지호 | ${req.params.year}년 | ${currentData.title}"/>`)
        .replace(
          `<meta property="og:description" content="Uos Judo Team Jiho"/>`,
          `<meta property="og:description" content="서울시립대학교 유도부 지호 ${req.params.year}년 | ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="description" content="서울시립대학교 유도부 지호"/>`,
          `<meta name="description" content="서울시립대학교 유도부 지호 ${req.params.year}년 | ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="google-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="google-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다. ${req.params.year}년도 지호지입니다. ${currentData.title}: ${currentData.description.slice(
            0,
            100
          )}"/>`
        )
        .replace(
          `<meta name="naver-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="naver-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다. ${req.params.year}년도 지호지입니다. ${currentData.title}: ${currentData.description.slice(
            0,
            100
          )}"/>`
        );
    } else if (/\/notice?(\/[0-9]+)?/.test(req.url)) {
      const noticesData = await getNotices();
      const currentData = noticesData.find((noticeData) => noticeData.id === req.params.id) || noticesData[0];

      ssrData = ssrData
        .replace(
          `<meta property="og:title" content="Uos Judo Team Jiho"/>`,
          `<meta property="og:title" content="서울시립대학교 유도부 지호 | 공지사항 | ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta property="og:description" content="Uos Judo Team Jiho"/>`,
          `<meta property="og:description" content="서울시립대학교 유도부 지호 공지사항 | ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="description" content="서울시립대학교 유도부 지호"/>`,
          `<meta name="description" content="서울시립대학교 유도부 지호 공지사항 | ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="google-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="google-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다. 공지사항입니다. ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        )
        .replace(
          `<meta name="naver-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다."/>`,
          `<meta name="naver-site-verification" content="서울시립대학교 중앙 동아리 유도부 지호입니다. 공지사항입니다. ${currentData.title}: ${currentData.description.slice(0, 100)}"/>`
        );
    }
    const html = ReactDOMServer.renderToString(<StaticRouter location={req.url}></StaticRouter>);

    ssrData.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    return res.send(ssrData);
  });
};

app.get("/", getHtml);

app.get("/notice", getHtml);
app.get("/notice/:id", getHtml);

app.get("/photo", getHtml);
app.get("/photo/:id", getHtml);

app.get("/news/:year", getHtml);
app.get("/news/:year/:id", getHtml);

app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get("/", (req, res) => {
  return res.send("ExpressJS running successfully");
});

app.listen(3000, () => {
  console.log("App is launched! on port 3000");
});

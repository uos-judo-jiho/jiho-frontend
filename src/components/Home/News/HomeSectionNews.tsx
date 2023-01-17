import React from "react";
import HomeSectionBG from "../HomeSectionBG";
import BGImage from "../../../assets/images/demo2.jpg";
import styled from "styled-components";
import NewsRowContainer from "./NewsRowContainer";
import NewsCard from "./NewsCard";
import Row from "../../../layouts/Row";
import Title from "../../../layouts/Title";

import ImgSrc from "../../../assets/images/demo.jpg";

import Executives from "../../../assets/jsons/executives.json";
import Graduates from "../../../assets/jsons/graduates.json";
import Freshmen from "../../../assets/jsons/freshmen.json";
import SheetWrapper from "../../../layouts/SheetWrapper";

function HomeSectionNews() {
  return (
    <HomeSectionBG bgImageSrc={BGImage} id="sectionNews">
      <SheetWrapper>
        <Title title={"2022년 지호지"} />
        <Row justifyContent="space-between">
          <NewsRowContainer title={"회장단"}>
            {Executives.executives.map((executive) => {
              return (
                <NewsCard
                  key={executive.id}
                  imgSrc={ImgSrc}
                  title={executive.title}
                  subTitle={executive.subTitle}
                  id={executive.id}
                />
              );
            })}
          </NewsRowContainer>
          <NewsRowContainer title={"졸업자"}>
            {Graduates.graduates.map((graduate) => {
              return (
                <NewsCard
                  key={graduate.id}
                  imgSrc={ImgSrc}
                  title={graduate.title}
                  subTitle={graduate.subTitle}
                  id={graduate.id}
                />
              );
            })}
          </NewsRowContainer>
        </Row>
        <Row justifyContent="space-between">
          <NewsRowContainer title={"신입부원"}>
            {Freshmen.freshmen.map((freshman) => {
              return (
                <NewsCard
                  key={freshman.id}
                  imgSrc={ImgSrc}
                  title={freshman.title}
                  subTitle={freshman.subTitle}
                  id={freshman.id}
                />
              );
            })}
          </NewsRowContainer>
          <NewsRowContainer title={"교류전"}>
            {Graduates.graduates.map((graduate) => {
              return (
                <NewsCard
                  key={graduate.id}
                  imgSrc={ImgSrc}
                  title={graduate.title}
                  subTitle={graduate.subTitle}
                  id={graduate.id}
                />
              );
            })}
          </NewsRowContainer>
          <NewsRowContainer title={"대회"}>
            {Graduates.graduates.map((graduate) => {
              return (
                <NewsCard
                  key={graduate.id}
                  imgSrc={ImgSrc}
                  title={graduate.title}
                  subTitle={graduate.subTitle}
                  id={graduate.id}
                />
              );
            })}
          </NewsRowContainer>
        </Row>
        <Row justifyContent="space-between">
          <NewsRowContainer title={"총회"}>
            {Graduates.graduates.map((graduate) => {
              return (
                <NewsCard
                  key={graduate.id}
                  imgSrc={ImgSrc}
                  title={graduate.title}
                  subTitle={graduate.subTitle}
                  id={graduate.id}
                />
              );
            })}
          </NewsRowContainer>
          <NewsRowContainer title={"엠티 & 소풍"}>
            {Graduates.graduates.map((graduate) => {
              return (
                <NewsCard
                  key={graduate.id}
                  imgSrc={ImgSrc}
                  title={graduate.title}
                  subTitle={graduate.subTitle}
                  id={graduate.id}
                />
              );
            })}
          </NewsRowContainer>
        </Row>
      </SheetWrapper>
    </HomeSectionBG>
  );
}

export default HomeSectionNews;

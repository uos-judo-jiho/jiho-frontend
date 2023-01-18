import React from "react";
import styled from "styled-components";
import YouTube from "react-youtube";

const Container = styled.div`
  position: absolute;
  bottom: -200px;
  right: 20px;
`;

const VideoWrapper = styled.div`
  width: 480px;
  height: 270px;
`;

function ExerciseVideo() {
  return (
    <Container>
      <VideoWrapper>
        <YouTube
          videoId="-4mtPGtQGBQ"
          opts={{
            width: "480",
            height: "270",

            playerVars: {
              autoplay: 1, //자동재생 O
              rel: 0, //관련 동영상 표시하지 않음 (근데 별로 쓸모 없는듯..)
              modestbranding: 1, // 컨트롤 바에 youtube 로고를 표시하지 않음
            },
          }}
          onEnd={(e) => {
            e.target.stopVideo(0);
          }}
        />
      </VideoWrapper>
    </Container>
  );
}

export default ExerciseVideo;

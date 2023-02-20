import React from "react";
import styled from "styled-components";
import YouTube from "react-youtube";

const Container = styled.div`
  position: relative;
  width: 40vw;
  height: inherit;
`;

const VideoWrapper = styled.div``;

function ExerciseVideo() {
  return (
    <Container>
      <VideoWrapper>
        <YouTube
          // TODO videoID 바꾸기
          videoId="-4mtPGtQGBQ"
          opts={{
            width: "480",
            height: "270",

            playerVars: {
              autoplay: 0, // 자동재생 않함 0 | 자동재생 1
              rel: 0, // 관련 동영상 표시하지 않음 0 | 표시 1
              modestbranding: 0, // 컨트롤 바에 youtube 로고를 표시 0 | 표시하지 않음 1
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

import styled, { keyframes } from "styled-components";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import Row from "../../layouts/Row";

type TrainingLogModalProps = {
  open: boolean;
  close: React.MouseEventHandler<HTMLButtonElement>;
  info: Object;
};

const ModalArticleAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const ContainerAnimation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);

  &.openModal {
    display: flex;
    align-items: center;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: ${ContainerAnimation} 0.3s;
  }
`;

const ModalArticle = styled.article`
  width: 80%;
  height: 80%;
  margin: auto;
  border-radius: 0.3rem;
  background-color: #fff;
  /* 팝업이 열릴때 스르륵 열리는 효과 */
  animation: ${ModalArticleAnimation} 0.3s;
  overflow: hidden;
`;

const StyledClose = styled(Close)``;

const CloseBtn = styled.button`
  position: relative;
  float: right;
  top: 8px;
  right: 8px;
  background-color: transparent;
`;

const Main = styled.main`
  padding: 16px;
`;

const Thumnail = styled.img`
  width: 30vw;
  height: 30vw;
  object-fit: cover;
`;

const DescriptionSection = styled.section``;

function TrainingLogModal({ open, close, info }: TrainingLogModalProps) {
  return (
    <Container className={open ? "openModal" : ""}>
      {open ? (
        <ModalArticle>
          <CloseBtn onClick={close}>
            <StyledClose />
          </CloseBtn>
          <Main>
            <Row>
              <Thumnail src={info.toString()} />
              <DescriptionSection>
                🥋지호 훈련일지 🥋 2022. 12. 02. 금 정종원 김찬우 이선재 김영민
                이은솔 한지선 오승훈 김성우 금일은 이번 학기 마지막 정규
                운동으로 8분이 참여해주셨습니다. 훈련은 몸풀기 후 구르기,
                익히기, 굳히기, 자유대련 순으로 진행하여 행복유도로 마무리
                했습니다. 추운 날씨에 운동하면 부상을 입기 쉬우니 몸을 잘
                풀어줘야 한다고 강조하셔서 오늘은 더 열심히 몸풀기를 하였습니다.
                스트레칭을 하다가 승훈 선배가 발가락이 다치기 쉽다고 해서
                발가락까지 꼼꼼하게 잘 풀어주었습니다. 이후 구르기를 했는데
                저한테는 아직도 어려운 동작이 많아서 따로 연습할 필요성을
                느꼈습니다. 오늘은 특히 구르기가 안되서 옆 도랑에 빠질 뻔
                했습니다. 구르기 후 익히기를 2-30분 정도 진행했습니다. 처음
                들어왔을 때는 밭다리만 배워서 익히기 때 밭다리만 연습했는데
                지금은 발목받치기, 양팔엎어치기까지 배워서 뭘 연습할지 고민하게
                됩니다. 밭다리후리기는 이제 몸에 좀 익은 것 같은데
                양팔엎어치기는 배운지 얼마 안돼 실전에서 쓰기 어려운 것
                같습니다. 언젠가 대련 때 멋지게 엎어치기를 완성시키는게 제 꿈이
                되었습니다.😁 굳히기는 밀어내기 식으로 4번을 연이어 했는데 한
                번만 해도 힘든 굳히기를 4번이나 하니 땀도 많이 나고
                힘들었습니다. 마지막엔 목 조르기를 당했는데 탭 칠 힘도 없어서
                죽을 뻔 했습니다.🥺 그래도 굳히기를 제일 좋아해서 재밌게 한 것
                같습니다. 자유대련은 1-2팀 씩 진행하였습니다. 예전에는 실전에서
                기술을 쓰기가 어려워 상대가 넘기라고 다리를 내어줘도 넘기지
                못했는데, 오늘은 많이 익숙해진 밭다리후리기로 상대를 몇 번
                넘기게 되었습니다. 기술을 걸 때는 상대에게 몸을 밀착해야 힘이 더
                잘 전달이 되는 것 같습니다. 마지막에는 행복유도를 진행했습니다.
                무릎을 꿇고 상대의 깃을 양손으로 먼저 잡는 게임과 일어서서
                상대의 무릎을 먼저 터치하는 게임을 했습니다. 5세트 씩 진행했는데
                세트에서 진 사람은 버피테스트 5개씩 수행하였습니다. 행복유도는
                가볍게 할 수 있으면서도 숨도 많이 차서 마무리 운동으로 좋았고
                게임 형식이라 상대방과 즐겁게 할 수 있다는 점이 장점인 것
                같습니다. 행복유도를 끝으로 이번 정규 운동은 마무리가
                되었습니다. 지호 부원들도 시험도 잘 보시고 대회 나가시는 분들은
                좋은 성적 얻으셔서 한 해를 행복하게 잘 마무리 하셨으면
                좋겠습니다. 내일 오전에는 눈이 온다고 합니다.❄️ 요즘 너무 추운
                날씨인데 따뜻하게 입고 감기 걸리지 않게 조심하세요.😁 내년
                봄에도 건강한 모습으로 즐겁게 운동하면 좋겠습니다. 다들 고생
                많으셨습니다!!
              </DescriptionSection>
            </Row>
          </Main>
        </ModalArticle>
      ) : null}
    </Container>
  );
}

export default TrainingLogModal;

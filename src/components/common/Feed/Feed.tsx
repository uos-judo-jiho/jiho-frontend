import styled from "styled-components";

const FeedContainer = styled.div`
  & > div:first-child {
    margin-top: 0;
  }
`;

interface FeedProps {
  children: React.ReactNode;
}

const Feed = ({ children }: FeedProps) => {
  return <FeedContainer>{children}</FeedContainer>;
};

export default Feed;

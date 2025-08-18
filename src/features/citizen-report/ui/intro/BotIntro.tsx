import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

const BotIntro = () => {
  return (
    <TextWrapper>
      <img src="/images/character/character3.png" alt="땅땅이" />
      <p>
        반가워요! <br />
        싱크홀 분석봇 땅땅이에요. <br />
        무엇을 도와드릴까요?
      </p>
    </TextWrapper>
  );
};

export default BotIntro;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2.5rem;
  gap: 1.88rem;
  margin-bottom: 1.56rem;

  img {
    width: 5.3rem;
    height: 5.2rem;
  }

  p {
    color: ${({ theme }) => theme.colors.black01};
    ${fonts.titleBold20}
  }
`;

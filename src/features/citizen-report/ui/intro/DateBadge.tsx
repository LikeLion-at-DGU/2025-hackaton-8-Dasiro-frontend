import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

const DateBadge = ({ date }: { date: string }) => (
  <DateContainerWrapper>
    <DateContainer>{date}</DateContainer>
  </DateContainerWrapper>
);

export default DateBadge;

// -------------- style --------------

const DateContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const DateContainer = styled.section`
  height: 1.94rem;
  padding: 0.44rem 0.81rem;
  align-items: center;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.black07};
  color: ${({ theme }) => theme.colors.black01};
  ${fonts.capSemi12}
`;

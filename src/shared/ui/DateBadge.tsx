import { formatDate } from "@shared/lib/formatDate";
import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

const DateBadge = () => {
  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <DateContainerWrapper>
      <DateContainer>{formattedDate}</DateContainer>
    </DateContainerWrapper>
  );
};

export default DateBadge;

const DateContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2.19rem;
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

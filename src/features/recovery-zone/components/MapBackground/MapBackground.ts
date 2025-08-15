import styled from "styled-components";
import { type PositionProps } from "../../types/ui";

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812; // 기준 디자인 높이

export const BackgroundCircle = styled.div<PositionProps>`
    width: 27.8vh;
    aspect-ratio: 1/1;
    background: var(--Orange-Orange04, #FFD8C0);
    filter: blur(140.82789611816406px);
    position: absolute;
    /* props로 받은 px 값을 % 단위로 변환 */
    top: ${({ $top = 0 }) => ($top / DESIGN_HEIGHT) * 100}%;
    left: ${({ $left = 0 }) => ($left / DESIGN_WIDTH) * 100}%;
`
import * as BasicElement from "@shared/ui/BasicElement";
import styled from "styled-components";

const DESIGN_HEIGHT = 812;
const DESIGN_WIDTH = 400;

interface MapBackgroundCircleProps {
  $top?: number;
  $left?: number;
}

export const MapBackgroundCircle = styled(BasicElement.Overlay)<MapBackgroundCircleProps>`
  width: 27.8vh;
  aspect-ratio: 1/1;
  background: var(--Orange-Orange04, #ffd8c0);
  filter: blur(140.82789611816406px);
  top: ${({ $top = 0 }) => ($top / DESIGN_HEIGHT) * 100}%;
  left: ${({ $left = 0 }) => ($left / DESIGN_WIDTH) * 100}%;
`;

import { css } from "styled-components";

//TODO: 플젝 디자인시스템 맞게 수정
const fontGenerator = (
  weight: number,
  size: string,
  lineHeight?: string
) => css`
  font-weight: ${weight};
  font-size: ${size};
  line-height: ${lineHeight};
  font-family: "suit";
`;

export const fonts = {
  titleExtra22: fontGenerator(800, "22px"),
  titleBold22: fontGenerator(700, "22px"),
  titleExtra20: fontGenerator(800, "20px"),
  titleBold20: fontGenerator(700, "20px"),
  titleSemiB20: fontGenerator(600, "20px"),

  subExtra16: fontGenerator(800, "16px"),
  subBold16: fontGenerator(700, "16px"),
  subSemi16: fontGenerator(600, "16px"),
  subMedium16: fontGenerator(500, "16px"),

  bodyExtra14: fontGenerator(800, "14px"),
  bodyBold14: fontGenerator(700, "14px"),
  bodySemiB14: fontGenerator(600, "14px", "25px"),
  bodyMedium14: fontGenerator(500, "14px"),

  capExtra12: fontGenerator(800, "12px"),
  capBold12: fontGenerator(700, "12px"),
  capSemi12: fontGenerator(600, "12px"),
  capMedium12: fontGenerator(500, "12px"),

  capExtra10: fontGenerator(800, "10px"),
  capBold10: fontGenerator(700, "10px"),
  capSemi10: fontGenerator(600, "10px"),
  capMedium10: fontGenerator(500, "10px"),
};

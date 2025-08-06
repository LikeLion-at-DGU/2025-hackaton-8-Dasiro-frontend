import type { ThemeType } from "@shared/styles/theme";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

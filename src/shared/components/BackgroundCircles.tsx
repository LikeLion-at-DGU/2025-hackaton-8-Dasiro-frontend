import { MapBackgroundCircle } from "./MapBackgroundCircle";

const BACKGROUND_CIRCLE_POSITIONS = [
  { top: 238, left: -127 },
  { top: 70, left: 238 },
  { top: 491, left: -67 },
] as const;

export const BackgroundCircles = () => (
  <>
    {BACKGROUND_CIRCLE_POSITIONS.map((position, index) => (
      <MapBackgroundCircle
        key={index}
        $top={position.top}
        $left={position.left}
      />
    ))}
  </>
);

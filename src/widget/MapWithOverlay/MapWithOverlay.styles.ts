import { fonts } from "@shared/styles/fonts";
import styled, { css } from "styled-components";

export const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  top: calc(env(safe-area-inset-top, 0px) + 12px);
  z-index: 10;
  pointer-events: none;
`;

export const Card = styled.div`
  pointer-events: auto;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.black07};
  border: 1px solid ${({ theme }) => theme.colors.black05};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 15px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SearchRow = styled(Row)``;

export const Dot = styled.span<{ $center?: boolean; $dest?: boolean }>`
  width: 7.5px;
  height: 7.5px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  background: ${({ theme }) => theme.colors.orange05};

  ${({ $center, theme }) =>
    $center &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.green01},
        0 0 0 6px ${theme.colors.green02};
    `}

  ${({ $dest, theme }) =>
    $dest &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.orange01},
        0 0 0 6px ${theme.colors.orange04};
    `}
`;

export const FlexContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MyLocationText = styled.div`
  flex: 1;
  ${fonts.bodySemiB14};
  cursor: pointer;
  user-select: none;
`;

export const OpenPill = styled.button`
  flex: 1;
  text-align: left;
  ${fonts.bodySemiB14};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.black07};
  color: ${({ theme }) => theme.colors.black03};
  cursor: pointer;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.black03};
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.black04};
  opacity: 0.4;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const SearchContainer = styled.div`
  flex: 1;
`;

export const PickBanner = styled.div`
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  background: #111;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 11;
`;

export const BannerButton = styled.button`
  background: #fff;
  color: #111;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
`;

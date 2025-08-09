import { fonts } from "@shared/styles/fonts";
import styled from "styled-components";

export const Wrap = styled.div`
  position: relative;
  width: 100%;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Input = styled.input`
  flex: 1;
  ${fonts.bodySemiB14}
  outline: none;
  background-color: transparent;

  &:focus {
  }
`;

export const List = styled.ul`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin: 0;
  padding: 8px;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
`;

export const ItemButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #f8fafc;
  }
`;

export const ItemTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111827;
`;

export const ItemSub = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

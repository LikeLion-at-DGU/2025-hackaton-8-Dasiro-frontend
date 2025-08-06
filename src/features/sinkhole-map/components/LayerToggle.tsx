//예시

// import styled from "styled-components";
// import { useSelectedLayer } from "../hooks/useSelectedLayer";

// const LAYERS = ["지반", "지하수", "지하철", "노후건물"];

// export const LayerToggle = () => {
//   const { selectedLayer, setLayer } = useSelectedLayer();

//   return (
//     <ToggleWrapper>
//       {LAYERS.map((layer) => (
//         <button
//           key={layer}
//           className={layer === selectedLayer ? "active" : ""}
//           onClick={() => setLayer(layer)}
//         >
//           {layer}
//         </button>
//       ))}
//     </ToggleWrapper>
//   );
// };

// const ToggleWrapper = styled.div`
//   display: flex;
//   gap: 8px;

//   button {
//     padding: 8px 16px;
//     border-radius: 4px;
//     border: none;
//     background-color: #eee;

//     &.active {
//       background-color: #3d5afe;
//       color: white;
//     }
//   }
// `;

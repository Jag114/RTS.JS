import React from "react";
import InterfaceCell from "./InterfaceCell";
import { Cell } from "./Map";
import { v4 as uudiv4} from 'uuid'

interface Props {
  map: Cell[][],
  data: {endCol:number, endRow:number},
  scale: number;
}

// scale should change amount of cells
const InteraceTable = ({ map, data, scale }: Props) => {


  return (
    <table>
      <tbody>
        {map.map((row, rowIndex) => (
          rowIndex < data.endRow &&
          <tr key={rowIndex}>
            {row.map((cell) => (
              cell.y < data.endCol &&
              <InterfaceCell scale={scale} cellData={cell} key={uudiv4()} />
            ))}
          </tr>
        ))}

      </tbody>
    </table>
  );
};

export default InteraceTable;

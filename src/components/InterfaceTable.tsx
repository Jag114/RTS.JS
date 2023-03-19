import React from "react";
import InterfaceCell from "./InterfaceCell";
import { Cell } from "./Map";
import { v4 as uudiv4} from 'uuid'

interface Props {
  data: Cell[][],
  scale: number;
}

// scale should change amount of cells
const InteraceTable = ({ data, scale }: Props) => {
  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell) => (
              <InterfaceCell scale={scale} cellData={cell} key={uudiv4()} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InteraceTable;

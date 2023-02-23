import type { Cell } from "../components/Map";

function makeMap(row:number, col:number){
  const colors = ["green", "blue", "grey", "yellow"];
  const mapCellsRows = Array.from({length: row}, () => new Array<Cell>(col));
  for (let i = 0; i < row; i++) {
    for(let j = 0; j < col; j++){
      const cell:Cell = {
        x: i,
        y: j,
        width: 10,
        height: 10,
        terrain: colors[Math.floor(Math.random() * colors.length)]
      };
      mapCellsRows[i][j] = cell;
    }
  }
  return mapCellsRows;
}


export default makeMap;

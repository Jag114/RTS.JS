import { useState } from "react";
import type { Cell } from "../components/Map";
import makeMap from "../data/makeMap";

function useMapState(col:number, row:number) {
  const [map, setMap] = useState<Cell[]>([]); //visible world, changes

  let limit = 0;
  let newMap: any[] = [];
  if (localStorage.getItem("mapState") === null ||JSON.parse(localStorage.getItem("mapState")!).length < 1) {
    console.log("A")
    newMap = [...makeMap(row, col)];
    localStorage.setItem("mapState", JSON.stringify(newMap));
    setMap([...newMap]);
  } else {
    console.log("B")
    newMap = [...JSON.parse(localStorage.getItem("mapState")!)];
    limit++;
    if(limit < 1){
      setMap([...newMap]);
    }else{
      console.log("Something went wrong")
    }
  }

  const trueMap:Cell[] = [...map]
  return [ trueMap, setMap ];
}

export default useMapState;

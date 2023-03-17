import React from "react";
import "../styles/Map.css"
import { Cell } from "./Map";

let a = 1;

function InterfaceCell(props:any) {
  const { terrain, width, height } = props.cellData;
  const scale = props.scale;
  const style = {width: `${width*scale}px`, height: `${height*scale}px`}
  a < 10 && console.log("Props: ", props,"Scale: ", scale,"Style: ", style);
  a++;
  const handleClick = () => {
    console.log(terrain, scale, style);
  }

  return ( 
    <div className="map-interface-cell" onClick={() => handleClick()} style={style}></div>
  );
}

export default InterfaceCell;

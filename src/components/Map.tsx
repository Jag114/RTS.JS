import React, { useEffect, useRef, useState } from "react";
import "../styles/Map.css";
import makeMap from "../data/makeMap";
import WorldMap from "./WorldMap"
export type { Cell }

type Cell = { 
  x:number, y:number, width:number, height:number, terrain:string, ID:string
}
//odd numbers so there is central cell (not needed?)
const COL_NUMBER = 160;
const ROW_NUMBER = 80;


function Map() {
  const [map, setMap] = useState(() => {
    const storedMap = localStorage.getItem("myMap");
    if (storedMap !== null && storedMap.length > 10) {
      return JSON.parse(storedMap);
    }
    const newMap = makeMap(ROW_NUMBER, COL_NUMBER);
    localStorage.setItem("myMap", JSON.stringify(newMap));
    return newMap;
  });
  //save new version of map everytime it changes
  useEffect(() => {
    localStorage.setItem("myMap", JSON.stringify(map));
  }, [map]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getContext = (canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null => {
    return canvas?.getContext('2d') ?? null;
  };
  
  const [scaleExponent, setScaleExponent] = useState(0);
  const scale = Math.pow(2, scaleExponent);
  console.log("Scale: ", scale,"Scale exponent: ", scaleExponent);
  console.log("AAAAAAAAAAAAAAAAAAAAA");
  
  
  const [ remake, setRemake ] = useState(false); //for forcing rerenders
  const worldMap:Cell [][] = map //constant data for world
  //randomized colors
  //add starting(UP, LEFT) and ending (DOWN, RIGHT) cell 
  //REWRITE IT TO CUSTOM COMPONENT (DIV RO STH)?
  function draw(ctx:CanvasRenderingContext2D | undefined, cell:Cell, i:number, j:number){
    const { width, height, terrain } = cell;

    if(ctx !== undefined){
      ctx.beginPath()
      //add perlin noise or weights to certain colours aka terrains
      ctx.fillStyle = terrain;
      ctx.fillRect(i * 10 * scale, j * 10 * scale, width * scale, height * scale);
      ctx.closePath();
    }
  }

  useEffect(() => {   
    const canvas = canvasRef.current;
    const context = getContext(canvas);
    const endCol = Math.floor((COL_NUMBER / scale));
    const endRow = Math.floor((ROW_NUMBER / scale));
    console.log(endCol, endRow);
    
    if(context !== null){
      const start = Date.now();
      map.forEach((col:Cell[], j:number) => {
        if(j < endRow){
          col.forEach((cell:Cell, i:number) => {
            if(i < endCol){
              draw(context, cell, i, j);
            }
          });
        }
      })   
      //console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
    }
  }, [draw, scaleExponent])
  
  // needs an algorithm to create new array of cells that are visible after resizing
  const changeScale = (value:string, scaleExponentValue:number, ctx:CanvasRenderingContext2D | null | undefined) :void => {
    let newScaleExponentValue = scaleExponentValue; 
    switch (value) {
      case "+":
        if(newScaleExponentValue < 4){   
          newScaleExponentValue++;
        }
        break;
      case "-":
        if(newScaleExponentValue > 0){
          newScaleExponentValue--;
        }
        break;
      default:
        break;
    }

    if(newScaleExponentValue !== scaleExponent){
      ctx?.clearRect(0, 0, 1600, 800);
      setScaleExponent(newScaleExponentValue);
    } 
  }

  const remakeMap = (ctx:CanvasRenderingContext2D | null | undefined): void => {
    localStorage.setItem("myMap", JSON.stringify([]))
    ctx?.clearRect(0, 0, 1920, 1080)
    setMap([...makeMap(ROW_NUMBER, COL_NUMBER)])
  }

  //base zooming around central cell
  const getCentralCell = (map:Cell[][], scale:number):Cell | void => {
    //console.log(map)
    //console.log("Scale: ", scale)
    const cellsInRow = Math.floor((COL_NUMBER / scale));
    //console.log("Cells in row (drawn columns): ", cellsInRow)
    const cellsInColumn = Math.floor((ROW_NUMBER / scale));
    //console.log("Cells in col (drawn rows): ", cellsInColumn)
    const xCoord = Math.ceil(cellsInColumn / 2) - 1;
    //console.log("X: ", xCoord);
    const yCoord = Math.ceil(cellsInRow / 2) - 1;
    //console.log("Y: ", yCoord)
    if(map[xCoord] === undefined || map[xCoord][yCoord] === undefined){
      window.alert("Error, out of scope array operation")
      return;
    }
    const centralCell:Cell = map[xCoord][yCoord];
    //console.log("Central cell: ", centralCell)
    centralCell.terrain = "red";
    return centralCell;
  }

  useEffect(() => {
    getCentralCell(map, scale)
  }, [scale])

  return (
    <div className="map-holder">
      <div className="map-zoom">
        <span> Zoom in/out </span>
        <button className="map-zoom-plus" onClick={() => changeScale("+", scaleExponent, getContext(canvasRef.current))}> + </button>
        <button className="map-zoom-minus" onClick={() => changeScale("-", scaleExponent, getContext(canvasRef.current))}> - </button>
      </div>
      <button className="map-button" onClick={() => remakeMap(getContext(canvasRef.current))}> New map </button>
      <button className="map-button" onClick={() => localStorage.setItem("myMap", JSON.stringify([]))}> Reset saved map</button>
        <WorldMap/>
    </div> 
  )
}

export default Map;
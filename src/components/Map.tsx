import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import useMapState from "../hooks/useMapState";
import makeMap from "../data/makeMap";
export type { Cell }

type Cell = { 
  x:number, y:number, width:number, height:number, terrain:string
}
//odd numbers so there is central cell
const COL_NUMBER = 161;
const ROW_NUMBER = 81;
let scale = 1;

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

  const [ remake, setRemake ] = useState(false); //for forcing rerenders
  const worldMap = [{...map}]; //constant data for world
  //randomized colors
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
    if(context !== null){
      const start = Date.now();
      map.forEach((col:Cell[], j:number) => {
        col.forEach((cell:Cell, i:number) => {
          draw(context, cell, i, j);
        });
      }, [])   
      console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
    }
  }, [draw])
  
  // needs an algorithm to create new array of cells that are visible after resizing
  const changeScale = (value:string, scaleValue:number, ctx:CanvasRenderingContext2D | null | undefined) :void => {
    let newScale = scaleValue;
    switch (value) {
      case "+":
        if(newScale < 100){
          newScale++;
        }
        break;
      case "-":
        if(newScale > 1){
          newScale--;
        }
        break;
      default:
        break;
    }

    if(scale !== newScale){
      scale = newScale;
      ctx?.clearRect(0, 0, 1600, 800);
      setRemake(prevRemake => !prevRemake);
    }
  }

  const remakeMap = (): void => {
    localStorage.setItem("myMap", JSON.stringify([]))
    setMap([...makeMap(ROW_NUMBER, COL_NUMBER)])
  }

  //base zooming around central cell
  const getCentralCell = (map:Cell[][], scale:number):Cell => {
    console.log("Scale: ", scale)
    const cellsInRow = Math.floor((COL_NUMBER / (1 * scale)));
    console.log("Cells in row: ", cellsInRow)
    const cellsInColumn = Math.floor((ROW_NUMBER / (1 * scale)));
    console.log("Cells in rocolw: ", cellsInColumn)
    const yCoord = Math.ceil(cellsInRow / 2);
    console.log("Y: ", yCoord);
    const xCoord = Math.ceil(cellsInColumn / 2);
    console.log("X: ", xCoord)
    const centralCell:Cell = map[xCoord][yCoord];
    console.log("Central cell: ", centralCell)
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
        <button className="map-zoom-plus" onClick={() => changeScale("+", scale, getContext(canvasRef.current))}> + </button>
        <button className="map-zoom-minus" onClick={() => changeScale("-", scale, getContext(canvasRef.current))}> - </button>
      </div>
      <button className="map-button" onClick={() => remakeMap()}> New map </button>
      <button className="map-button" onClick={() => localStorage.setItem("myMap", JSON.stringify([]))}> Reset saved map</button>
      <canvas className="map-canvas" height="800px" width="1600px" ref={canvasRef}/>
    </div> 
  )
}

export default Map;
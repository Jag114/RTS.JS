import React, { useEffect, useRef, useState } from "react";
import "../styles/Map.css";
import useMapState from "../hooks/useMapState";
import makeMap from "../data/makeMap";
import InterfaceCell from "./InterfaceCell"
export type { Cell }

type Cell = { 
  x:number, y:number, width:number, height:number, terrain:string, ID:string
}
//odd numbers so there is central cell
const COL_NUMBER = 160;
const ROW_NUMBER = 80;
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
  const worldMap:Cell [][] = map //constant data for world
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
  
  const drawInterface = () => {
    const interfaceMapArray:JSX.Element[] = [];
    worldMap.forEach(e => {
      e.forEach((cell:Cell) => {
        const propsObj:object = {
          cellData: {...cell},
          scale: scale
        }
        interfaceMapArray.push(<InterfaceCell {...propsObj} key={cell.ID}/>)
      })
    })
    console.log(interfaceMapArray);
    
    return interfaceMapArray;
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

  const remakeMap = (ctx:CanvasRenderingContext2D | null | undefined): void => {
    localStorage.setItem("myMap", JSON.stringify([]))
    ctx?.clearRect(0, 0, 1920, 1080)
    setMap([...makeMap(ROW_NUMBER, COL_NUMBER)])
  }

  //base zooming around central cell
  const getCentralCell = (map:Cell[][], scale:number):Cell | void => {
    console.log(map)
    console.log("Scale: ", scale)
    const cellsInRow = Math.floor((COL_NUMBER / scale));
    console.log("Cells in row (drawn columns): ", cellsInRow)
    const cellsInColumn = Math.floor((ROW_NUMBER / scale));
    console.log("Cells in col (drawn rows): ", cellsInColumn)
    const xCoord = Math.ceil(cellsInColumn / 2) - 1;
    console.log("X: ", xCoord);
    const yCoord = Math.ceil(cellsInRow / 2) - 1;
    console.log("Y: ", yCoord)
    if(map[xCoord] === undefined || map[xCoord][yCoord] === undefined){
      window.alert("Error, out of scope array operation")
      return;
    }
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
      <button className="map-button" onClick={() => remakeMap(getContext(canvasRef.current))}> New map </button>
      <button className="map-button" onClick={() => localStorage.setItem("myMap", JSON.stringify([]))}> Reset saved map</button>
      <div className="map-interface" style={{height: "800px", width: "1600px"}}>
        {drawInterface()}
      </div>
      <canvas className="map-canvas" height="800px" width="1600px" ref={canvasRef}/>
    </div> 
  )
}

export default Map;
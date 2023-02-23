import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import useMapState from "../hooks/useMapState";
import makeMap from "../data/makeMap";
export type { Cell }

type Cell = { 
  x:number, y:number, width:number, height:number, terrain:string
}

const COL_NUMBER = 161;
const ROW_NUMBER = 81;
let scale = 1;

function Map() {
  //const [ map, setMap ] = useMapState(ROW_NUMBER, COL_NUMBER);
  const [map, setMap] = useState(() => {
    const storedMap = localStorage.getItem("myMap");
    if (storedMap !== null && storedMap.length > 10) {
      return JSON.parse(storedMap);
    }
    const newMap = makeMap(ROW_NUMBER, COL_NUMBER);
    localStorage.setItem("myMap", JSON.stringify(newMap));
    return newMap;
  });

  useEffect(() => {
    localStorage.setItem("myMap", JSON.stringify(map));
  }, [map]);

  const [ remake, setRemake ] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const canvas2:HTMLCanvasElement | null = canvasRef.current;
  const context2 = canvas2?.getContext('2d'); 
  //when player moves the map its should redraw, make 1 cell bigger visually
  useEffect(() => {   
    const canvas:HTMLCanvasElement | null = canvasRef.current;
    const context = canvas?.getContext('2d'); 
    if(canvas !== null){
      if(context !== null){
        const start = Date.now();
        map.forEach((col:Cell[], j:number) => {
          col.forEach((cell:Cell, i:number) => {
            draw(context, cell, i, j);
          });
        })   
        console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
      }
    }
  }, [draw])
  console.log(map);
  
  // needs an algorithm to create new array of cells that are visible after resizing
  function changeScale(value:string, scaleValue:number, ctx:CanvasRenderingContext2D | null | undefined){
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

  function remakeMap(){
    localStorage.setItem("myMap", JSON.stringify([]))
    setRemake(prevRemake => !prevRemake)
  }
  
  return (
    <div className="map-holder">
      <div className="map-zoom">
        <span> Zoom in/out </span>
        <button className="map-zoom-plus" onClick={() => changeScale("+", scale, context2)}> + </button>
        <button className="map-zoom-minus" onClick={() => changeScale("-", scale, context2)}> - </button>
      </div>
      <button className="map-button" onClick={() => remakeMap()}> New map </button>
      <button className="map-button" onClick={() => localStorage.setItem("myMap", JSON.stringify([]))}> Reset saved map</button>
      <canvas className="map-canvas" height="800px" width="1600px" ref={canvasRef}/>
    </div> 
  )
}

export default Map;

/*
const canvasRef = useRef<HTMLCanvasElement>(null);

// Define a function to get the context of a canvas
const getContext = (canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null => {
  return canvas?.getContext('2d') ?? null;
};

// Define a function to draw the map
const drawMap = (context: CanvasRenderingContext2D | null, map: Cell[][]): void => {
  if (context !== null) {
    const start = Date.now();
    map.forEach((col:Cell[], j:number) => {
      col.forEach((cell:Cell, i:number) => {
        draw(context, cell, i, j);
      });
    })   
    console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
  }
};

const Map = (): JSX.Element => {
  const canvas = canvasRef.current;
  const context = getContext(canvas);

  const [scale, setScale] = useState<number>(1);

  // Define a function to change the scale of the canvas
  const changeScale = (op: "+" | "-", scale: number, context: CanvasRenderingContext2D | null): void => {
    if (context !== null) {
      if (op === "+") {
        setScale(scale + 0.1);
      } else {
        setScale(scale - 0.1);
      }
      context.scale(scale, scale);
      drawMap(context, map);
    }
  };

  // Define a function to remake the map
  const remakeMap = (): void => {
    const newMap = createMap();
    setMap(newMap);
    drawMap(context, newMap);
  };

  return (
    <div className="map-holder">
      <div className="map-zoom">
        <span> Zoom in/out </span>
        <button className="map-zoom-plus" onClick={() => changeScale("+", scale, context)}> + </button>
        <button className="map-zoom-minus" onClick={() => changeScale("-", scale, context)}> - </button>
      </div>
      <button className="map-button" onClick={() => remakeMap()}> New map </button>
      <button className="map-button" onClick={() => localStorage.setItem("myMap", JSON.stringify([]))}> Reset saved map</button>
      <canvas className="map-canvas" height="800px" width="1600px" ref={canvasRef}/>
    </div> 
  );
};

*/
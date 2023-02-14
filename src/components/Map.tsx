import { useEffect, useRef, useState } from "react";
import "./Map.css";

function Map() {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  type Cell = { //add terrain type
    x:number, y:number, width:number, heigth:number
  }
  let mapCellsRows = new Array(100);
  for(let i = 0; i < mapCellsRows.length; i++){
    mapCellsRows[i] = new Array(100);
  }

  for (let i = 0; i < 100; i++) {
    for(let j = 0; j < 100; j++){
      let cell:Cell = {
        x: i,
        y: j,
        width: 10,
        heigth: 10,
      };
      mapCellsRows[i][j] = cell;
    }
  }

  function draw(ctx:CanvasRenderingContext2D, x:number, y:number){
    ctx.fillStyle = 'green';
    ctx.fillRect(x + 10, y + 10, x + 1000, y + 500);
  }
  //when player moves the map its should redraw, make 1 cell bigger visually
  useEffect(() => {
    const canvas:HTMLCanvasElement | null = canvasRef.current;
    if(canvas !== null){
      const context = canvas.getContext('2d');
      if(context !== null){
        let start = Date.now();
        mapCellsRows.forEach((e) => {
          e.forEach((cell:Cell) => {
            draw(context, cell.x, cell.y)
          });
        })
        console.log(Date.now() - start);
      }
    }
  }, [draw])
  
  return (
    <canvas id="map-canvas" height="600px" width="1200px" ref={canvasRef}/>
  )
}

export default Map;

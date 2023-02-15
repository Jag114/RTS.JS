import { useEffect, useRef, useState } from "react";
import "./Map.css";

function Map() {
  
  const [ map, setMap ] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  type Cell = { //add terrain type
    x:number, y:number, width:number, height:number,
  }
  let mapCellsRows = new Array(100);
  for(let i = 0; i < mapCellsRows.length; i++){
    mapCellsRows[i] = new Array(100);
  }

  for (let i = 0; i < mapCellsRows.length; i++) {
    for(let j = 0; j < mapCellsRows.length; j++){
      let cell:Cell = {
        x: i,
        y: j,
        width: 10,
        height: 10,
      };
      mapCellsRows[i][j] = cell;
    }
  }

  const colorArray = ['gray', 'green', 'blue', 'yellow'];
  //randomized colors
  function draw(ctx:CanvasRenderingContext2D, cell:Cell, i:number, j:number){
    const { width, height } = cell;
    ctx.beginPath()
    //add perlin noise or weights to certain colours aka terrains
    let index = Math.floor(Math.random() * colorArray.length);
    ctx.fillStyle = colorArray[index];
    ctx.fillRect(i * 10 + 10, j * 10 + 10, width, height);
    ctx.closePath();
  }

  //https://stackoverflow.com/questions/47774145/creating-chess-board-with-canvas
  //when player moves the map its should redraw, make 1 cell bigger visually
  useEffect(() => {
    const canvas:HTMLCanvasElement | null = canvasRef.current;
    if(canvas !== null){
      const context = canvas.getContext('2d');
      if(context !== null){
        let start = Date.now();
        mapCellsRows.forEach((col, j) => {
          col.forEach((cell:Cell, i:number) => {
            draw(context, cell, i, j);
          });
        })   
        console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
      }
    }
  }, [draw])
  
  return (
    <>
      <canvas id="map-canvas" height="1080px" width="1920px" ref={canvasRef}/>
      <button onClick={() => setMap(prevMap => !prevMap)}> New map </button>
    </>
    
  )
}

export default Map;

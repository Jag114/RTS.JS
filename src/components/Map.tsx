import { useEffect, useRef, useState } from "react";
import "./Map.css";

const COL_NUMBER = 160;
const ROW_NUMBER = 80;
let scale = 1;
let newMap:any;

function Map() {
  // custom hook for this
  if(localStorage.getItem("mapState") !== null){
    newMap = [...JSON.parse(localStorage.getItem("mapState")!)]
  }else{
    newMap = makeMap();
  }
  const [ map, setMap ] = useState([...newMap]) //visible world, changes
  const [ remake, setRemake ] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldMap = [...map]; //constant data for world
  localStorage.setItem("mapState", JSON.stringify(map));

  type Cell = { //add terrain type
    x:number, y:number, width:number, height:number,
  }
  
  function makeMap(){
    let mapCellsRows = new Array(ROW_NUMBER).fill(new Array(COL_NUMBER));

    for (let i = 0; i < ROW_NUMBER; i++) {
      for(let j = 0; j < COL_NUMBER; j++){
        let cell:Cell = {
          x: i,
          y: j,
          width: 10,
          height: 10,
        };
        mapCellsRows[i][j] = cell;
      }
    }
    return mapCellsRows;
  }

  const colorArray = ['gray', 'green', 'blue', 'yellow'];
  //randomized colors
  function draw(ctx:CanvasRenderingContext2D | undefined, cell:Cell, i:number, j:number){
    const { width, height } = cell;
    if(ctx !== undefined){
      ctx.beginPath()
      //add perlin noise or weights to certain colours aka terrains
      let index = Math.floor(Math.random() * colorArray.length);
      ctx.fillStyle = colorArray[index];
      ctx.fillRect(i * 10 * scale, j * 10 * scale, width, height);
      ctx.closePath();
    }
  }

  const canvas:HTMLCanvasElement | null = canvasRef.current;
  const context = canvas?.getContext('2d');
  //https://stackoverflow.com/questions/47774145/creating-chess-board-with-canvas
  //when player moves the map its should redraw, make 1 cell bigger visually
  useEffect(() => {
    if(canvas !== null){
      if(context !== null){
        let start = Date.now();
        map.forEach((col, j) => {
          col.forEach((cell:Cell, i:number) => {
            draw(context, cell, i, j);
          });
        })   
        console.log("Draw time: " + (Date.now() - start) / 1000 + " sec.");
      }
    }
  }, [draw])
  
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
  
  return (
    <div className="map-holder">
      <div className="map-zoom">
        <span> Zoom in/out </span>
        <button className="map-zoom-plus" onClick={() => changeScale("+", scale, context)}> + </button>
        <button className="map-zoom-minus" onClick={() => changeScale("-", scale, context)}> - </button>
      </div>
      <button className="map-button" onClick={() => setRemake(prevRemake => !prevRemake)}> New map </button>
      <canvas className="map-canvas" height="800px" width="1600px" ref={canvasRef}/>
    </div> 
  )
}

export default Map;

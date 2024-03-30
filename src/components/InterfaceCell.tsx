import React from "react";
import "../styles/Map.css";

function InterfaceCell(props: any) {
  const { x, y, terrain, width, height } = props.cellData;
  const scale = props.scale;
  const style = { width: `${width * scale}px`, height: `${height * scale}px` };

  const handleClick = (e:React.MouseEvent, message:string) => {
    console.log(x, y, terrain, scale, style);

    const popup = document.createElement("div");
    popup.classList.add("map-interface-cell-popup");
    popup.textContent = message;

    const rect = e.currentTarget.getBoundingClientRect();
    popup.style.left = `${rect.left + window.scrollX + 8}px`;
    popup.style.top = `${rect.top + window.scrollY + 8}px`;

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  };

  return (
    <td
      className="map-interface-cell"
      onClick={(e) => handleClick(e, terrain)}
      style={style}
    ></td>
  );
}

export default InterfaceCell;

import { useState } from "react";
import "./Admin.css";

function Admin({ navbarItems, setNavbarItems }) {
  //To handle the drag start event, we'll store index of the dragged item
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index); //Store the index of the item being dragged
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); //Allow drop to happen
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return; //If the item is dropped in the same place, do nothing

    const newItems = [...navbarItems];
    const draggedItem = newItems[draggedIndex];

    //Remove the dragged item and insert it at the new position
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setNavbarItems(newItems);
    sessionStorage.setItem("navbarItems", JSON.stringify(newItems)); //Update the navbarItems state with the new order
    setDraggedIndex(null); //Reset dragged index
  };

  return (
    <div className="admin-container">
      <h1 className="admin-heading">Adjust Navbar</h1>
      <h3 className="admin-subheading">
        Drag and drop the navbar items into the desired order. Click the button to hide or show the navbar item.
      </h3>

      <ul className="navbar-list">
        {navbarItems.map((item, index) => (
          <li
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className="navbar-item"
          >
            <div
              className="navbar-item-content"
              style={{
                background: item.show ? "lightgreen" : "lightcoral",
              }}
            >
              <div>{item.title}</div>

              <button
                onClick={() => {
                  const newItems = [...navbarItems];
                  newItems[index].show = !newItems[index].show;
                  setNavbarItems(newItems);
                }}
                className="show-button"
              >
                {item.show ? "Hide" : "Show"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
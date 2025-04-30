import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const tshirtImageRef = useRef(null);
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      backgroundColor: "#fff",
    });
    loadTshirt("tshirt1.png");

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = fabricCanvas.current.getActiveObject();
        if (activeObject && activeObject !== tshirtImageRef.current) {
          fabricCanvas.current.remove(activeObject);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      fabricCanvas.current.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const loadTshirt = useCallback((src) => {
    fabric.Image.fromURL(src, (img) => {
      img.set({
        selectable: false,
        evented: false,
      });
      img.scaleToWidth(fabricCanvas.current.width);
      img.scaleToHeight(fabricCanvas.current.height);

      if (tshirtImageRef.current) {
        fabricCanvas.current.remove(tshirtImageRef.current);
      }

      tshirtImageRef.current = img;
      fabricCanvas.current.insertAt(img, 0);
      fabricCanvas.current.renderAll();
    });
  }, []);

  const handleTshirtChange = (e) => {
    loadTshirt(e.target.value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        const canvasWidth = fabricCanvas.current.width;
        const canvasHeight = fabricCanvas.current.height;

        const maxLogoWidth = canvasWidth * 0.4;
        const maxLogoHeight = canvasHeight * 0.4;

        const scaleRatio = Math.min(
          maxLogoWidth / img.width,
          maxLogoHeight / img.height
        );

        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: "center",
          originY: "center",
          scaleX: scaleRatio,
          scaleY: scaleRatio,
          hasBorders: true,
          hasControls: true,
          selectable: true,
        });

        fabricCanvas.current.add(img);
        fabricCanvas.current.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    const canvasWidth = fabricCanvas.current.width;
    const canvasHeight = fabricCanvas.current.height;
    const text = new fabric.Textbox("Your Text", {
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      originX: "center",
      originY: "center",
      fill: textColor,
      fontFamily: fontFamily,
      fontSize: 24,
      editable: true,
    });

    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const handleSave = () => {
    const dataURL = fabricCanvas.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "tshirt-design.png";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>T-shirt Designer</h2>

      <canvas
        ref={canvasRef}
        width={500}
        height={600}
        style={{ border: "1px solid #ccc" }}
      />

      <div style={{ marginTop: "10px" }}>
        <label>
          Select T-shirt:
          <select onChange={handleTshirtChange} style={{ marginLeft: "10px" }}>
            <option value="tshirt1.png">T-shirt 1</option>
            <option value="tshirt2.png">T-shirt 2</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Upload Logo:
          <input type="file" accept="image/*" onChange={handleLogoUpload} />
        </label>

        <label style={{ marginLeft: "20px" }}>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>

        <label style={{ marginLeft: "20px" }}>
          Font:
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>

        <button onClick={handleAddText} style={{ marginLeft: "20px" }}>
          Add Text
        </button>

        <button onClick={handleSave} style={{ marginLeft: "20px" }}>
          Save Design
        </button>

        <p style={{ marginTop: "10px", fontStyle: "italic" }}>
          Tip: Select an object and press <strong>Delete</strong> to remove it.
        </p>
      </div>
    </div>
  );
}

export default App;

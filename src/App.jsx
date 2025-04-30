import { useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const tshirtImageRef = useRef(null); // store T-shirt image object

  useEffect(() => {
    // Initialize fabric canvas
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      backgroundColor: "#fff",
    });
    // Load default T-shirt
    loadTshirt("tshirt1.png");

    // Cleanup
    return () => {
      fabricCanvas.current.dispose();
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

      // Remove previous T-shirt image
      if (tshirtImageRef.current) {
        fabricCanvas.current.remove(tshirtImageRef.current);
      }

      tshirtImageRef.current = img;
      fabricCanvas.current.insertAt(img, 0); // always insert at the bottom
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
        img.set({
          left: fabricCanvas.current.width / 2,
          top: fabricCanvas.current.height / 2,
          originX: "center",
          originY: "center",
          scaleX: 0.4,
          scaleY: 0.4,
        });

        img.setControlsVisibility({
          mt: true, // middle top
          mb: true, // middle bottom
          ml: true, // middle left
          mr: true, // middle right
          tl: true, // top left
          tr: true, // top right
          bl: true, // bottom left
          br: true, // bottom right
          mtr: true, // rotation
        });

        img.set({
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

        <button onClick={handleSave} style={{ marginLeft: "20px" }}>
          Save Design
        </button>
      </div>
    </div>
  );
}

export default App;

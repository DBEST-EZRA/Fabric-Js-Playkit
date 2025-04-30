import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [tshirtImage, setTshirtImage] = useState(null);

  const loadTshirt = useCallback(
    (src) => {
      fabric.Image.fromURL(src, (img) => {
        if (tshirtImage) {
          fabricCanvas.current.remove(tshirtImage);
        }
        img.selectable = false;
        img.scaleToWidth(fabricCanvas.current.width);
        img.scaleToHeight(fabricCanvas.current.height);
        fabricCanvas.current.insertAt(img, 0);
        setTshirtImage(img);
        fabricCanvas.current.renderAll();
      });
    },
    [tshirtImage]
  );

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
    });
    loadTshirt("tshirt1.png");
  }, [loadTshirt]);

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
          left: 150,
          top: 200,
          scaleX: 0.3,
          scaleY: 0.3,
        });
        fabricCanvas.current.add(img);
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

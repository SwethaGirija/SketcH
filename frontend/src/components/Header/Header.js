import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';

const Sketchpad = () => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000');
  const [brushSize, setBrushSize] = useState(4);
  const [penType, setPenType] = useState('pen');
  const [traceImage, setTraceImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedFile, setSelectedFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [includeBackground, setIncludeBackground] = useState(true);

  const handleSave = () => {
    let imgData;
    if (includeBackground) {
      const tempTraceImage = traceImage;
      setTraceImage(null);
      const canvas = canvasRef.current.canvas.drawing;
      imgData = canvas.toDataURL('image/png');
      setTraceImage(tempTraceImage);
    } else {
      const canvas = canvasRef.current.canvas.drawing;
      imgData = canvas.toDataURL('image/png');
    }
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'my_drawing.png';
    link.click();
  };

  const handleBrushColorChange = (color) => {
    setBrushColor(color);
    canvasRef.current.setState({ brushColor: color });
  };

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
    canvasRef.current.setState({ brushRadius: size });
  };

  const handlePenTypeChange = (type) => {
    setPenType(type);
    switch (type) {
      case 'pencil':
        setBrushSize(2);
        break;
      case 'marker':
        setBrushSize(10);
        break;
      case 'highlighter':
        setBrushColor('#FFFF00'); // Yellow color
        setBrushSize(20);
        break;
      default:
        setBrushSize(4);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = window.innerWidth; // Set canvas width to match Sketchpad width
          canvas.height = window.innerHeight; // Set canvas height to match Sketchpad height
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setTraceImage(canvas.toDataURL('image/png'));
          setSelectedFile(file);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 1, maxWidth: '80vw', maxHeight: '80vh', overflow: 'auto' }}>
        <CanvasDraw
          ref={canvasRef}
          canvasWidth={window.innerWidth}
          canvasHeight={window.innerHeight}
          brushColor={brushColor}
          brushRadius={brushSize}
          lazyRadius={0}
          imgSrc={traceImage}
          fitOnLoad={true} // Add fitOnLoad property
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button style={buttonStyle} onClick={() => canvasRef.current.clear(false)}>Clear</button>
        <button style={buttonStyle} onClick={() => canvasRef.current.undo()}>Undo</button>
        <button style={buttonStyle} onClick={handleSave}>Save</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>Brush Color:</span>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => handleBrushColorChange(e.target.value)}
        />
        <span style={{ marginLeft: '20px', marginRight: '10px' }}>Brush Size:</span>
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px' }}>Pen Type:</label>
        <select value={penType} onChange={(e) => handlePenTypeChange(e.target.value)}>
          <option value="pen">Pen</option>
          <option value="pencil">Pencil</option>
          <option value="marker">Marker</option>
          <option value="highlighter">Highlighter</option>
        </select>
      </div>
      <div style={{ marginTop: '20px' }}>
        <label style={{ marginRight: '10px' }}>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

const buttonStyle = {
  marginRight: '10px',
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Sketchpad;

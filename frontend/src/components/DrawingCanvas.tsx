import { useEffect, useRef, useState } from "react";
import { predictDigit } from "../services/api";

function DrawingCanvas() {

  useEffect(() => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.fillStyle = "white";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
}, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.setPointerCapture(event.pointerId);

    const coordinates = getCoordinates(event);

    if (!coordinates) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    isDrawing.current = true;

    context.beginPath();
    context.moveTo(coordinates.x, coordinates.y);
  };

  const draw = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing.current) {
      return;
    }

    const coordinates = getCoordinates(event);

    if (!coordinates) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.lineWidth = 20;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";

    context.lineTo(coordinates.x, coordinates.y);
    context.stroke();
  };

  const stopDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing.current) {
      return;
    }

    isDrawing.current = false;

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.releasePointerCapture(event.pointerId);

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.closePath();
  };

  const clearCanvas = () => {
  const canvas = canvasRef.current;

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.fillStyle = "white";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  setPrediction(null);
  setConfidence(null);
  setError(null);
};

  const handlePredict = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
        return;
    }

    setIsPredicting(true);
    setError(null);

    canvas.toBlob(async (blob) => {
        if (!blob) {
        setError("Could not create image.");
        setIsPredicting(false);
        return;
        }

        try {
        const result = await predictDigit(blob);

        setPrediction(result.prediction);
        setConfidence(result.confidence);
        } catch (error) {
        setError("Failed to get prediction.");
        } finally {
        setIsPredicting(false);
        }
    }, "image/png");
  };

  return (
    <div className="drawing-area">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
      />

      <button
        type="button"
        onClick={handlePredict}
        disabled={isPredicting}
        >
        {isPredicting ? "Predicting..." : "Predict"}
      </button>

      <button
        type="button"
        onClick={clearCanvas}
      >
        Clear
      </button>

      {prediction !== null && (
    <div className="prediction-result">
        <h2>{prediction}</h2>

        <p>
        Confidence: {(confidence! * 100).toFixed(2)}%
        </p>
    </div>
    )}
    {error && (
    <p className="error">
        {error}
    </p>
    )}

    </div>
  );
}

export default DrawingCanvas;
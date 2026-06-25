
import React, { useEffect, useRef, useState } from "react";
import { initialize, detectFace } from "../utils/Utils";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Not Detected");

  useEffect(() => {
    initialize({
      videoRef,
      faceLandmarkerRef,
      streamRef,
    });

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const detectExpression = (blendshapes) => {
    if (!blendshapes) {
      setExpression("❌ No Face Detected");
      return;
    }

    const getScore = (name) => {
      const item = blendshapes.find(
        (shape) => shape.categoryName === name
      );

      return item ? item.score : 0;
    };

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");

    const jawOpen = getScore("jawOpen");
    const browInnerUp = getScore("browInnerUp");

    const mouthFrownLeft = getScore("mouthFrownLeft");
    const mouthFrownRight = getScore("mouthFrownRight");

    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");

    console.log("Smile Left:", smileLeft);
    console.log("Smile Right:", smileRight);
    console.log("Jaw Open:", jawOpen);
    console.log("Brow Inner Up:", browInnerUp);

    if (
      smileLeft > 0.5 &&
      smileRight > 0.5
    ) {
      setExpression("😊 Happy");
    } else if (
      mouthFrownLeft > 0.3 &&
      mouthFrownRight > 0.3 &&
      browDownLeft > 0.2 &&
      browDownRight > 0.2
    ) {
      setExpression("😢 Sad");
    } else if (
      jawOpen > 0.6 &&
      browInnerUp > 0.4
    ) {
      setExpression("😲 Surprised");
    } else {
      setExpression("😐 Neutral");
    }
  };

  const handleDetect = () => {
    const blendshapes = detectFace({
      videoRef,
      faceLandmarkerRef,
    });

    console.log("Blendshapes:", blendshapes);

    detectExpression(blendshapes);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
      }}
    >
      <h1>Face Expression Detection</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="640"
        height="480"
        style={{
          border: "2px solid #333",
          borderRadius: "10px",
        }}
      />

      <button
        onClick={handleDetect}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
        }}
      >
        Detect Expression
      </button>

      <h2>{expression}</h2>
    </div>
  );
};

export default FaceExpression;
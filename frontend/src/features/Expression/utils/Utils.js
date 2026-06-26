import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export const initialize = async ({
  videoRef,
  faceLandmarkerRef,
  streamRef,
}) => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const faceLandmarker =
      await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "VIDEO",
        outputFaceBlendshapes: true,
        numFaces: 1,
      });

    faceLandmarkerRef.current = faceLandmarker;

    streamRef.current =
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

    videoRef.current.srcObject = streamRef.current;

    await videoRef.current.play();

    console.log("✅ Camera Ready");
  } catch (error) {
    console.error("Initialization Error:", error);
  }
};

export const detectFace = ({
  videoRef,
  faceLandmarkerRef,
}) => {
  if (
    !videoRef.current ||
    !faceLandmarkerRef.current
  ) {
    return null;
  }

  const results =
    faceLandmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now()
    );

  if (
    results.faceBlendshapes &&
    results.faceBlendshapes.length > 0
  ) {
    return results.faceBlendshapes[0].categories;
  }

  return null;
};
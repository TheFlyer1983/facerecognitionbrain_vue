export const calculateFaceLocations = (data: Face[]): FaceLocation[] => {
  return data.map((face, index) => {
    const faceBox = face.face_rectangle;
    return {
      left: faceBox.left,
      top: faceBox.top,
      height: faceBox.height,
      width: faceBox.width
    };
  });
};

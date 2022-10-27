import { Box } from '@/store/image/imageTypes';
import { FaceLocation } from '@/types';

export const calculateFaceLocations = (
  data: Array<Box>
): Array<FaceLocation> => {
  const image = document.getElementById('inputImage') as HTMLImageElement;
  const width = image.width;
  const height = image.height;

  return data.map((face) => {
    const clarifaiFace = face.region_info.bounding_box;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  });
};

export const createFaceRecognitionPayload = (imageUrl: string) => ({
  user_app_id: {
    user_id: 'clarifai',
    app_id: 'main'
  },
  inputs: [
    {
      data: {
        image: {
          url: imageUrl
        }
      }
    }
  ]
});

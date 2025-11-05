export interface ImageState {
  imageUrl: string | null;
  boxes: Face[];
}

export interface ImageResponse {
  request_id: string;
  time_used: number;
  faces: Face[]
  image_id: string;
  face_num: number;
}

export interface Face {
  face_token: string;
  face_rectangle: FaceRectangle;
}

export interface FaceRectangle {
  height: number;
  left: number;
  top: number;
  width: number;
}
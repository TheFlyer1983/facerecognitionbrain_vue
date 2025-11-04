export interface ImageState {
  imageUrl: string | null;
  boxes: Face[];
}

export interface Box {
  id: string;
  region_info: Region;
  data: Data;
  value: number;
}

export interface Region {
  bounding_box: BoundingBox;
}

export interface BoundingBox {
  top_row: number;
  left_col: number;
  bottom_row: number;
  right_col: number;
}

export interface Data {
  concepts: Array<Concept>;
}

export interface Concept {
  id: string;
  name: string;
  value: number;
  app_id: string;
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
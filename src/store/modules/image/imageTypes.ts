export interface ImageState {
  input: string;
  imageUrl: string;
  boxes: Array<Box>;
}

export interface Box {
  id: string;
  region_info: Region;
  data: Array<Concept>;
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

export interface Concept {
  id: string;
  name: string;
  value: number;
  app_id: string;
}

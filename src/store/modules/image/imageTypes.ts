import { RootState } from '@/store/rootTypes';
import { ActionContext } from 'vuex';

export type ImageActionContext = ActionContext<ImageState, RootState>;

export interface ImageState {
  imageUrl: string;
  boxes: Array<Box>;
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

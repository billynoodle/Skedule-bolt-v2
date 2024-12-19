export interface Plan {
  id: string;
  name: string;
  file: File;
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  type: 'box' | 'measurement' | 'text';
  data: any;
  createdAt: Date;
}
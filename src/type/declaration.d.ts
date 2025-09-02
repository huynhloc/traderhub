declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const value: SvgrComponent;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export = value;
}

declare module '*.jpg' {
  const value: string;
  export = value;
}

declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.gif' {
  const value: string;
  export = value;
}

declare module '*.ico' {
  const value: string;
  export = value;
}

declare module '*.webp' {
  const value: string;
  export = value;
}

declare module '*.jp2' {
  const value: string;
  export = value;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare type Nullable<T> = undefined | null | T;

declare module '@ckeditor/ckeditor5-react';
declare module 'ckeditor5-custom-build/build/ckeditor';
declare module 'linkifyjs';
declare module 'linkifyjs/string';
declare module 'linkifyjs/html';
declare module 'randomcolor';
declare module 'shuffle-array';

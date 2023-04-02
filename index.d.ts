declare module '#app' {
  interface PageMeta {
    title?: string
    order?: number
    icon?: string
    affix?: boolean
    hideMenu?: boolean
  }
}

// vue
declare type PropType<T> = VuePropType<T>;
declare type VueNode = VNodeChild | JSX.Element;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};
declare type Indexable<T = any> = {
  [key: string]: T;
};
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
declare type TimeoutHandle = ReturnType<typeof setTimeout>;
declare type IntervalHandle = ReturnType<typeof setInterval>;

// It is always important to ensure you import/export something when augmenting a type
export {}

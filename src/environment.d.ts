declare namespace NodeJS {
  export interface ProcessEnv {
    REPLICATE_API_TOKEN: string;
    MODEL: `${string}/${string}:${string}`;
    MODEL_DEFAULT_OPTIONS: string;
  }
}

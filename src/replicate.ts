import Replicate from 'replicate';

export interface ModelOptions {
  codeformer_fidelity: number;
  background_enhance: boolean;
  face_upsample: boolean;
  upscale: number;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export async function processImage(image: string, options: ModelOptions) {
  const output = await replicate.run(process.env.MODEL, {
    input: {
      image,
      ...options
    }
  });
  return output.toString();
}

// import { image } from './image';

// const REPLICATE_API_TOKEN = 'cc545d07661ee7ab9ed9949346150730ab83c783';

// const model = 'sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56';

// console.info({ image: image.length, model });
// // const image = 'https://bini.cf/photo-1.jpg';

// const output = await replicate.run(model, {
//   input: {
//     image
//   }
// });

// console.info(output);

// const environment = {};

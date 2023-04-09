#!//bin/env node

import { mkdirSync, accessSync, constants } from 'node:fs';
import { program } from 'commander';
import { localFileToBase64, downloadImage, replaceDirectory } from './image';
import { processImage, type ModelOptions } from './replicate';

const MODEL_DEFAULT_OPTIONS: ModelOptions = JSON.parse(process.env.MODEL_DEFAULT_OPTIONS);

program
  .description(
    'Robust face restoration algorithm for old photos / AI-generated faces. https://replicate.com/sczhou/codeformer'
  )
  .argument('<string>', 'Processing of the file or files template (in the case of bash)')
  .requiredOption('-o <path>', 'Output path')
  .option(
    '--codeformer_fidelity [number]',
    `Balance the quality (lower number) and fidelity (higher number). Default value: ${MODEL_DEFAULT_OPTIONS.codeformer_fidelity}`
  )
  .option(
    '--background_enhance [boolean]',
    `Enhance background image with Real-ESRGAN. Default value: ${MODEL_DEFAULT_OPTIONS.background_enhance}`
  )
  .option(
    '--face_upsample [boolean]',
    `Upsample restored faces for high-resolution AI-created images. Default value: ${MODEL_DEFAULT_OPTIONS.face_upsample}`
  )
  .option(
    '--upscale [number]',
    `The final upsampling scale of the image. Default value: ${MODEL_DEFAULT_OPTIONS.upscale}`
  );
program.parse();

const modelOption: ModelOptions = { ...MODEL_DEFAULT_OPTIONS };

if (typeof program.opts().codeformer_fidelity === 'string')
  modelOption.codeformer_fidelity = +program.opts().codeformer_fidelity;

if (typeof program.opts().background_enhance === 'string')
  modelOption.background_enhance = program.opts().background_enhance === 'true';

if (typeof program.opts().face_upsample === 'string')
  modelOption.face_upsample = program.opts().face_upsample === 'true';

if (typeof program.opts().upscale === 'string') modelOption.upscale = +program.opts().upscale;

const outputPath = program.opts().o;

if (!outputPath) {
  console.error('No output path specified');
  process.exit(1);
}

try {
  accessSync(outputPath, constants.O_DIRECTORY & constants.W_OK);
} catch {
  try {
    mkdirSync(outputPath);
  } catch (e) {
    console.error(`Unable to create output path ${outputPath}`);
    process.exit(1);
  }
}

for (const inputPath of program.args) {
  process.stdout.write(`Process file "${inputPath} ... `);
  try {
    const now = Date.now();
    const image = localFileToBase64(inputPath);
    const url = await processImage(image, modelOption);
    const resultPath = await downloadImage(url, replaceDirectory(inputPath, program.opts().o));
    process.stdout.write(`${(Date.now() - now) / 1000} s, save to ${resultPath}\n`);
  } catch (e) {
    console.error(`Error processing file "${inputPath}": ${(e as Error).message}`);
  }
}

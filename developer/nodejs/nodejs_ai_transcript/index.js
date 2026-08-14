import path from 'path'
import { nodewhisper } from 'nodejs-whisper'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// const filePath = path.resolve(__dirname,'audio','japan.m4a')
const filePath = path.resolve(__dirname,'audio','english.m4a')
const modelRootPath = path.resolve(__dirname, 'data','whisper-models')

const models={
  tiny: "tiny",
  tiny_en: "tiny.en",
  base: "base",
  base_en: "base.en",
  small: "small",
  small_en: "small.en",
  medium: "medium",
  medium_en: "medium.en",
  large_v1: "large-v1",
  large: "large",
  large_v3_turbo: "large-v3-turbo"
}

const modelName=models.large_v3_turbo;
await nodewhisper(filePath, {
    modelName,
    autoDownloadModelName: modelName,
    modelRootPath,
    whisperOptions: {
        outputInSrt: true,
        // noGpu:true
    },
})
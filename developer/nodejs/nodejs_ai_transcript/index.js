import path from 'path'
import { nodewhisper } from 'nodejs-whisper'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const filePath = path.resolve(__dirname, 'sound.mp3')
const modelRootPath = path.resolve(__dirname, 'data','whisper-models')

// const filePath = './sound.mp3';
// const modelRootPath = './data/whisper-models';

const modelName='tiny.en';

await nodewhisper(filePath, {
    modelName,
    autoDownloadModelName: modelName,
    modelRootPath,
    whisperOptions: {
        outputInSrt: true,
        noGpu:true
    },
})
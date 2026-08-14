export function arrayToCSV(twoDiArray) {
  return twoDiArray
    .map(row => 
      row
        .map(cell => {
          // Escape inner double quotes by doubling them
          const escaped = String(cell).replace(/"/g, '""');
          // Wrap cell in double quotes to handle commas, newlines, and quotes securely
          return `"${escaped}"`;
        })
        .join(',')
    )
    .join('\n');
}


import * as fs from 'fs/promises';
import * as path from 'path';


export async function writeTextToFile(filePath, content) {
  try {
    // 1. Get the directory path from the file path
    const dirPath = path.dirname(filePath);

    // 2. Create the folders recursively (does nothing if they already exist)
    await fs.mkdir(dirPath, { recursive: true });

    // 3. Overwrites the file if it exists, or creates it if it doesn't
    await fs.writeFile(filePath, content, 'utf8');
    console.log('write success : '+filePath);
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
}

export async function writeJsonToFile(filePath,json){
    return writeTextToFile(filePath,JSON.stringify(json,null,2));
}

export async function writeArrayToCsvFile(filePath,twoDiArray){
    return writeTextToFile(filePath,arrayToCSV(twoDiArray));
}

export async function readFileContent(filePath) {
  try {
    // Specifying 'utf8' forces Node.js to return a string instead of a Buffer
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

export async function readJsonFile(filePath){
    const text = await readFileContent(filePath)
    return JSON.parse(text);
}

export async function getFileList(folderPath) {
    const entries = await fs.readdir(folderPath);
    const files = [];
    
    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry);
      const stats = await fs.stat(fullPath);
      if (stats.isFile()) {
        files.push(entry);
      }
    }
    return files;


  // try {
  //   return await fs.readdir(folderPath);
  // } catch (error) {
  //   console.error("Error reading directory:", error);
  //   return [];
  // }
}

export async function isFileExists(filePath) {
  try {
    // fs.constants.F_OK checks if the file is visible to the current process
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch(e) {
    return false;
  }
}

export async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log('deleted :'+filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}

export async function renameFile(filePath,newFilePath) {
  try {
    // 1. Get the directory path from the file path
    const dirPath = path.dirname(newFilePath);

    // 2. Create the folders recursively (does nothing if they already exist)
    await fs.mkdir(dirPath, { recursive: true });

    await fs.rename(filePath, newFilePath);
    console.log('File renamed successfully!');
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
}



export  function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }




export async function sendHttpRequest(url,method="GET",json={}, retries=1) {
    try{

    const response = await fetch(url, {
        method,
        headers: {
        'Content-Type': 'application/json' // Tells the server to expect JSON
        },
        body: JSON.stringify(json) // Converts your JavaScript object into a JSON string
    });

        return await response.json(); // Parses the JSON response from the server
    }catch(e){
        if(retries<=1){throw e}
        return sendHttpRequest(url,method,json,retries-1);
    }
}

/**
 * Uploads a local file using its path string.
 * @param {string} filePath - Absolute or relative path to the local file.
 * @param {string} url - The backend API upload endpoint URL.
 */
export async function uploadFromFilePath(filePath, url) {
    try {
        // 1. Resolve path and verify the file actually exists
        const absolutePath = path.resolve(filePath);
        if (!isFileExists(absolutePath)) {
            throw new Error(`File not found at path: ${absolutePath}`);
        }

        // 2. Read the file into a Blob object (native in Node.js 18+)
        const fileBuffer = await fs.readFile(absolutePath);
        const fileName = path.basename(absolutePath);
        const fileBlob = new Blob([fileBuffer]);

        // 3. Build the multipart form-data payload
        const formData = new FormData();
        // 'myFile' matches your backend's Multer parameter configuration
        formData.append('file', fileBlob, fileName);

        // 4. Send the POST request
        const response = await fetch(url, {
            method: 'POST',
            body: formData, // Fetch automatically appends the boundary headers
        });

        // const result = await response.json();

        // if (!response.ok) {
        //     throw new Error(result.error || `Upload failed: ${response.status}`);
        // }

        // console.log('Upload complete! Server response:', result);
        // return result;

    } catch (error) {
        console.error('File upload failed:', error.message);
        throw error;
    }
}

function findArrayMemberInsideText(text,array=[]){
  const textClean=text.toLowerCase().trim();
  return !!array.find(member=>textClean.indexOf(member.toLowerCase())!=-1);
}


export function sanitizeFilename(input, replacement = '_') {
  if (typeof input !== 'string') return '';

  return input
    // 1. Remove control characters (0x00-0x1F) and reserved file system characters: < > : " / \ | ? *
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    // 2. Remove leading/trailing dots and spaces to prevent hidden or corrupted files
    .replace(/^\.+|\.+$/g, '')
    .trim()
    // 3. Replace internal spaces and consecutive whitespace with the replacement character
    .replace(/\s+/g, replacement)
    // 4. Truncate to 255 characters (maximum limit for most file systems)
    .slice(0, 255);
}



export async function readJsonsFromFolder(folder){
  const files = await getFileList(folder);
  const jsons=[];
  for (const file of files) {
    const jsonFilePath = `${folder}${file}`
    const json = await readJsonFile(jsonFilePath)
    jsons.push(json);    
  }
  return jsons;
}

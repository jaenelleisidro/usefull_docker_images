import {writeJsonToFile, getFileList, readJsonFile, isFileExists, deleteFile} from "./../utils/utils.js"

export async function step3(simpleBotJob,folder,folderOut){

    const files= await getFileList(folder);
    
    //clean corrupted file
    for (const file of files) {
      const jsonFilePathOut=`${folderOut}${file}`;
      if(await isFileExists(jsonFilePathOut)) {
        try{
          const j=await readJsonFile(jsonFilePathOut);
          if(j.details){continue;}
        }catch(e){}
        await deleteFile(jsonFilePathOut);
      }
    }


    for (let i = 0; i < files.length; i++) {
      console.log((i+1)+"/"+files.length);
      const file = files[i];
      const jsonFilePath=`${folder}${file}`;
      const jsonFilePathOut=`${folderOut}${file}`;

      if(await isFileExists(jsonFilePathOut)) {
          console.log("already exists:"+jsonFilePathOut);continue;
      }
      console.log(jsonFilePath)
      const job = await readJsonFile(jsonFilePath);
      try{
        job.details = await simpleBotJob.getJobDetails(job.url);
        await writeJsonToFile(jsonFilePathOut,job);
      }catch(e){}

    }
}
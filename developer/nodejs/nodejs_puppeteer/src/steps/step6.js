import { deleteFile, readJsonFile, sendHttpRequest, writeArrayToCsvFile, isFileExists, renameFile } from "../utils/utils.js";
import { convertJobsToCsvRow } from "./step5.js";


export async function step6(site, folder6Out,folder2Out, folder4Out, matchSettings, googleSheetId) {
    const lastUpdated = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");

    const csvFilePath=`${folder6Out}new_${lastUpdated}.csv`;
    const newJobIdsJsonPathOut = `${folder2Out}temp/newjobids.json`;
    const newJobIdsJsonPathOutMovePath=`${folder6Out}temp/${lastUpdated}.json`;
    if(!await isFileExists(newJobIdsJsonPathOut)){
        console.log("step 6: newjobids.json is missing")
        return;
    }

    let newJobIds = await readJsonFile(newJobIdsJsonPathOut);

    const jobs = [];
    for (const jobId of newJobIds.job_ids) {
        try{
            const job = await readJsonFile(`${folder4Out}${jobId}.json`);
            jobs.push(job)
        }catch(e){
        }
    }

    if(jobs.length<50){
        console.log(`new jobs is ${jobs.length} which is less than 50 so we are not generating any csv`);
        return;
    }


    const rows = convertJobsToCsvRow(jobs, matchSettings, site);
    await writeArrayToCsvFile(csvFilePath, rows);
    await uploadFromFilePath(csvFilePath,"http://localhost:5678/webhook/jobs/upload")
    // await deleteFile(newJobIdsJsonPathOut);
    await renameFile(newJobIdsJsonPathOut,newJobIdsJsonPathOutMovePath)



    // await sendHttpRequest("http://localhost:5678/webhook/jobs","POST",{googleSheetId,job});
    // await sendHttpRequest("http://localhost:5678/webhook/jobs","POST",job);

}
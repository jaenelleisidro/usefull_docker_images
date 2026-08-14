import { writeJsonToFile, isFileExists, readJsonFile, deleteFile, getFileList } from "./../utils/utils.js"

export async function step1(simpleBotJob,folderOut, workSetups, salaryFloors, qs,site, refetchJobs=false) {
    if(refetchJobs){
        const files=await getFileList(folderOut);
        for (const file of files) {
            await deleteFile(`${folderOut}${file}`);
        }
    }

    //for indeed, salary filter don't work si we skip it
    if(site==="in"){
        for (const workSetup of workSetups) {
            //for indeed there is no onsite filter so we skip it
            if(workSetup==='on-site'){continue;}
            for (const q of qs) {
                const jsonFilePath = `${folderOut}${workSetup}_${q}.json`
                const exists = await isFileExists(jsonFilePath);
                if (exists) { 
                    try{
                        const json=await readJsonFile(jsonFilePath);
                        if(json.jobs.length>0){
                            console.log("skipped:" + jsonFilePath); continue;
                        }
                    }catch(e){}
                }
                let json = await simpleBotJob.getAllJobs(q, workSetup);
                await writeJsonToFile(jsonFilePath, json);
                
            }
        }
        return;
    }



    for (const workSetup of workSetups) {
        for (const q of qs) {
            for (let i3 = 0; i3 < salaryFloors.length; i3++) {
                const salaryFloor = salaryFloors[i3];
                const salaryCeiling = salaryFloors[i3 + 1] || null;

                const jsonFilePath = `${folderOut}${workSetup}_${q}_${salaryFloor || ""}_${salaryCeiling || ""}.json`
                const exists = await isFileExists(jsonFilePath);
                if (exists) { 
                    try{
                        const json=await readJsonFile(jsonFilePath);
                        if(json.jobs.length>0){
                            console.log("skipped:" + jsonFilePath); continue;
                        }
                    }catch(e){}
                }
                let json = await simpleBotJob.getAllJobs(q, workSetup, salaryFloor, salaryCeiling);
                await writeJsonToFile(jsonFilePath, json);
            }
        }
    }
};

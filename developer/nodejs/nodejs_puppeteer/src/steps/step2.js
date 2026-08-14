import { isFileExists, getFileList, readJsonFile, writeJsonToFile } from "./../utils/utils.js"

export async function step2(folder,folderOut) {
    const newJobIdsJsonPathOut = `${folderOut}/temp/newjobids.json`;

  const files = await getFileList(folder);
  for (const file of files) {
    const { salaryFloor, salaryCeiling, q, workSetup, jobs } = await readJsonFile(`${folder}${file}`);

    let jobDetails = jobs.reduce((prev, current) => [...prev, ...current.data],[])

    jobDetails = jobDetails.map(jobDetail => ({ metaData:{ q, workSetup }, estimatedSalaries: [{ max: salaryCeiling, min: salaryFloor }], ...jobDetail }))

    for (const jobDetail of jobDetails) {
      const jobDetailJsonPath = `${folderOut}${jobDetail.id}.json`;
      const jobDetailJsonPathOut = `${folderOut}${jobDetail.id}.json`;
      
      
      const exists = await isFileExists(jobDetailJsonPathOut);

      let newJobIds={job_ids:[]};
      if (!exists) {  
        //resume if there is already existing data
        if(await isFileExists(newJobIdsJsonPathOut)){
          newJobIds=await readJsonFile(newJobIdsJsonPathOut);
        }
        if(!newJobIds.job_ids.includes(jobDetail.id)){
          newJobIds.job_ids.push(jobDetail.id);
        }
        await writeJsonToFile(newJobIdsJsonPathOut, newJobIds);
        await writeJsonToFile(jobDetailJsonPathOut, jobDetail);
        continue;
      }
      
      console.log("exists:" + jobDetailJsonPath);
      const json = await readJsonFile(jobDetailJsonPath);
      
      const estimatedSalary={ min: salaryFloor, max: salaryCeiling }
      const isAlreadyAdded=json.estimatedSalaries.find(e=>e.max===estimatedSalary.max && e.min === estimatedSalary.min)
      if(isAlreadyAdded){"skipping : ",estimatedSalary};

      json.estimatedSalaries.push(estimatedSalary);
      await writeJsonToFile(jobDetailJsonPathOut, json);
    }
  }
}
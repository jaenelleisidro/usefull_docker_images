import { writeArrayToCsvFile, getFileList, readJsonFile, uploadFromFilePath, readJsonsFromFolder } from "./../utils/utils.js";

const lastUpdated = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");


function convertJobToCsvRow(job,site) {
  const { simpleSalary, matches, details, url, jobTitle, jobCompany, jobAdvertiser, metaData } = job
  const salaryRange = `${simpleSalary.currency} ${simpleSalary.min}-${simpleSalary.max} per ${simpleSalary.per}`;
  const matchesRow=convertMatchesToCsvRow(job.matches);

  return [site+"-"+job.id, lastUpdated, url, details?.applyUrl, simpleSalary.max, metaData.workSetup, jobTitle, details?.jobAdDetails, jobCompany || jobAdvertiser, salaryRange, simpleSalary.isEstimated,...matchesRow];
}


function convertMatchSettingsToCsvHeader(matchSettings){
  const header = [];  
 for (const key in matchSettings) {
    header.push(key)
  }
  return header;
 }
function convertMatchesToCsvRow(matches) {
  const row = [];
  for (const key in matches) {
    row.push(matches[key]);
  }
  return row;
}

export function convertJobsToCsvRow(jobs,matchSettings,site){
  const matchHeader=convertMatchSettingsToCsvHeader(matchSettings);
  const header = ["id", "last updated", "url", "apply url", "salary", "setup", "title", "description", "company", "salary range","is estimated",...matchHeader];
  const rows = [header];
  for (const job of jobs) {
    job.dateSent = lastUpdated;
    const row = convertJobToCsvRow(job,site);
    rows.push(row)
  }
  return rows;
}

export async function step5(folder,csvFilePath, matchSettings,site){
  const jobs=await readJsonsFromFolder(folder);
  const rows=convertJobsToCsvRow(jobs,matchSettings,site);
  await writeArrayToCsvFile(csvFilePath, rows);
  //  await sendHttpRequest("http://localhost:5678/webhook/jobs/create-backup","POST");
  uploadFromFilePath(csvFilePath,"http://localhost:5678/webhook/jobs/upload")
  
  // const folder=await sendHttpRequest("http://localhost:5678/webhook/jobs/create_folder","PUT",{
  //   name:"n8n folder create test"
  // });
  // console.log(folder.id);

  
  //Doneverse requires id without getting hired yet
}
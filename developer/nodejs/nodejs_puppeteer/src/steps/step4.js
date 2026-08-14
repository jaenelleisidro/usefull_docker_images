import { writeJsonToFile, getFileList, readJsonFile } from "./../utils/utils.js"

function generateEstimatedSalary(job) {
  const { estimatedSalaries } = job;
  let min = null;
  let max = null;
  if (estimatedSalaries.length == 0) { return; }
  if (estimatedSalaries.length == 1) {
    min = estimatedSalaries[0].min; max = estimatedSalaries[0].max;
  } else {
    //find the lowest max and the highest min
    // const highestMin=estimatedSalaries.reduce((prev,current)=>prev > current.min ? prev : current.min,estimatedSalaries[0].min);
    // const lowestMax=estimatedSalaries.reduce((prev,current)=>prev < current.max ? prev : current.max,estimatedSalaries[0].max);
    // min=lowestMax;
    // max=highestMin;
    min = estimatedSalaries.reduce((prev, current) => prev < current.min ? prev : current.min, estimatedSalaries[0].min);
    max = estimatedSalaries.reduce((prev, current) => prev > current.max ? prev : current.max, estimatedSalaries[0].max);
  }
  job.estimatedSalary = { min, max }
  return job;
}

function generateSalaryDetail(job) {
  let salary = job?.details?.salary;
  if (!salary) return job;
  salary = salary.trim().toUpperCase()
  try {
    job.details.currency = salary.indexOf('SGD') > -1 ? 'SGD' : salary.indexOf('$') > -1 ? '$' : salary.indexOf('₱') > -1 ? '₱' : salary.indexOf('PHP') > -1 ? '₱' : salary.indexOf('AUD') > -1 ? 'AUD' : '₱'
  } catch (e) { }

  salary = salary.replaceAll('₱', '').replaceAll('PHP', '').replaceAll('$', '').replaceAll("SGD").replaceAll(",", "").replaceAll(".000", "000").replaceAll("K", "000")
  const rangeSeperator = salary.indexOf("–") > -1 ? "–" : "-";

  const cleanSalaryParts = salary.split(rangeSeperator)
  try {
    job.details.salaryMin = parseInt(cleanSalaryParts[0].trim());
  } catch (e) { }
  try {
    if (cleanSalaryParts.length > 1) {
      job.details.salaryMax = parseInt(cleanSalaryParts[1].trim());
    } else if (job.details.salaryMin) {
      job.details.salaryMax = job.details.salaryMin;
    }
  } catch (e) { }

  try {
    const index = cleanSalaryParts.length > 1 ? 1 : 0;
    job.details.per = cleanSalaryParts[index].split("per")[1].trim().split(" ")[0];
  } catch (e) { }
  return job;
}

function generateSimpleSalary(job){
    let min = null;
    let max = null;
    let currency = null;
    let per = null;
    let isEstimated = false;

    if (job?.details?.salary) {
      min = job.details.salaryMin
      max = job.details.salaryMax
      if (job.details.currency === '₱') {
        currency = "PHP"
      } else if (job.details.currency === '$') {
        currency = "PHP";
        min = min * 60;
        max = max * 60;
      } else if (job.details.currency === 'AUD') {
        currency = "PHP";
        min = min * 43;
        max = max * 43;
      } else if (job.details.currency === 'SGD') {
        currency = "PHP";
        min = min * 47;
        max = max * 47;
      }
      per = job.details.per
      if (per === "hour") {
        min = min * 8 * 22;
        max = max * 8 * 22;
        per = "month";
      } else if (per === "year") {
        min = Math.round(min / 12);
        max = Math.round(max / 12);
        per = "month";
      }
    }
    
    //if it still failed fetching the salary let's fall back on the estimated ones
    if(!min && !max){
      isEstimated = true;
      min = job.estimatedSalary.min
      max = job.estimatedSalary.max
      currency = "PHP"
      per = "month"
    }
    max = max || min;

    if (max > 2000000 || min > 2000000) {
      max = null;
      min = null;
      per = "?";
    }
    job.simpleSalary = { min, max, currency, per, isEstimated };
    return job;
}

function generateMatches(job, matchSettings) {
  const { jobTitle, details} = job;
  const { jobAdDetails} = details;
  const searchString = `${jobTitle}\n${jobAdDetails}`.trim().toLowerCase()

  const matches = {}
  for (const key in matchSettings) {
    matches[key] = !!matchSettings[key].find(item => searchString.indexOf(item.toLowerCase().trim()) !== -1) || searchString.indexOf(key.toLowerCase().trim()) !== -1;
  }
  job.matches=matches;
  return job;
}

export async function step4(folder,folderOut,matchSettings){

  const files = await getFileList(folder);
  for (const file of files) {
    const jsonFilePath = `${folder}${file}`
    const jsonFilePathOut = `${folderOut}${file}`

    let job = await readJsonFile(jsonFilePath);
    job = generateEstimatedSalary(job);
    job = generateSalaryDetail(job);
    job = generateSimpleSalary(job);

    //some jobs have no dtails, we skip it for now
    if(job.details){
      job = generateMatches(job,matchSettings);
    }

    await writeJsonToFile(jsonFilePathOut, job);
  }
}

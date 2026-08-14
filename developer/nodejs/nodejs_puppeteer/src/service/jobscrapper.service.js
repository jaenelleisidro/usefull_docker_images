import moment from 'moment';
import { sanitizeFilename } from "./../utils/utils.js"
import { step1 } from "./../steps/step1.js";
import { step2 } from "./../steps/step2.js";
import { step3 } from "./../steps/step3.js";
import { step4 } from "./../steps/step4.js";
import { step5 } from "./../steps/step5.js";
import { step6 } from '../steps/step6.js';

export async function startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site, refetchJobs=false,steps=[1,2,3,4,5,6],googleSheetId) {

    //this will make things resumable up to 10 days
    const formattedDate = moment("2026-08-01").format('YYYY-MM-DD').substring(0, 9) + "X";
    const qString = sanitizeFilename(qs.join("-"));
    console.log("starting : " + qString);

    // const taskId = sanitizeFilename(qString + "_" + workSetups.join("-") + "_" + salaryFloors.join("-")).toLowerCase();
    const workFolder = `./data/jobs/${site}_${formattedDate}/${qString}/`;
    console.log("workFolder:" + workFolder)

    const folderOut = `${workFolder}1/`;
    if(steps.includes(1)){
        console.log("start1");
        await step1(simpleBotJob,folderOut, workSetups, salaryFloors, qs,site,refetchJobs);
    }

    const folder2 = folderOut;
    const folder2Out = `${workFolder}2/`;
    if(steps.includes(2)){
        console.log("start2");
        await step2(folder2, folder2Out);
    }

    const folder3 = folder2Out;
    const folder3Out = `${workFolder}3/`;
    if(steps.includes(3)){
        console.log("start3");
        await step3(simpleBotJob,folder3, folder3Out);
    }

    const folder4 = folder3Out;
    const folder4Out = `${workFolder}4/`;
    if(steps.includes(4)){
        console.log("start4");
        await step4(folder4, folder4Out, matchSettings);
    }

    const folder5 = folder4Out;
    const csvFilePath = `${workFolder}5/${site}_${formattedDate}_${qString}.csv`;
    if(steps.includes(5)){
        console.log("start5");
        await step5(folder5, csvFilePath, matchSettings, site);
        console.log("ended : " + qString);
    }


    const folder6Out = `${workFolder}6/`;
    if(steps.includes(6)){
        console.log("start6");
        step6(site,folder6Out,folder2Out,folder4Out,matchSettings,googleSheetId);
    }
}
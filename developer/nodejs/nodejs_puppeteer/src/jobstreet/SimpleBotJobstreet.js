import { simpleBot } from "./../utils/SimpleBot.js";

class SimpleBotJobstreet {
    simpleBot = null;
    constructor(simpleBot) {
        this.simpleBot = simpleBot;
    }

    async init() {
        await this.simpleBot.init()
    }
    async getAllJobs(q = "javascript", workSetup = "remote", salaryFloor = 120000, salaryCeiling = null, daterange = 31) {
        //workSetup="remote";//on-site,hybrid

        const salaryRange=`${salaryFloor}-${salaryCeiling || ''}`;
        // const url = `https://ph.jobstreet.com/${q}-jobs/${workSetup}?daterange=${daterange || null}&salaryrange=${salaryRange}&salarytype=monthly`;
        const url = `https://ph.jobstreet.com/${q}-jobs/${workSetup}?salaryrange=${salaryRange}&salarytype=monthly`;

        let jobListUrl = new URL(url);
        jobListUrl.searchParams.set("salaryrange", salaryRange)

        const jobs = [];
        while (true) {
            const url = jobListUrl.toString()
            let data = [];
            try {
                data = await simpleBotJobstreet.getJobs(url)
            } catch (e) {
                break;
            }

            let pageParams = parseInt(jobListUrl.searchParams.get("page") || "1");
            jobs.push({
                url,
                page: pageParams,
                data,
                createdAt: new Date()
            })


            pageParams = pageParams + 1;

            // if (pageParams > 100) break;
            jobListUrl.searchParams.set("page", pageParams);
        }
        return { url, salaryRange, salaryFloor, salaryCeiling, q, workSetup, count: jobs.length, jobs };
    }

    async getJobs(url) {
        //get jobs per page
        // url="https://ph.jobstreet.com/javascript-jobs/remote?salaryrange=120000-&salarytype=monthly&jobId=93358544&type=standard";
        await this.simpleBot.goto(url, "[data-search-sol-meta]")

        const jobsE = await simpleBot.querySelectorAll("[data-search-sol-meta]");
        const jobs = await Promise.all(jobsE.map(async jobE => {
            const url = await jobE.$eval("a[data-automation]", e => e.href)
            const id = new URL(url).pathname.split("/")[2]

            let jobCompany = null;
            try {
                jobCompany = await jobE.$eval("[data-automation=jobCompany]", e => e.textContent)
            } catch (e) { }

            let jobAdvertiser = null;
            try {
                jobAdvertiser = await jobE.$eval("[data-automation=jobAdvertiser]", e => e.textContent);
                if(jobAdvertiser.trim()==='Private Advertiser'){jobAdvertiser='';}
            } catch (e) { }

            let jobTitle = null;
            try {
                jobTitle = await jobE.$eval("[data-automation=jobTitle]", e => e.textContent)
            } catch (e) { }

            // let topApplicantBadge = null;
            // try {
            //     topApplicantBadge = await jobE.$eval("[data-automation=topApplicantBadge]", e => e.textContent)
            // } catch (e) { }


            // return { id, url, jobAdvertiser, jobCompany, jobTitle, topApplicantBadge, details: null }
            return { id, url, jobAdvertiser, jobCompany, jobTitle,  details: null }
        }));

        // for (let i = 0; i < jobs.length; i++) {
        //     const job = jobs[i];
        //     try {
        //         job.details = await this.getJobDetails(job.url);
        //     } catch (e) { }
        // }

        return jobs;
    }

    async getJobDetails(url) {
        // url="https://ph.jobstreet.com/job/93063865?type=standard&ref=search-standalone#sol=234c1be9a8806863a906027ba68ec5d9749bc778"
        const page = await simpleBot.goto(url, "[data-automation=jobAdDetails]")
        let jobAdDetails = null;
        try {
            jobAdDetails = (await page.$eval("[data-automation=jobAdDetails]", e => e.textContent)).trim().replaceAll("\n\n","\n").replaceAll("\n\n","\n").replaceAll("\n\n","\n");
        } catch (e) { }
        let salary = null;
        try {
            salary = await page.$eval("[data-automation=job-detail-salary]", e => e.textContent);

        } catch (e) { }
        let salaryMin = null;
        let salaryMax = null;
        let currency = null;
        let per = null;
        if(salary){
            const cleanSalaryParts = salary.split("–")
            try {
                // salaryMin = parseInt(cleanSalaryParts[0].trim().substr(1).replaceAll(",", "").replaceAll(".000","000"));
                salaryMin = parseInt(cleanSalaryParts[0].trim().replaceAll('₱','').replaceAll('$','').replaceAll(",", "").replaceAll(".000","000"));
            } catch (e) {}
            try {
                // currency = cleanSalaryParts[0].trim().charAt(0);
                currency=salary.indexOf('$')>-1?'$':salary.indexOf('₱')>-1?'₱':salary.indexOf('AUD')>-1?'AUD':'₱'
            } catch (e) {}
            try {
                //somtimes salary looks like this "salary": "₱50,000 per month", so there is no max salary.
                //thats why we check if there is max salary here, if there's non salaryMin will be the value of salaryMax
                if(cleanSalaryParts.length>1){
                    salaryMax = parseInt(cleanSalaryParts[1].trim().substr(1).replaceAll(",", "").replaceAll(".000","000"));
                }else if(salaryMin){
                    salaryMax=salaryMin;
                }
            } catch (e) {}

            try {
                const index=cleanSalaryParts.length > 1 ? 1: 0;
                per=cleanSalaryParts[index].split("per")[1].trim().split(" ")[0];
            } catch (e) {}
        }


        let applyUrl = null;
        try {
            applyUrl = await page.$eval("[data-automation=job-detail-apply]", e => e.href);
        } catch (e) { }
        return { salary, salaryMin, salaryMax, currency, per, applyUrl, jobAdDetails ,site:"jobstreet"}
    }
}

export const simpleBotJobstreet = new SimpleBotJobstreet(simpleBot)

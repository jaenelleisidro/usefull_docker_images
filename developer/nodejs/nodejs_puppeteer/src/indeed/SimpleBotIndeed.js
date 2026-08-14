import { simpleBot } from "./../utils/SimpleBot.js";

class SimpleBotIndeed {
    simpleBot = null;
    constructor(simpleBot) {
        this.simpleBot = simpleBot;
    }

    async init() {
        await this.simpleBot.init()
    }
    async getAllJobs(q = "javascript", workSetup = "remote", salaryFloor = 120000, salaryCeiling = null, daterange = 31) {
        //workSetup="remote";//on-site,hybrid

        // const salaryRange=`${salaryFloor}-${salaryCeiling || ''}`;
        const url = `https://ph.indeed.com/jobs?q=Nodejs&l=&from=searchOnDesktopSerp&vjk=47e6cb5a45b3c850`;

        let jobListUrl = new URL(url);
            jobListUrl.searchParams.set("q", q);
        if(workSetup==='remote'){
            jobListUrl.searchParams.set("sc", "0kf:attr(DSQF7);");
        }else if(workSetup==='hybrid'){
            jobListUrl.searchParams.set("sc", "0kf:attr(PAXZC);");
        }else{
            throw new Error("workSetup not recognized:"+workSetup)
        }

        jobListUrl.searchParams.set("fromage",daterange);



        const jobs = [];
        while (true) {
            const url = jobListUrl.toString()
            let data = [];
            try {
                data = await this.getJobs(url)
                console.log(url);
            } catch (e) {
                break;
            }

            let pageParams = parseInt(jobListUrl.searchParams.get("start") || "10");
            jobs.push({
                url,
                page: pageParams,
                data,
                createdAt: new Date()
            });


            try{
                //if next button disappeared we reached the end of page
                if(!await simpleBot.querySelector("[data-testid=pagination-page-next]")){
                    break;
                }
            }catch(e){
                break;
            }
            
            pageParams = pageParams + 10;

            jobListUrl.searchParams.set("start", pageParams);
            
        }
        return { url, q, workSetup, count: jobs.length, jobs };
    }

    async getJobs(url) {
        await this.simpleBot.goto(url, "ul li table tbody tr td")
        const jobsE = await simpleBot.querySelectorAll("ul li table tbody tr td");
        const jobs = await Promise.all(jobsE.map(async jobE => {
            const job={};
            job.url = await jobE.$eval("a[href]", e => e.href)
            job.id = new URL(job.url).searchParams.get("jk")

            try {
                job.jobCompany = await jobE.$eval("[data-testid=company-name]", e => e.textContent)
            } catch (e) { }

            try {
                job.setup = await jobE.$eval("[data-testid=text-location]", e => e.textContent)
            } catch (e) { }

            try {
                job.salary = await jobE.$eval('[data-testid="attribute_snippet_testid salary-snippet-container prefmatch_container_testid"]"=', e => e.textContent)
            } catch (e) {}

            // let jobAdvertiser = null;
            // try {
            //     jobAdvertiser = await jobE.$eval("[data-automation=jobAdvertiser]", e => e.textContent);
            //     if(jobAdvertiser.trim()==='Private Advertiser'){jobAdvertiser='';}
            // } catch (e) { }
            

            try {
                job.jobTitle = await jobE.$eval("a[href]", e => e.textContent)
            } catch (e) { }


            const { id, url, jobCompany, jobTitle }=job;

            return { id, url, jobAdvertiser:null, jobCompany, jobTitle,  details: null }
            // return job;
        }));

        return jobs;
    }

    async getJobDetails(url) {
        const page = await simpleBot.goto(url, "[data-testid]")

        let title = null;
        try {
            title = (await page.$eval('[data-testid="jobsearch-JobInfoHeader-title"]', e => e.textContent));
        } catch (e) { }

        let companyName = null;
        try {
            companyName = (await page.$eval('[data-testid="inlineHeader-companyName"]', e => e.textContent));
        } catch (e) { }

        let companyLocation = null;
        try {
            companyLocation = (await page.$eval('[data-testid="inlineHeader-companyLocation"]', e => e.textContent));
            // companyLocation = (await page.$eval('[data-testid="jobsearch-JobInfoHeader-companyLocation"]', e => e.textContent));
            
        } catch (e) { }
        

        let jobAdDetails = null;
        try {
            jobAdDetails = (await page.$eval("#jobDescriptionText", e => e.textContent)).trim().replaceAll("\n\n","\n").replaceAll("\n\n","\n").replaceAll("\n\n","\n");
        } catch (e) { }
        
        let salary = null;
        try {
            salary = (await page.$eval('[data-testid="jobsearch-OtherJobDetailsContainer"]', e => e.textContent));
            // salary = (await page.$eval('[data-testid="vjJobDetails-test"]', e => e.textContent));
            // salary = (await page.$eval('[data-testid="list-item"]', e => e.textContent));
        } catch (e) { }
        return { salary, applyUrl:null, jobAdDetails ,site:"indeed"}
    }
}

export const simpleBotIndeed = new SimpleBotIndeed(simpleBot)

import { simpleBotJobstreet } from './src/jobstreet/SimpleBotJobstreet.js';
import { simpleBotIndeed } from './src/indeed/SimpleBotIndeed.js';
import { startScrapping } from './src/service/jobscrapper.service.js';

const defaultWorkSetups = ["remote", "hybrid", "on-site"];
const defaultSalaryFloors = [0, 10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000]

const fineSalaryFloors = [0,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000]
const refetchJobs=true;

async function runner(simpleBotJob,site) {
    await simpleBotJob.init();


    let workSetups = defaultWorkSetups;
    let salaryFloors = defaultSalaryFloors;

    salaryFloors = fineSalaryFloors
    let qs = [];
    let matchSettings=null;

    // matchSettings = {
    //     esl:[],
    //     ["english tutor"]:[],
    //     ["english teacher"]:[],
    //     teacher:['college instructor'],
    //     ['preschool teacher']:[],
    //     ['primary school teacher']:[],
    //     lpt:['licensed professional teacher'],
    //     tutor: [],
    //     college:[],
    //     highschool:[],
    //     elementary:[],
    //     ['senior high']:[],
    //     deped:[],
    //     sped:[],
    //     esl:[],
    //     usa:[],
    //     poea:[],
        
    // };
    // qs = ["teacher", "tutor","lpt","college instructor","esl","english tutor","english teacher"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site+"_fn");


    
    matchSettings = {
        ['node.js']: ['nodejs', 'node js'],
        ['nest.js']: ['nestjs', 'nest js'],
        ['react.js']: ['reactjs', 'react js', 'react'],
        ['next.js']: ['nextjs', 'next js'],
        redux: [],
        ['react query']: ['reactquery', 'tanstack'],
        tailwind: [],
        antd: [],
        material: [],
        shadcn: [],
        mern:[],
        mean:[],
        expressjs:[],
        ['javascript']: ['js'],
        ['typescript']: ['ts'],
        ['c#']: [],
        ['.net']: [ 'dotnet', '.net'],
        java: ['spring'],
        python: [],
        php: ['laravel'],
        git: [],
        github: [],
        bitbucket: [],
        gitlab: [],
        n8n: [],
        langchain: [],
        rag: [],
        workflow: [],
        ai: [],
        automation: [],
        shopify: [],
        ['unit test']: ['jest', 'mocha', 'ava', 'chai', 'selenium', 'puppeteer', 'cypress', 'cucumberjs', 'cucumber js', 'cucumber-js'],
        aws: ['lambda', 'ecs', 'ec2', 'dynamodb', 'dynamo db', 'sns', 'sqs', 's3', 'rds', 'cloudfront', 'cloud formation', 'ivs', 'opensearch', 'open search', 'route53', 'event bridge', 'fargate', 'cdk'],
        azure: [],
        gcp: [],
        serverless: [],
        terraform: [],
        docker: [],
        redis: [],
        linux: ['ubuntu', 'red hat', 'centos', 'cent os', 'fedora', 'arch'],
        elk: ['elasticsearch', 'logstash', 'kibana', 'opensearch'],
        windows: [],
        macos: [],
    }
    qs = ["nest.js", "nestjs", "node.js", "nodejs", "next.js", "nextjs", "react.js", "reactjs","mern","mean","expressjs", "n8n", "langchain"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site,refetchJobs);

    salaryFloors=fineSalaryFloors;
    await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site+"_fn",true);
    salaryFloors=defaultSalaryFloors;

    // matchSettings = {
    //     ['tech va']: ['technical virtual assistant', 'technical va','it virtual assistant'],
    //     n8n: [],
    //     clickfunnels:[],
    //     gohighlevel:[],
    //     kajabi:[],
    //     zapier:[],
    //     crm:[],
    //     hubspot:[],
        
    //     langchain: [],
    //     rag: [],
    //     workflow: [],
    //     ai: [],
    //     automation: [],
    //     shopify: [],
    //     windows: [],
    //     macos: [],
    //     shopify: [],
    // };
    // qs = ["tech va", "tech virtual assistant", "technical virtual assistant","it virtual assistant","clickfunnels specialist","gohighlevel tech va","kajabi specialist","zapier","hubspot virtual assistant","crm administrator","systems automation specialist"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     va: ['virtual assistant'],
    //     shopify: [],
    //     windows: [],
    //     macos: [],
    //     shopify: [],
    // };
    // qs = ["va", "virtual assistant"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     ['csr']: ['customer support'],
    //     ['tsr']: ['technical support'],
    // };
    // qs = ["csr", "customer support", "call center", "tsr", "technical support"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     ['ordinary seaman']: [],
    //     seaman:[],
    //     seafarer:[],
    //     maritime:[],
    //     shipboard:[],
    //     mariner:[],
    //     vessel:[],
    //     bosun:[],
    //     ["deck cadet"]:[],
    //     oiler:[],
    //     motorman:[],
    //     eto:[],
    //     pumpman:[]
    // };
    // workSetups = ["on-site"];
    // qs = ["seaman","seafarer","maritime","shipboard","mariner","vessel","bosun","deck cadet","oiler","motorman","eto","pumpman"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);
    // workSetups = defaultWorkSetups



    // matchSettings = {
    //     ['medical va']: ['medical virtual assistant'],
    //     nurse:[],
    //     ['registered nurse']:['rn'],
    //     ['medical coder']:[],
    //     ['medical biller']:[],
    //     ['medical va']:['mva','medva','medical virtual assistant'],
    //     ['health va']:['hva','health virtual assistant'],
    //     ['clinical care']:[],
    //     ['medical scribe']:[],
    //     ['patient care']:[],
    //     telehealth:[],
    //     usrn:[],
    //     ukrn:[],
    //     nclex:[],
    // }
    // //phrn
    // qs = ["nurse","rn", "medical coder","usrn","ukrn","nclex","mva","medva","medical va", "medical virtual assistant","hva","health va","health virtual assistant","medical biller","telehealth","clinical care","medical scribe","patient care"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     ['data encoder']:['data entry'],
    //     ['non-voice']:['non voice',"nonvoice"]
    // }
    // qs = ["data encoder","data entry","non-voice","non voice","nonvoice"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     administrative:[],
    //     encoder:[]
    // }
    // qs = ["administrative", "encoder"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // matchSettings = {
    //     accounting:["accountant","bs accountancy"],
    //     bookkeeping:["bookkeeper"],
    //     tax:[],
    //     cpa:[],
    //     ["accounts payable"]:[],
    //     ["internal auditor"]:[],
    //     payroll:[],
    //     "sap finance":[],
    //     quickbooks:[],
    //     xero:[],
    //     netsuite:[],
    //     finance:[],
    //     ['fund analyst']:[]
    // };
    // qs = ["accounting","accountant","bs accountancy", "bookkeeping","bookkeeper","tax","cpa","accounts payable","internal auditor","payroll","sap finance","quickbooks","xero","netsuite","finance","fund analyst"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);


    // //electrician
    // matchSettings = {
    //     electrician:[],
    //     ncii:[],
    //     rme:[],
    //     ['electrical engineer']:[],
    //     lineman:[],
    //     ['solar installer']:['solar specialist'],
    //     technician:[]
    // }
    // qs = ["electrician",'ncii','rme','electrical engineer','lineman','solar installer','solar specialist','technician'];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);


    // salaryFloors = [0,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000]
    // matchSettings = {};
    // qs = ["intouchcx"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);

    // salaryFloors = [0,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000]
    // matchSettings = {};
    // qs = ["asurion"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);


    // salaryFloors = [100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000]
    // matchSettings = {
    //     ["IT project manager"]:["Information Technology Project Manager","IT PM"],
    //     ["delivery lead"]:[],
    //     ["Technical Project Manager"]:[],
    //     ["Technology Project Manager"]:[],
    //     ["Software Project Manager"]:[]
    // };
    // qs = ["IT project manager","Information Technology Project Manager","IT PM", "delivery lead","Technical Project Manager","Technology Project Manager","Software Project Manager"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);
     


    // salaryFloors=defaultSalaryFloors;
    // matchSettings = {
    //     java:[],
    //     spring:[],
    //     shopify:[],
    //     php:[],
    //     laravel:[],
    //     python:[],
    // };
    // qs = ["java", "spring", "shopify", "php", "laravel", "python"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site);


    // salaryFloors=fineSalaryFloors;
    // matchSettings = {
    //     ["live seller"]:[],
    //     ["live streamer"]:["livestream","live stream"]
    // };
    // qs = ["live seller", "live stream","livestream", "live streamer"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site+"_fn");
    // salaryFloors = defaultSalaryFloors;


    // salaryFloors=fineSalaryFloors;
    // matchSettings = {
    //     qa:["quality assurance"],
    //     ["software tester"]:[],
    //     ["manual tester"]:[],
    //     ["user acceptance testing"]:[],
    //     ["black box tester"]:[],
    //     ["automation tester"]:[],
    //     sdet:[],
    //     ["test automation"]:[],
    //     ["api tester"]:[],
    //     ["testing engineer"]:[],
    //     ["game tester"]:["test architect"]
    // };
    // qs = ["qa", "quality assurance","qa tester", "software tester","manual tester","user acceptance testing","black box tester","automation tester","sdet","test automation","api tester","testing engineer","game tester","test architect"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site+"_fn");
    // salaryFloors = defaultSalaryFloors;

    // salaryFloors = [100000, 180000]
    // matchSettings = {
    //     ['node.js']: ['nodejs', 'node js'],
    //     ['nest.js']: ['nestjs', 'nest js'],
    //     ['react.js']: ['reactjs', 'react js', 'react'],
    //     ['next.js']: ['nextjs', 'next js'],
    //     redux: [],
    //     ['react query']: ['reactquery', 'tanstack'],
    //     tailwind: [],
    //     antd: [],
    //     material: [],
    //     shadcn: [],
    //     mern:[],
    //     mean:[],
    //     expressjs:[],
    //     ['javascript']: ['js'],
    //     ['typescript']: ['ts'],
    //     ['c#']: [],
    //     ['.net']: [ 'dotnet', '.net'],
    //     java: ['spring'],
    //     python: [],
    //     php: ['laravel'],
    //     git: [],
    //     github: [],
    //     bitbucket: [],
    //     gitlab: [],
    //     n8n: [],
    //     langchain: [],
    //     rag: [],
    //     workflow: [],
    //     ai: [],
    //     automation: [],
    //     shopify: [],
    //     ['unit test']: ['jest', 'mocha', 'ava', 'chai', 'selenium', 'puppeteer', 'cypress', 'cucumberjs', 'cucumber js', 'cucumber-js'],
    //     aws: ['lambda', 'ecs', 'ec2', 'dynamodb', 'dynamo db', 'sns', 'sqs', 's3', 'rds', 'cloudfront', 'cloud formation', 'ivs', 'opensearch', 'open search', 'route53', 'event bridge', 'fargate', 'cdk'],
    //     azure: [],
    //     gcp: [],
    //     serverless: [],
    //     terraform: [],
    //     docker: [],
    //     redis: [],
    //     linux: ['ubuntu', 'red hat', 'centos', 'cent os', 'fedora', 'arch'],
    //     elk: ['elasticsearch', 'logstash', 'kibana', 'opensearch'],
    //     windows: [],
    //     macos: [],
    // }
    // qs = ["nest.js"];
    // await startScrapping(simpleBotJob,qs, salaryFloors, workSetups, matchSettings, site+"_test");
}
const site = "js";//jobstreet
runner(simpleBotJobstreet,site);

// const site = "in";//jobstreet
// runner(simpleBotIndeed,site);


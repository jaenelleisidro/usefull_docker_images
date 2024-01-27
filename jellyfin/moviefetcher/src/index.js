const axios = require('axios');

fs = require('fs');
util = require('util');
writeFile = util.promisify(fs.writeFile);

async function getMovies({page=1,limit=1,q='2023'}={}){
    const {data}=await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&query_term=${q}&sort_by=seeds&page=${page}&quality=780p`);  
    const { movie_count,limit:movieLimit, page_number, movies=[] }=data.data;
    const parseMovies=[];
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        const {
            // id,
            // url,
            // imdb_code,
            // title,
            title_english,
            // title_long,
            // slug,
            // year,
            // rating,
            // runtime,
            // genres,
            // summary,
            // description_full,
            // synopsis,
            // yt_trailer_code,
            // language,
            // mpa_rating,
            // background_image,
            // background_image_original,
            // small_cover_image,
            // medium_cover_image,
            large_cover_image,
            // state,
            // torrents,
            // date_uploaded,
            // date_uploaded_unix
          }=movie;


        const torrent=movie.torrents[0];
        const {
                  url:torrent_url,
                //   hash,
                //   quality,
                //   type,
                //   is_repack,
                //   video_codec,
                //   bit_depth,
                //   audio_channels,
                  seeds=0,
                //   peers,
                //   size,
                //   size_bytes,
                //   date_uploaded:torrent_date_uploaded,
                //   date_uploaded_unix:date_date_uploaded_unix
                }=torrent;
        if(seeds==0){continue;}
        parseMovies.push({title:title_english,url:torrent_url,cover:large_cover_image})
    }
    return parseMovies;
}

async function getAllMovies({limit=50,q='2023'}={}){
    let page=1;
    let pageMovies=[];
    let allMovies=[];
    do{
        pageMovies=await getMovies({page,limit,q})
        page=page+1;
        allMovies.push(...pageMovies);
        console.log("page #"+page);
        console.log("last movie : "+allMovies.at(-1).title+" count:"+allMovies.length);
    }while(pageMovies.length>0)
    return allMovies;
}


function generateTorrentXML({movies}){

    let items=[];
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        // items.push(`<item>
        //     <title><![CDATA[Beware the Night Nurse (2023) [720p] [WEBRip] [YTS.MX]]]></title>
        //     <description><![CDATA[<a href="https://yts.mx/movies/beware-the-night-nurse-2023"><img src="https://img.yts.mx/assets/images/movies/beware_the_night_nurse_2023/medium-cover.jpg" alt="Beware the Night Nurse (2023)" /></a><br />IMDB Rating: 6.6/10<br />Genre: Thriller<br />Size: 775.94 MB<br />Runtime: 12hr 0 min<br /><br />Zach and Claire have a newborn son called Owen, they hire Vera as the baby's nanny, providing some relief to the new parents - but what led to their surrogate Liz killing herself?]]></description>
        //     <link>https://yts.mx/movies/beware-the-night-nurse-2023</link>
        //     <guid>https://yts.mx/movies/beware-the-night-nurse-2023#720p</guid>
        //     <pubDate>Sat, 29 Jul 2023 01:19:21 +0200</pubDate>
        //     <enclosure url="https://yts.mx/torrent/download/37C1230B2EDC796D9C223ADAEB9A403CE9C1953D" type="application/x-bittorrent" length="10000" />
        // </item>`);
        items.push(`<item>
            <title><![CDATA[${movie.title}]]></title>
            <description><![CDATA[<a href="https://yts.mx/movies/beware-the-night-nurse-2023"><img src="${movie.cover}" alt="Beware the Night Nurse (2023)" /></a><br />IMDB Rating: 6.6/10<br />Genre: Thriller<br />Size: 775.94 MB<br />Runtime: 12hr 0 min<br /><br />Zach and Claire have a newborn son called Owen, they hire Vera as the baby's nanny, providing some relief to the new parents - but what led to their surrogate Liz killing herself?]]></description>
            <link>${movie.url}</link>
            <guid>https://yts.mx/movies/beware-the-night-nurse-2023#720p</guid>
            <pubDate>Sat, 29 Jul 2023 01:19:21 +0200</pubDate>
            <enclosure url="${movie.url}" type="application/x-bittorrent" length="10000" />
        </item>`);
            
    }

    let xml=`<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            <atom:link href="https://yts.mx/rss/2023/720p/all/0/en" rel="self" type="application/rss+xml" />
            <title>Custom Torrent XML RSS</title>
            <description>Most popular Torrents in the smallest file size RSS Feed</description>
            <link>https://yts.mx/</link>
            <language>en-us</language>
            <lastBuildDate>Sat, 29 Jul 2023 02:15:09 +0200</lastBuildDate>
                ${items.join('\n\r')}
        </channel>
    </rss>`;
    
    return xml;
}


module.exports=async function start(){

    for(i=2024;i>=1900;i--){
        const q=''+i;
        const movies=await getAllMovies({q})
        const xml2=await generateTorrentXML({movies});
        await writeFile('torrents_'+q+'.xml', xml2);

        let text='';
        for (let i = 0; i < movies.length; i++) {
            const {url} = movies[i];
            text=text+url+'\n\r';
        }
        await writeFile('torrents_'+q+'.txt', text); 
    }

}


/*
title: '3Q影视', author: '小可乐/v5.12.1'
说明：可以不写ext，用默认值，也可以写ext，ext支持的参数和格式参数如下(所有参数可选填)
"ext": {
    "host": "xxxx", //站点网址
    "timeout": 6000,  //请求超时，单位毫秒
    "catesSet": "剧集&电影&综艺",  //指定分类和顺序
    "tabsSet": "线路2&线路1"  //指定线路和顺序
}
*/
var HOST;
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
const DefHeader = {'User-Agent': MOBILE_UA};
const KParams = {
    headers: {'User-Agent': MOBILE_UA}
};

async function init(cfg) {
    try {
        let host = cfg.ext?.host?.trim() || 'https://qqqys.com';
        HOST = host.replace(/\/$/, '');
        KParams.headers['Referer'] = HOST;
        let parseTimeout = parseInt(cfg.ext?.timeout?.trim(), 10);
        KParams.timeout = parseTimeout > 0 ? parseTimeout : 5000;
        KParams.catesSet = cfg.ext?.catesSet?.trim() || '';
        KParams.tabsSet = cfg.ext?.tabsSet?.trim() || '';
        KParams.resObj = safeParseJSON(await request(`${HOST}/api.php/index/home`));
    } catch (e) {
        console.error('初始化参数失败：', e.message);
    }
}

async function home(filter) {
    try {
        let resObj = KParams.resObj;
        let typeArr = resObj?.data?.categories ?? [];
        let classes = typeArr.map(item => { return {type_name: item?.type_name ?? '分类名', type_id: item?.type_name ?? '分类值'}; });
        if (KParams.catesSet) { classes = ctSet(classes, KParams.catesSet); }
        let filters = {
            "电影":[
                {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"动作","v":"动作"},{"n":"喜剧","v":"喜剧"},{"n":"爱情","v":"爱情"},{"n":"科幻","v":"科幻"},{"n":"恐怖","v":"恐怖"},{"n":"悬疑","v":"悬疑"},{"n":"犯罪","v":"犯罪"},{"n":"战争","v":"战争"},{"n":"动画","v":"动画"},{"n":"冒险","v":"冒险"},{"n":"历史","v":"历史"},{"n":"灾难","v":"灾难"},{"n":"纪录","v":"纪录"},{"n":"剧情","v":"剧情"}]},
                {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"泰国","v":"泰国"},{"n":"印度","v":"印度"},{"n":"英国","v":"英国"},{"n":"法国","v":"法国"},{"n":"德国","v":"德国"},{"n":"加拿大","v":"加拿大"},{"n":"西班牙","v":"西班牙"},{"n":"意大利","v":"意大利"},{"n":"澳大利亚","v":"澳大利亚"}]},
                {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015-2011","v":"2015-2011"},{"n":"2010-2000","v":"2010-2000"},{"n":"90年代","v":"90年代"},{"n":"80年代","v":"80年代"},{"n":"更早","v":"更早"}]},
                {"key":"by","name":"排序","value":[{"n":"人气","v":""},{"n":"最新","v":"time"},{"n":"评分","v":"score"},{"n":"年份","v":"year"}]}
            ],
            "剧集":[
                {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"爱情","v":"爱情"},{"n":"古装","v":"古装"},{"n":"武侠","v":"武侠"},{"n":"历史","v":"历史"},{"n":"家庭","v":"家庭"},{"n":"喜剧","v":"喜剧"},{"n":"悬疑","v":"悬疑"},{"n":"犯罪","v":"犯罪"},{"n":"战争","v":"战争"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"恐怖","v":"恐怖"}]},
                {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"},{"n":"泰国","v":"泰国"},{"n":"英国","v":"英国"}]},
                {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020-2016","v":"2020-2016"},{"n":"2015-2011","v":"2015-2011"},{"n":"2010-2000","v":"2010-2000"},{"n":"更早","v":"更早"}]},
                {"key":"by","name":"排序","value":[{"n":"人气","v":""},{"n":"最新","v":"time"},{"n":"评分","v":"score"},{"n":"年份","v":"year"}]}
            ],
            "动漫":[
                {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"冒险","v":"冒险"},{"n":"奇幻","v":"奇幻"},{"n":"科幻","v":"科幻"},{"n":"武侠","v":"武侠"},{"n":"悬疑","v":"悬疑"}]},
                {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"日本","v":"日本"},{"n":"欧美","v":"欧美"}]},
                {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"更早","v":"更早"}]},
                {"key":"by","name":"排序","value":[{"n":"人气","v":""},{"n":"最新","v":"time"},{"n":"评分","v":"score"},{"n":"年份","v":"year"}]}
            ],
            "综艺":[
                {"key":"class","name":"剧情","value":[{"n":"全部","v":""},{"n":"真人秀","v":"真人秀"},{"n":"音乐","v":"音乐"},{"n":"脱口秀","v":"脱口秀"},{"n":"歌舞","v":"歌舞"},{"n":"爱情","v":"爱情"}]},
                {"key":"area","name":"地区","value":[{"n":"全部","v":""},{"n":"大陆","v":"大陆"},{"n":"香港","v":"香港"},{"n":"台湾","v":"台湾"},{"n":"美国","v":"美国"},{"n":"日本","v":"日本"},{"n":"韩国","v":"韩国"}]},
                {"key":"year","name":"年份","value":[{"n":"全部","v":""},{"n":"2025","v":"2025"},{"n":"2024","v":"2024"},{"n":"2023","v":"2023"},{"n":"2022","v":"2022"},{"n":"2021","v":"2021"},{"n":"2020","v":"2020"},{"n":"2019","v":"2019"},{"n":"2018","v":"2018"},{"n":"2017","v":"2017"},{"n":"2016","v":"2016"},{"n":"2015","v":"2015"},{"n":"2014","v":"2014"},{"n":"2013","v":"2013"},{"n":"2012","v":"2012"},{"n":"2011","v":"2011"},{"n":"更早","v":"更早"}]},
                {"key":"by","name":"排序","value":[{"n":"人气","v":""},{"n":"最新","v":"time"},{"n":"评分","v":"score"},{"n":"年份","v":"year"}]}
            ]
        };
        return JSON.stringify({class: classes, filters: filters});
    } catch (e) {
        console.error('获取分类失败：', e.message);
        return JSON.stringify({class: [], filters: {}});
    }
}

async function homeVod() {
    try {
        let resObj = KParams.resObj;
        let homeArr = resObj?.data?.recommend ?? [];
        (resObj?.data?.categories || []).forEach(it => { if (Array.isArray(it.videos) && it.videos.length) {homeArr.push(...it.videos);} });
        let VODS = getVodList(homeArr);
        return JSON.stringify({list: VODS});
    } catch (e) {
        console.error('推荐页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function category(tid, pg, filter, extend) {
    try {
        pg = parseInt(pg, 10);
        pg = pg > 0 ? pg : 1;
        let cateUrl = `${HOST}/api.php/filter/vod?type_name=${extend?.cateId || tid}&class=${extend?.class ?? ''}&area=${extend?.area ?? ''}&year=${extend?.year ?? ''}&sort=${extend?.by ?? ''}&page=${pg}&limit=30`;        
        let resObj = safeParseJSON(await request(cateUrl));
        let cateArr = resObj?.data ?? [];
        let VODS = getVodList(cateArr);
        let {pageCount=999, limit=30, total=29970} = resObj ?? {};
        return JSON.stringify({list: VODS, page: pg, pagecount: pageCount, limit: limit, total: total});
    } catch (e) {
        console.error('类别页获取失败：', e.message);
        return JSON.stringify({list: [], page: 1, pagecount: 0, limit: 30, total: 0});
    }
}

async function search(wd, quick, pg) {
    try {
        pg = parseInt(pg, 10);
        pg = pg > 0 ? pg : 1;
        let searchUrl = `${HOST}/api.php/search/index?wd=${wd}&page=${pg}&limit=30`;
        let resObj = safeParseJSON(await request(searchUrl));
        let searchArr = resObj?.data ?? [];
        let VODS = getVodList(searchArr);
        let {pageCount=999, limit=30, total=29970} = resObj ?? {};
        return JSON.stringify({list: VODS, page: pg, pagecount: pageCount, limit: limit, total: total});
    } catch (e) {
        console.error('搜索页获取失败：', e.message);
        return JSON.stringify({list: [], page: 1, pagecount: 0, limit: 30, total: 0});
    }
}

function getVodList(listArr) {
    try {
        if (!Array.isArray(listArr)) {throw new Error('输入参数非数组');}
        let kvods = [];
        for (let it of listArr) {
            let kname = it.vod_name ?? '名称';
            let kpic = it.vod_pic ?? '图片';
            let kremarks = `${it.vod_remarks || '状态'}|${it.vod_score || '无评分'}|${it.vod_class || '类型'}`;
            let kyear = it.vod_year || '';
            kvods.push({
                vod_name: kname,
                vod_pic: kpic,
                vod_remarks: kremarks,
                vod_year: kyear,
                vod_id: `${it.vod_id}@${kname}@${kpic}@${kremarks}@${kyear}@${it.area || '地区'}`
            });
        }
        return kvods;
    } catch (e) {
        console.error(`生成视频列表失败：`, e.message);
        return [];
    }
}

async function detail(ids) {
    try {
        let [id, kname, kpic, remarks, kyear, karea] = ids.split('@');
        let [kremarks, kscore, ktype] = remarks.split('|');
        const batchPathList = [`/api.php/vod/get_detail?vod_id=${id}`, `/api.php/internal/search_aggregate?vod_id=${id}`]
        const [resObj1, resObj2] = await Promise.all(
            batchPathList.map(async (path) => {
                try {
                    return safeParseJSON(await request(`${HOST}${path}`));
                } catch (sErr) {return null;}
            })
        );
        let [ktabs, kurls, kfroms1, kfroms2] = Array.from({ length: 4 }, () => []);
        let kvod1 = resObj1?.data?.[0] ?? null;
        let kvod2 = Array.isArray(resObj2?.data) ? resObj2.data : null;
        let kdetail = kvod1;
        if (kvod1) {
            kfroms1 = kvod1.vod_play_from ? kvod1.vod_play_from.split('$$$') : [];
            let ud_urlsArr = kvod1.vod_play_url ? kvod1.vod_play_url.split('$$$') : [];
            ud_urlsArr.forEach((it, idx) => {
                let kurl = it.split('#').map(ep => `${ep}@${kfroms1[idx] || 'from'}`);
                kurls.push(kurl.join('#'));
            });
            let ktabsName = resObj1?.vodplayer ?? [];
            kfroms1.forEach(it => {
                let tg = ktabsName.find(item => item.from === it)
                ktabs.push(tg?.show ?? it);
            });       
        }
        if (kvod2) {
            kfroms2 = kvod2.map(it => it.vod_play_from);
            kvod2.forEach((it, idx) => {
                let ud_urlArr = it.vod_play_url ? it.vod_play_url.split('#') : [];
                let kurl = ud_urlArr.map(ep => `${ep}@${kfroms2[idx] || 'from'}`);
                kurls.push(kurl.join('#'));
            });
            kvod2.forEach(it => ktabs.push(it.site_name));
        }
        if (KParams.tabsSet) {
            let ktus = ktabs.map((it, idx) => { return {type_name: it, type_value: kurls[idx]} });
            ktus = ctSet(ktus, KParams.tabsSet);
            ktabs = ktus.map(it => it.type_name);
            kurls = ktus.map(it => it.type_value);
        }
        let VOD = {
            vod_id: kdetail?.vod_id || id,
            vod_name: kdetail?.vod_name || kname,
            vod_pic: kdetail?.vod_pic || kpic,
            type_name: kdetail?.vod_class || ktype,
            vod_remarks: `${kdetail?.vod_remarks || '状态'}|${kscore}`,
            vod_year: kdetail?.vod_year || kyear || '1000',
            vod_area: kdetail?.vod_area || karea,
            vod_lang: kdetail?.vod_lang || '国语',
            vod_director: kdetail?.vod_director || '导演',
            vod_actor: kdetail?.vod_actor || '主演',
            vod_content: kdetail?.vod_content.replace(/<[^>]*?>/g, '')?.trim() || '简介',
            vod_play_from: ktabs.join('$$$'),
            vod_play_url: kurls.join('$$$')
        };
        return JSON.stringify({list: [VOD]});
    } catch (e) {
        console.error('详情页获取失败：', e.message);
        return JSON.stringify({list: []});
    }
}

async function play(flag, ids, flags) {
    try {
        let kurl = '', jx = 0, kp = 0, token = '';
        let [id, kfrom] = ids.split('@');
        if (/\.(m3u8|mp4|mkv)/.test(id)) {
            kurl = id;
        } else {
            for (let i = 0; i < 2; i++) {
                try {
                    let playUrl = `${HOST}/api.php/decode/url/?url=${id}&vodFrom=${kfrom}&token=${token}`;
                    let resObj = safeParseJSON(await request(playUrl));
                    if (resObj?.code === 2 && resObj?.hasOwnProperty('challenge')) {token = eval(resObj.challenge);}
                    if (resObj?.code === 1 && resObj?.hasOwnProperty('data')) {
                        kurl = resObj.data;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            if (!/^http/.test(kurl)) {
                jx = 1;
                kp = 1;
                kurl = id;
            } else if (!/m3u8|mp4|mkv/.test(kurl)) {
                kp = 1;
            }
        }
        return JSON.stringify({jx: jx, parse: kp, url: kurl, header: DefHeader});
    } catch (e) {
        console.error('播放失败：', e.message);
        return JSON.stringify({jx: 0, parse: 0, url: '', header: {}});
    }
}

function ctSet(kArr, setStr) {
    if (!Array.isArray(kArr)) { return kArr; }
    try {
        let [set_arr, arrNames] = [[...kArr], setStr.split('&')];
        if (arrNames.length) {
            let filtered_arr = arrNames.map((item) => set_arr.find(it => it.type_name === item)).filter(Boolean);
            set_arr = filtered_arr.length? filtered_arr : [set_arr[0]];
        }
        return set_arr;
    } catch (e) {
        return kArr;
    }
}

function safeParseJSON(jStr) {
    try {
        return JSON.parse(jStr);
    } catch (e) {
        return null;
    }
}

async function request(reqUrl, options = {}) {
    if (typeof reqUrl !== 'string' || !reqUrl.trim()) { throw new Error('reqUrl需为字符串且非空'); }
    if (typeof options !== 'object' || Array.isArray(options) || !options) { throw new Error('options类型需为非null对象'); }
    try {
        options.method = options.method?.toLowerCase() || 'get';
        if (['get', 'head'].includes(options.method)) {
            delete options.data;
            delete options.postType;
        } else {
            options.data = options.data ?? '';
            options.postType = options.postType?.toLowerCase() || 'form';
        }        
        let {headers, timeout, charset, toBase64 = false, ...restOpts } = options;
        const optObj = {
            headers: (typeof headers === 'object' && !Array.isArray(headers) && headers) ? headers : KParams.headers,
            timeout: parseInt(timeout, 10) > 0 ? parseInt(timeout, 10) : KParams.timeout,
            charset: charset?.toLowerCase() || 'utf-8',
            buffer: toBase64 ? 2 : 0,
            ...restOpts
        };
        const res = await req(reqUrl, optObj);
        if (options.withHeaders) {
            const resHeaders = typeof res.headers === 'object' && !Array.isArray(res.headers) && res.headers ? res.headers : {};
            const resWithHeaders = { ...resHeaders, body: res?.content ?? '' };
            return JSON.stringify(resWithHeaders);
        }
        return res?.content ?? '';
    } catch (e) {
        console.error(`${reqUrl}→请求失败：`, e.message);
        return options?.withHeaders ? JSON.stringify({ body: '' }) : '';
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        search: search,
        detail: detail,
        play: play,
        proxy: null
    };
}
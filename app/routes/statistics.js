var express = require('express');
var router = express.Router();
var axios = require('axios');
var FormData = require('form-data');
var json2csv = require('json2csv');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('statistics', { token: req.session._id, result: "Report", code: "", message: "" });
});



router.post('/', function (req, res, next) {

    var data = new FormData();
    var q = "select rowNumberInAllBlocks() rowNum,fp,substr( max(concat(toString(dt),user)), 20) userName,any(email) email,if(email = '',if(userName = 'none','',userName),if(userName = 'none',email,concat(email, ' (send by ', userName, ')'))) lastUser, min(dt) firstVisit, max(dt) lastVisit, any(timezone) timezone, any(ua) ua, any(os_name) osName, any(os_version) osVersion, any(device_model) deviceModel, any(device_type) deviceType, any(device_vendor) deviceVendor, any(cpu_architecture) cpuArchitecture, any(browser_major) browserMajor, any(browser_name) browserName, any(browser_version) browserVersion, any(engine_name) engineName, any(engine_version) engineVersion, countIf(action, action='ENTER') opened, countIf(action, action in ('DOWNLOAD','DOWNLOAD_VIEW')) downloaded, countIf(action, action='PRINT') printed, uniqExact(page, action='OPEN') pagesViewed, countIf(action, action='OPEN') pageViews, sumIf(duration, action='PAGE_VIEW') viewsSeconds from wizeflow.tracks where document_id = '60f109a2583fd70011f95111' AND fp!='' AND user!='anonymous' group by fp WITH TOTALS order by viewsSeconds desc LIMIT 8";
    var a = "select formatDateTime(toDate('2021-07-16')+number, '%d/%m/%Y') as label, toDate('2021-07-16')+number as date, t.timeSpent as data, t.count as count FROM numbers(toUInt64(toDate('2021-10-21')-toDate('2021-07-16'))+1) dates left outer join (SELECT toDate(dt) date, SUM(duration) timeSpent, count() count from wizeflow.tracks where document_id='60f109a2583fd70011f95111' AND action='PAGE_VIEW' AND toDate(dt) >= toDate('2021-07-16') AND toDate(dt) <= toDate('2021-10-21') group by date) t on t.date = date";

    console.log(req.body.sl);

    // var manager = "select rowNumberInAllBlocks() rowNum, fp, substr( max(concat(toString(dt),user)), 20) userName, any(email) email, if( email = '', if(userName = 'none', '', userName),if(userName = 'none', email,concat(email, ' (send by ', userName, ')'))) lastUser, min(dt) firstVisit, max(dt) lastVisit, any(timezone) timezone, any(ua) ua, any(os_name) osName, any(os_version) osVersion, any(device_model) deviceModel, any(device_type) deviceType, any(device_vendor) deviceVendor, any(cpu_architecture) cpuArchitecture, any(browser_major) browserMajor, any(browser_name) browserName, any(browser_version) browserVersion, any(engine_name) engineName, any(engine_version) engineVersion, countIf(action, action='ENTER') opened, countIf(action, action in ('DOWNLOAD','DOWNLOAD_VIEW')) downloaded, countIf(action, action='PRINT') printed, uniqExact(page, action='OPEN') pagesViewed, countIf(action, action='OPEN') pageViews, sumIf(duration, action='PAGE_VIEW') viewsSeconds from wizeflow.tracks  where document_id = '6167f7f3f32f840012e95064' AND fp!='' AND user!='anonymous' group by fp order by viewsSeconds desc";

    var manager = "select rowNumberInAllBlocks() rowNum, fp, substr( max(concat(toString(dt),user)), 20) userName, any(email) email, if( email = '', if(userName = 'none', '', userName),if(userName = 'none', email,concat(email, ' (send by ', userName, ')'))) lastUser, min(dt) firstVisit, max(dt) lastVisit, any(timezone) timezone, any(ua) ua, any(os_name) osName, any(os_version) osVersion, any(device_model) deviceModel, any(device_type) deviceType, any(device_vendor) deviceVendor, any(cpu_architecture) cpuArchitecture, any(browser_major) browserMajor, any(browser_name) browserName, any(browser_version) browserVersion, any(engine_name) engineName, any(engine_version) engineVersion, countIf(action, action='ENTER') opened, countIf(action, action in ('DOWNLOAD','DOWNLOAD_VIEW')) downloaded, countIf(action, action='PRINT') printed, uniqExact(page, action='OPEN') pagesViewed, countIf(action, action='OPEN') pageViews, sumIf(duration, action='PAGE_VIEW') viewsSeconds from wizeflow.tracks  where document_id = '" + req.body.sl + "' AND fp!='' AND user!='anonymous' group by fp order by viewsSeconds desc";


    console.log(manager);
    data.append('query', manager);

    const config = {
        method: 'post',
        url: 'https://iseto-api.wizeflow.io/stats/query',
        headers: {
            ...data.getHeaders(),
            Authorization: req.session._id

        },
        data: data
    };
    axios(config)
        .then(function (response) {
            const data = JSON.stringify(response.data.data);
            req.session.report = response.data.data;
            res.render('statistics', { token: req.session._id, result: data, code: "200", message: "{status:success, sl:" + req.body.sl + ", from:" + req.body.from + ", to:" + req.body.to + " }" });
        })
        .catch(function (error) {
            console.log(error);
            res.render('statistics', { token: req.session._id, result: "", code: "900", message: error });
        });

});

router.post('/download', function (req, res, next) {

    // const csv = json2csv.parse(req.session.report, ['label', 'date', 'data', 'count']);
    const csv = json2csv.parse(req.session.report, ["rowNum", "fp", "userName", "email", "lastUser", "firstVisit", "lastVisit", "timezone", "ua", "osName", "osVersion", "deviceModel", "deviceType", "deviceVendor", "cpuArchitecture", "browserMajor", "browserName", "browserVersion", "engineName", "engineVersion", "opened", "downloaded", "printed", "pagesViewed", "pageViews", "viewsSeconds"]);
    res.setHeader('Content-disposition', 'attachment; filename=' + "today" + '.csv');
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');

    res.send(csv);
});

module.exports = router;

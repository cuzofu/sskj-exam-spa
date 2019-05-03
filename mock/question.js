import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];

function getQuestion(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  // 课题名称
  if (params.topic) {
    dataSource = dataSource.filter(data => data.topic.indexOf(params.topic) > -1);
  }

  // 题型
  if (params.qtype) {
    dataSource = dataSource.filter(data => data.qtype === params.qtype);
  }

  // 选项类型
  if (params.otype) {
    dataSource = dataSource.filter(data => data.otype === params.otype);
  }

  // 题目
  if (params.subject) {
    dataSource = dataSource.filter(data => data.subject.indexOf(params.subject) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postQuestion(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, topicKey, topic, version, qtype, otype, subject, score, options } = body;

  console.log(body);
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => item.key === key);
      break;
    case 'post':
      const i = tableListDataSource.length + 1;
      tableListDataSource.unshift({
        key: i,
        topicKey, // 课题key
        topic, // 课题名称
        version, // 版本号
        qtype, // 题目类型
        otype, // 选项类型
        subject, // 题目
        score, // 分值
        options, // 选项
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { key, topicKey, topic, version, qtype, otype, subject, score, options });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getQuestion(req, res, u);
}

export default {
  'GET /api/question': getQuestion,
  'POST /api/question': postQuestion,
};

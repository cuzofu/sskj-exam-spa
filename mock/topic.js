import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];

function getTopic(req, res, u) {
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

  // 大类
  if (params.category) {
    dataSource = dataSource.filter(data => data.category === params.category);
  }

  // 小类
  if (params.subcategory) {
    dataSource = dataSource.filter(data => data.subcategory === params.subcategory);
  }

  // 课件类型
  if (params.type) {
    dataSource = dataSource.filter(data => data.type === params.type);
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

function postTopic(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, topic, version, category, subcategory, type, description, file } = body;

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
        topic,
        version,
        category,
        subcategory,
        type,
        description,
        file,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { topic, version, category, subcategory, type, description, file });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getTopic(req, res, u);
}

export default {
  'GET /api/topic': getTopic,
  'POST /api/topic': postTopic,
};

import { stringify } from 'qs';
import { getToken } from '../utils/authority';
import request from '../utils/request';

export async function getLaborGenderRateData() {
  return request('/labor/person/sex/count', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getLaborActivityPercentData(params) {
  return request(`/labor/laborAttendance/activity/count/date/${params.from}/${params.to}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function queryTopic(params) {
  return request(`/api/topic?${stringify(params)}`);
}

export async function removeTopic(params) {
  return request('/api/topic', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addTopic(params) {
  return request('/api/topic', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateTopic(params = {}) {
  return request(`/api/topic?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

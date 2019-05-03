import { stringify } from 'qs';
import { getToken } from '../utils/authority';
import request from '../utils/request';

export async function queryQuestion(params) {
  return request(`/api/question?${stringify(params)}`);
}

export async function removeQuestion(params) {
  return request('/api/question', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addQuestion(params) {
  return request('/api/question', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateQuestion(params = {}) {
  return request(`/api/question?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

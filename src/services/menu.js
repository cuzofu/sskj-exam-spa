import { getToken } from '../utils/authority';
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMenu(params) {
  return request(`/admin/menu/allTree?${stringify(params)}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getMenu(params) {
  return request('/admin/menu/' + params, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

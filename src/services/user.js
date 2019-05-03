import request from '../utils/request';
import { getToken } from '../utils/authority';
import { stringify } from 'qs';

export function getUserInfo() {
  return request('/admin/user/info', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function getAuthMenus() {
  return request('/admin/menu/userMenu', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

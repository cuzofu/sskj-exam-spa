import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function getRoles(params) {
  // return request(`/api/admin/roles?${stringify(params)}`);
  return request(`/admin/role/rolePage?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getAllMenuTree() {
  return request('/admin/menu/allTree/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getRoleMenuTree(params) {
  return request(`/admin/menu/findMenuByRole/${params.roleCode}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

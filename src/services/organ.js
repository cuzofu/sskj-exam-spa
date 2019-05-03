import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function getOrganById(params) {
  return request(`/admin/organ/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getOrganByOrganId(params) {
  return request(`/admin/organ/findbyid?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getOrganByName(params) {
  return request(`/admin/organ/findbyname?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

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

//c3Nrajpzc2tq  代表 sskj:sskj
export function accountLogin(params) {
  return request(`/auth/oauth/token?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

export function logout(params) {
  return request(`/auth/authentication/removeToken?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function sendVcode(phone) {
  return request(`/admin/smsCode/login/${phone}`, {
    method: 'GET',
  });
}

export function mobileLogin(params) {
  return request(`/auth/mobile/token?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

// 创建二维码
export function getCreate(params) {
  return request(`/admin/sweep/qrcode/?${stringify(params)}`, {
    method: 'POST',
  });
}

// 120秒循环调用 页面轮询
export function getQrcode(params) {
  return request(`/admin/sweep/qrcode/?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

// 保存
export function getSave(params) {
  return request(`/admin/sweep/qrcode/save?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

// 删除redisTemplate的key
export function getDelete(params) {
  return request(`/admin/sweep/qrcode/?${stringify(params)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

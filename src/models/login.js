import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { setToken, removeToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {
  getUserInfo,
  accountLogin,
  logout,
  sendVcode,
  mobileLogin,
  getCreate,
  getQrcode,
  getSave,
  getDelete,
} from '../services/login';
import { getAuthMenus } from '../services/user';

import { setStore, getStore, setAuthority } from '../utils/store';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    list: [],
    currentUser:
      getStore({
        name: 'userInfo',
      }) || {},
    eng:
      getStore({
        name: 'eng',
      }) || {},
    permissions:
      getStore({
        name: 'permissions',
      }) || {},
    roles:
      getStore({
        name: 'roles',
      }) || [],
    access_token:
      getStore({
        name: 'access_token',
      }) || '',
    refresh_token:
      getStore({
        name: 'refresh_token',
      }) || '',
    menus:
      getStore({
        name: 'menus',
      }) || [],
    // 存储路由数据(全局缓存)
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(
        payload.type === 'account' ? accountLogin : mobileLogin,
        payload.type === 'account'
          ? { ...payload, grant_type: 'password' }
          : {
              ...payload,
              grant_type: 'mobile',
              scope: 'server',
            }
      );
      console.log(response);
      if (response) {
        if (!('error' in response)) {
          response.status = 'ok';
        } else {
          response.status = 'error';
        }

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        if (response.status === 'ok') {
          setToken(response.access_token);
          yield put({
            type: 'setAccessTokenAndRefreshToken',
            payload: response,
          });
          const usesRes = yield call(getUserInfo);

          yield put({
            type: 'saveCurrentUser',
            payload: usesRes.data,
          });

          const menus = yield call(getAuthMenus);

          yield put({
            type: 'saveMenus',
            payload: menus,
          });

          reloadAuthorized();
          if (menus) {
            yield put(routerRedux.push(menus[0].children[0].path));
          } else {
            yield put(routerRedux.push('/dashboard/analysis'));
          }
        } else {
          notification.error({
            message: `登录失败,失败原因: `,
            description: response.error_description,
          });
        }
      }
    },
    *logout({ payload }, { call, put, select }) {
      const response = yield call(logout, payload);

      yield put({ type: 'logOutClear' });

      if (response && response.code === 0) {
        try {
          // get location pathname
          const urlParams = new URL(window.location.href);
          const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          urlParams.searchParams.set('redirect', pathname);
          window.history.replaceState(null, 'login', urlParams.href);
        } finally {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: false,
            },
          });
          reloadAuthorized();
          yield put(routerRedux.push('/user/login'));
        }
      }
    },

    *sendVCode({ payload, callback }, { call, put }) {
      const response = yield call(sendVcode, payload.phone.replace(/\s+/g, ''));
      if (response && response.data) {
        message.info('发送成功!', 1);
        if (callback) callback(true);
      } else {
        message.error(response.msg, 1);
        if (callback) callback(false);
      }
    },

    *getCreate({ payload, callback }, { call, put }) {
      // console.log(payload)
      const response = yield call(getCreate, payload);
      // console.log(response)
      if (response && response.data) {
        if (callback) callback(response.data);
      }
    },

    *getQrcode({ payload, callback }, { call, put }) {
      const response = yield call(getQrcode, payload);
      console.log(response);
      if (response.data.status === undefined) {
        if (callback) callback();
      } else {
        if (response.data.status === '1') {
          if (response.data.token) {
            const json = JSON.parse(response.data.token);

            if (!('error' in response)) {
              response.status = 'ok';
            } else {
              response.status = 'error';
            }

            if (response.status === 'ok') {
              setToken(json.access_token);
              yield put({
                type: 'setAccessTokenAndRefreshToken',
                payload: json,
              });
              const usesRes = yield call(getUserInfo);
              yield put({
                type: 'saveCurrentUser',
                payload: usesRes.data,
              });

              const menus = yield call(getAuthMenus);
              yield put({
                type: 'saveMenus',
                payload: menus,
              });
              reloadAuthorized();
              if (menus) {
                yield put(routerRedux.push(menus[0].children[0].path));
              } else {
                yield put(routerRedux.push('/dashboard/analysis'));
              }
              if (callback) callback(response.data.status);
              // 删除redisTemplate的key
              const response = yield call(getDelete, payload);
            } else {
              notification.error({
                message: `登录失败,失败原因: `,
                description: response.error_description,
              });
            }
          } else {
            if (callback) callback();
          }
        } else {
          if (callback) callback(response.data.status);
        }
      }
    },

    *getSave({ payload, callback }, { call, put }) {
      const response = yield call(getSave, payload);
      if (response && response.data) {
        if (callback) callback(response);
      }
    },

    *getDelete({ payload, callback }, { call, put }) {
      const response = yield call(getDelete, payload);
      console.log(response);
      console.log(11111);
      if (response && response.data) {
        if (callback) callback(response);
      }
    },
  },

  reducers: {
    saveMenus(state, { payload }) {
      setStore({
        name: 'menus',
        content: payload,
        type: 'session',
      });

      return {
        ...state,
        menus: payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      setStore({
        name: 'access_token',
        content: payload.access_token,
        type: 'session',
      });
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    setAccessTokenAndRefreshToken(state, { payload }) {
      setStore({
        name: 'access_token',
        content: payload.access_token,
        type: 'session',
      });
      setStore({
        name: 'refresh_token',
        content: payload.refresh_token,
        type: 'session',
      });
      return {
        ...state,
        refresh_token: payload.refresh_token,
        access_token: payload.access_token,
      };
    },
    logOutClear(state) {
      setStore({
        name: 'access_token',
        content: '',
        type: 'session',
      });
      setStore({
        name: 'refresh_token',
        content: '',
        type: 'session',
      });
      setStore({
        name: 'menus',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'roles',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'permissions',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'userInfo',
        content: {},
        type: 'session',
      });
      setStore({
        name: 'eng',
        content: {},
        type: 'session',
      });
      removeToken();
      setAuthority('');
      return {
        ...state,
        currentUser: {},
        permissions: {},
        roles: [],
        access_token: '',
        refresh_token: '',
        eng: {},
      };
    },

    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      setStore({
        name: 'userInfo',
        content: action.payload.sysUser,
        type: 'session',
      });

      setStore({
        name: 'eng',
        content: action.payload.eng,
        type: 'session',
      });

      setAuthority(action.payload.roles);
      setStore({
        name: 'roles',
        content: action.payload.roles,
        type: 'session',
      });
      const list = {};
      for (let i = 0; i < action.payload.permissions.length; i++) {
        list[action.payload.permissions[i]] = true;
      }
      setStore({
        name: 'permissions',
        content: list,
        type: 'session',
      });
      return {
        ...state,
        currentUser: action.payload.sysUser,
        roles: action.payload.roles,
        permissions: list,
        eng: action.payload.eng,
      };
    },

  },
};

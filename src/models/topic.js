import {
  queryTopic,
  addTopic,
  updateTopic,
  removeTopic,
} from '../services/topic';

export default {
  namespace: 'topic',

  state: {
    data: {
      list: [],
      pagination: false,
    },
  },

  effects: {
    *fetch({payload}, {call, put}) {
      const response = yield call(queryTopic, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *add({payload, callback}, {call, put}) {
      const response = yield call(addTopic, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
    *remove({payload, callback}, {call, put}) {
      const response = yield call(removeTopic, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
    *update({payload, callback}, {call, put}) {
      const response = yield call(updateTopic, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        data: {
          list: [],
          pagination: false,
        },
      };
    },
  },
};

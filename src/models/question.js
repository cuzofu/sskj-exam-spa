import {
  queryQuestion,
  addQuestion,
  updateQuestion,
  removeQuestion,
} from '../services/question';
import {
  queryTopic
} from '../services/topic';

export default {
  namespace: 'question',

  state: {
    data: {
      list: [],
      pagination: false,
    },
    topicSelector: [],
  },

  effects: {
    *fetch({payload}, {call, put}) {
      const response = yield call(queryQuestion, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *add({payload, callback}, {call, put}) {
      const response = yield call(addQuestion, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
    *remove({payload, callback}, {call, put}) {
      const response = yield call(removeQuestion, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
    *update({payload, callback}, {call, put}) {
      const response = yield call(updateQuestion, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
      if (callback) callback();
    },
    *fetchTopicSelectorOptions({payload, callback}, {call, put}) {
      const response = yield call(queryTopic, payload);
      yield put({
        type: 'save',
        payload: {
          topicSelector: response.list || [],
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
        topicSelector: [],
      };
    },
  },
};

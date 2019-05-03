export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {path: '/user', redirect: '/user/login'},
      {path: '/user/login', component: './User/Login'},
    ],
  },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: ['src/pages/Authorized'],
    routes: [

      {path: '/', redirect: '/topic'},
      {
        path: '/topic',
        name: 'topic',
        routes: [
          {
            path: '/topic',
            component: './Topic/index',
          },
        ],
      },
      {
        path: '/question',
        name: 'question',
        routes: [
          {
            path: '/question',
            component: './Question/index',
          },
        ],
      },

      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

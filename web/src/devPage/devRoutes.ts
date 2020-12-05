import buildTree from 'fx214';

const routes = buildTree({
  __: {
    elements: 'elements',
    authRoot: 'auth',
    auth: {
      createUser: 'create-user',
      in: 'in',
      out: 'out',
    },
  },
});

export default routes.__;

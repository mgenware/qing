import { html } from 'lit-element';
import ls from 'ls';
import rs from 'routes';
import './reg/regApp';
import './signIn/signInApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import app from 'app';

const authRouter = new MiniURLRouter();

authRouter.register(rs.auth.signUp, () => {
  const { page } = app;
  page.setTitle([ls.createAnAcc]);
  page.setMainContent(html`<reg-app></reg-app>`);
});
authRouter.register(rs.auth.signIn, () => {
  const { page } = app;
  page.setTitle([ls.signIn]);
  page.setMainContent(html`<sign-in-app></sign-in-app>`);
});
authRouter.startOnce();

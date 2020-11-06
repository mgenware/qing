import { html } from 'lit-element';
import ls from 'ls';
import rs from 'routes';
import './reg/regApp';
import './signIn/signInApp';
import { MiniURLRouter } from 'lib/miniURLRouter';
import app from 'app';

const authRouter = new MiniURLRouter();

authRouter.register(rs.auth.signUp, () => {
  app.page.reloadPageContent(ls.createAnAcc, html`<reg-app></reg-app>`);
});
authRouter.register(rs.auth.signIn, () => {
  app.page.reloadPageContent(ls.createAnAcc, html`<sign-in-app></sign-in-app>`);
});
authRouter.startOnce();

import app from 'app';

export interface ForumWind {
  Editable: boolean;
}

export default app.state.windData<ForumWind>();

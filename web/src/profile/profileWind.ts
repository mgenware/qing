import app from 'app';

export interface ProfileWind {
  Website?: string;
}

export default app.state.windData<ProfileWind>();

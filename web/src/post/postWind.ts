import app from 'app';

export interface PostWind {
  EID: string;
  CmtCount: number;
  InitialLikes: number;
}

export default app.state.windData<PostWind>();

import app from 'app';

export interface DiscussionWind {
  EID: string;
  ReplyCount: number;
}

export default app.state.windData<DiscussionWind>();

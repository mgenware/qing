import app from 'app';

export interface LangInfo {
  Name: string;
  ID: string;
  LocalizedName: string;
}

export interface LangWindData {
  Langs: LangInfo[];
}

export default app.state.windData<LangWindData>();

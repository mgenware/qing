import * as mm from 'mingru-models';
import ContentBase from './contentBase';

export default class ContentWithTitleBase extends ContentBase {
  title = mm.varChar(255);
}

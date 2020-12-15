import * as mm from 'mingru-models';
import ContentBase from './contentBase';
import { maxTitleLen } from '../../constants.json';

export default class ContentWithTitleBase extends ContentBase {
  title = mm.varChar(maxTitleLen);
}

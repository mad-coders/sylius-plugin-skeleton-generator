import {IPluginAuthors} from "./plugin-authors.interface";

export class IPluginNameRequestData {
  syliusVersion!: string;
  namespace!: string;
  pluginNameInput!: string;
  pluginNameInputCamel!: string;
  pluginNameInputSnake!: string;
  pluginComposePackageName!: string;
  pluginDescription!: string;
  emailForSendingPlugin!: string;
  rodoCheckboxChecked!: boolean;
  authorsList?: Array<IPluginAuthors>;
}

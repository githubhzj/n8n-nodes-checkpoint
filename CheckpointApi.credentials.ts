import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class CheckpointApi implements ICredentialType {
  name = 'checkpointApi';
  displayName = 'Checkpoint API';
  icon: Icon = { light: 'file:icon.svg', dark: 'file:icon.dark.svg' };
  documentationUrl = '';
  properties: INodeProperties[] = [
    {
      displayName: '防火墙IP',
      name: 'serverIp',
      type: 'string',
      default: '',
      required: true,
      description: 'Checkpoint防火墙管理IP地址',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Checkpoint API Key',
    },
  ];
}

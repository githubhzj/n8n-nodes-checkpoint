"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckpointApi = void 0;
class CheckpointApi {
    constructor() {
        this.name = 'checkpointApi';
        this.displayName = 'Checkpoint API';
        this.documentationUrl = '';
        this.properties = [
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
}
exports.CheckpointApi = CheckpointApi;

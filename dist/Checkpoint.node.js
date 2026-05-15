"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkpoint = void 0;
const axios_1 = __importDefault(require("axios"));
class Checkpoint {
    constructor() {
        this.description = {
            displayName: 'Checkpoint',
            name: 'checkpoint',
            icon: { light: 'file:icon.svg', dark: 'file:icon.dark.svg' },
            group: ['transform'],
            version: 1,
            description: '在Checkpoint防火墙上创建和管理安全策略',
            defaults: {
                name: 'Checkpoint',
            },
            inputs: ['main'],
            outputs: ['main'],
            usableAsTool: true,
            credentials: [
                {
                    name: 'checkpointApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Create Policy',
                            value: 'createPolicy',
                            description: 'Create a security policy',
                        },
                        {
                            name: 'Block IP',
                            value: 'blockIp',
                            description: 'Block an IP address',
                        },
                        {
                            name: 'Unblock IP',
                            value: 'unblockIp',
                            description: 'Unblock an IP address',
                        },
                        {
                            name: 'Install Policy',
                            value: 'installPolicy',
                            description: 'Install a policy package',
                        },
                    ],
                    default: 'createPolicy',
                    description: 'The operation to perform.',
                },
                {
                    displayName: 'Source IP',
                    name: 'src',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['createPolicy'],
                        },
                    },
                    description: 'Source IP address for the policy.',
                },
                {
                    displayName: 'Destination IP',
                    name: 'dst',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['createPolicy'],
                        },
                    },
                    description: 'Destination IP address for the policy.',
                },
                {
                    displayName: 'IP Address',
                    name: 'ip',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['blockIp', 'unblockIp'],
                        },
                    },
                    description: 'IP address to block or unblock.',
                },
                {
                    displayName: 'Group Name',
                    name: 'groupname',
                    type: 'string',
                    default: 'Group_BlockIP_001',
                    displayOptions: {
                        show: {
                            operation: ['blockIp', 'unblockIp'],
                        },
                    },
                    description: 'Name of the group to modify.',
                },
                {
                    displayName: 'Policy Package',
                    name: 'policyPackage',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['installPolicy'],
                        },
                    },
                    description: 'Name of the policy package to install.',
                },
                {
                    displayName: 'Targets',
                    name: 'targets',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['installPolicy'],
                        },
                    },
                    description: 'Comma-separated list of target devices.',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('checkpointApi');
        // 调试输出凭据内容
        console.log('n8n CheckpointPolicy credentials:', credentials);
        if (!credentials) {
            throw new Error('未配置Checkpoint API认证信息');
        }
        if (!credentials.apiKey || !credentials.serverIp) {
            throw new Error(`凭据内容不完整，当前内容: ${JSON.stringify(credentials)}`);
        }
        const apiKey = credentials.apiKey;
        const firewallIp = credentials.serverIp;
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            const headers = {
                'Content-Type': 'application/json',
                'X-chkp-sid': (await axios_1.default.post(`https://${firewallIp}/web_api/login`, { 'api-key': apiKey }, { headers: { 'Content-Type': 'application/json' }, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) })).data.sid,
            };
            try {
                if (operation === 'createPolicy') {
                    const src = this.getNodeParameter('src', i);
                    const dst = this.getNodeParameter('dst', i);
                    // Create policy logic
                    await axios_1.default.post(`https://${firewallIp}/web_api/add-host`, { name: `Scanner_${src}`, 'ip-address': src, color: 'green' }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/add-host`, { name: `AUTO_SCAN_${dst}`, 'ip-address': dst, color: 'green' }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/add-access-rule`, {
                        layer: 'network',
                        position: 'top',
                        name: `vuln scan policy for ${dst}`,
                        action: 'Accept',
                        source: `Scanner_${src}`,
                        destination: `AUTO_SCAN_${dst}`,
                    }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/publish`, {}, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                }
                else if (operation === 'blockIp') {
                    const ip = this.getNodeParameter('ip', i);
                    const groupname = this.getNodeParameter('groupname', i);
                    // Block IP logic
                    await axios_1.default.post(`https://${firewallIp}/web_api/add-host`, { name: `AUTO_Block_${ip}`, 'ip-address': ip, color: 'green' }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/set-group`, { name: groupname, members: { add: `AUTO_Block_${ip}` } }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/publish`, {}, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                }
                else if (operation === 'unblockIp') {
                    const ip = this.getNodeParameter('ip', i);
                    const groupname = this.getNodeParameter('groupname', i);
                    // Unblock IP logic
                    await axios_1.default.post(`https://${firewallIp}/web_api/set-group`, { name: groupname, members: { remove: `AUTO_Block_${ip}` } }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/delete-host`, { name: `AUTO_Block_${ip}` }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                    await axios_1.default.post(`https://${firewallIp}/web_api/publish`, {}, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                }
                else if (operation === 'installPolicy') {
                    const policyPackage = this.getNodeParameter('policyPackage', i);
                    const targets = this.getNodeParameter('targets', i).split(',');
                    // Install policy logic
                    await axios_1.default.post(`https://${firewallIp}/web_api/install-policy`, {
                        'policy-package': policyPackage,
                        access: 'true',
                        'threat-prevention': 'true',
                        targets,
                    }, { headers, httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) });
                }
                returnData.push({ json: { success: true, operation } });
            }
            catch (err) {
                returnData.push({ json: { success: false, operation, error: err.message, detail: err.response?.data } });
            }
        }
        return this.prepareOutputData(returnData);
    }
}
exports.Checkpoint = Checkpoint;

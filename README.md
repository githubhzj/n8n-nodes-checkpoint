# n8n-nodes-checkpoint

## 功能
在n8n流程中自动管理Checkpoint防火墙安全策略，包括：
- 创建安全策略
- 阻止IP地址
- 解除阻止IP地址
- 安装策略包

## 参数
- 防火墙IP（认证参数）
- API Key（认证参数）
- 操作类型（节点参数）
  - 创建策略：源IP、目标IP
  - 阻止IP：IP地址、组名
  - 解除阻止IP：IP地址、组名
  - 安装策略包：策略包名称、目标设备

## 使用方法
1. 将本目录作为n8n自定义节点安装到n8n环境。
2. 在n8n中配置Checkpoint API认证（防火墙IP、API Key）。
3. 在流程中拖入“Checkpoint Policy”节点，选择操作类型并填写相关参数。
4. 运行流程，即可完成对应操作。

## 安装到你的n8n容器环境
以 n8n-nodes-checkpoint-main.zip 为例
1. 上传自定义nodes文件到运行n8n的服务器上
2. 解压文件 unzip n8n-nodes-checkpoint-main.zip
3. 重命名 mv n8n-nodes-checkpoint-main n8n-nodes-checkpoint
4. 使用docker cp 命令将nodes解压后的所有文件放到指定目录下
docker cp n8n-nodes-checkpoint n8n:/home/node/.n8n/custom/
5. 重启n8n容器服务 docker restart n8n
6. 在前端创建workflow 添加node搜索checkpoint
7. 添加防火墙认证信息
8. 选择动作填写信息测试  
如果需要进入容器内部查看文件：  
docker exec -it n8n sh  
cd .n8n/custom 进入自定义目录  
ls 查看  

## 依赖
- axios
- n8n-workflow

## 备注
- 支持多种操作类型，详见参数说明。
- 需保证n8n服务器能访问Checkpoint防火墙API。

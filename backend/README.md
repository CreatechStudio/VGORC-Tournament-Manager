# VGORC Tournament Manager Backend

## Environment Variables

| Name                       | Explain                | Example                |
|----------------------------|------------------------|------------------------|
| TM_BASE_URL                | 后端API地址                | http://localhost:3000  |
| TM_WEB_URL                 | 前端地址                   | http://localhost:5173  |
| TM_DB_FILE                 | 数据库文件路径                | ./db.vgorc             |
| TM_BACKUP_CRON             | 数据库备份计划任务表达式           | */5 7-18 * * *              |
| TM_LICENSE_KEY             | 授权密钥                   | CSVGORC-AAA-BBB-CCC-DD |
| TM_JWT_SECRET              | JWT密钥                  | Createch               |
| TM_ADMIN_PASSWORD          | 管理员密码                  | 123456                 |
| TM_REFEREE_PASSWORD        | 裁判密码                   | 123456                 |
| TM_TOURNAMENT_NAME         | 比赛名称                   | VGORC                  |
| TM_VENDOR_LOGO             | 比赛主办方图标地址 (使用英文逗号分割多个) |                        |
| TM_RANK_TABLE_SCROLL_SPEED | 排名表格一毫秒滚动多少个像素         | 0.03                   |
| TM_LOGO_INTERVAL_NUMBER    | 排名表格中，多少条排名出现一个logo    | 20                     |
| TM_PUBLISH_SECRET          |                        | 发布密钥                   | 123456                 |

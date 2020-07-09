# 多重選項值的檢測

* MultipleItemSelectValues
* 總權值是否為奇數，true為有第一項的權限。
* 可正反向Scan權值（已存在或未存在列表中的項次）
* [多重選項值的檢測](https://docs.google.com/spreadsheets/d/1pCkF7-pwB8wrdPEr9Q-Gg3BsvHjmXHf7-RSl-S5Nr4Y/edit#gid=0)

* 1-1 create new values 產生新的總權值
* 2-1 insert value 新增第N項次權值
* 3-1 remove value 移除第N項次權值
* 4-1 select value 驗證第N項次權值
* 5-1 scan all values 列出已存在的所有項次（總權值中）

* 10000.json 為1～10000的Array字串
* 10000value.text 內容值為 (2^10000) - 1

* 1~3000 array字串長度＝ 13894 bytes
* 1~3000 總權值長度＝ 904 bytes
=============================

## Mysql Data Type Length

* TINYTEXT: 256 bytes
* TEXT: 65,535 bytes => ~64kb
* MEDIUMTEXT: 16,777,215 bytes => ~16MB
* LONGTEXT: 4,294,967,295 bytes => ~4GB

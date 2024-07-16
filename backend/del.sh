#!/bin/bash

# 查找并删除所有 .js 文件
find . -type f -name "*.js" -exec rm -f {} \;

echo "All .js files have been deleted."

#!/bin/bash

# 로컬 Docker 컨테이너 실행 스크립트

set -e

IMAGE_NAME="jiho-frontend:local"
CONTAINER_NAME="jiho-frontend-test"
PORT="3000"

echo "🚀 Docker 컨테이너를 시작합니다..."

# 기존 컨테이너가 실행 중이면 중지
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "⏹️  기존 컨테이너를 중지합니다..."
    docker stop $CONTAINER_NAME
fi

# 기존 컨테이너가 있으면 제거
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🗑️  기존 컨테이너를 제거합니다..."
    docker rm $CONTAINER_NAME
fi

# 새 컨테이너 실행
echo "▶️  새 컨테이너를 실행합니다..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:$PORT \
  $IMAGE_NAME

echo "✅ 컨테이너가 성공적으로 시작되었습니다!"
echo "🌐 브라우저에서 http://localhost:$PORT 로 접속하세요"
echo ""
echo "📋 유용한 명령어들:"
echo "   docker logs $CONTAINER_NAME          # 로그 확인"
echo "   docker stop $CONTAINER_NAME          # 컨테이너 중지"
echo "   docker exec -it $CONTAINER_NAME sh   # 컨테이너 내부 접속"
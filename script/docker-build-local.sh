#!/bin/bash

# 로컬 Docker 빌드 스크립트
# .env 파일에서 환경 변수를 읽어와서 Docker 빌드

set -e

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ $ENV_FILE 파일이 존재하지 않습니다."
    exit 1
fi

echo "🔧 $ENV_FILE 에서 환경 변수를 읽어와서 Docker 빌드를 시작합니다..."

# .env 파일에서 변수 읽기
source $ENV_FILE

# Docker 빌드 명령어 실행
docker build \
  --build-arg VITE_INTERNAL_API_TOKEN="$VITE_INTERNAL_API_TOKEN" \
  --build-arg BACKEND_URL="$BACKEND_URL" \
  --build-arg AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
  --build-arg AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
  --build-arg AWS_REGION="$AWS_REGION" \
  --build-arg AWS_S3_BUCKET="$AWS_S3_BUCKET" \
  --build-arg S3_UPLOAD_MAX_SIZE="$S3_UPLOAD_MAX_SIZE" \
  --build-arg S3_ALLOWED_EXTENSIONS="$S3_ALLOWED_EXTENSIONS" \
  --build-arg INTERNAL_API_TOKEN="$INTERNAL_API_TOKEN" \
  --build-arg PORT="$PORT" \
  -t jiho-frontend:local \
  .

echo "✅ Docker 빌드가 완료되었습니다!"
echo "🚀 다음 명령어로 컨테이너를 실행할 수 있습니다:"
echo "   docker run -p 3000:3000 jiho-frontend:local"
#!/bin/bash

# VandalHub Frontend Deployment to AWS S3 + CloudFront
# Run this script to deploy the React frontend to AWS

set -e

echo "🚀 Starting VandalHub Frontend Deployment to AWS..."

# Configuration
BUCKET_NAME="vandalhub-frontend-$(date +%s)"
REGION="us-east-1"
CLOUDFRONT_COMMENT="VandalHub Frontend Distribution"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI is configured${NC}"

# Build the frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend-main
npm install
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed. No 'dist' directory found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Create S3 bucket
echo -e "${YELLOW}🪣 Creating S3 bucket: ${BUCKET_NAME}${NC}"
aws s3 mb s3://${BUCKET_NAME} --region ${REGION}

# Configure bucket for static website hosting
echo -e "${YELLOW}🌐 Configuring static website hosting...${NC}"
aws s3 website s3://${BUCKET_NAME} --index-document index.html --error-document index.html

# Set bucket policy for public read access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file://bucket-policy.json
rm bucket-policy.json

# Upload files to S3
echo -e "${YELLOW}📤 Uploading files to S3...${NC}"
aws s3 sync dist/ s3://${BUCKET_NAME} --delete

# Create CloudFront distribution
echo -e "${YELLOW}☁️ Creating CloudFront distribution...${NC}"
cat > cloudfront-config.json << EOF
{
    "CallerReference": "vandalhub-$(date +%s)",
    "Comment": "${CLOUDFRONT_COMMENT}",
    "DefaultCacheBehavior": {
        "TargetOriginId": "${BUCKET_NAME}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "${BUCKET_NAME}",
                "DomainName": "${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF

DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.Id' --output text)
rm cloudfront-config.json

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query 'Distribution.DomainName' --output text)

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📋 Deployment Summary:"
echo "🪣 S3 Bucket: ${BUCKET_NAME}"
echo "🌐 S3 Website URL: http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
echo "☁️ CloudFront Distribution ID: ${DISTRIBUTION_ID}"
echo "🔗 CloudFront URL: https://${CLOUDFRONT_DOMAIN}"
echo ""
echo "⏳ Note: CloudFront distribution may take 10-15 minutes to fully deploy."
echo ""
echo "🔧 Next Steps:"
echo "1. Update your backend API URLs to point to your deployed backend"
echo "2. Configure custom domain (optional)"
echo "3. Set up SSL certificate (optional)"

cd ..

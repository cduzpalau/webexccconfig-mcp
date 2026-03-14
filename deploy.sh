#!/bin/bash
# Local deployment script for Webex CC Config MCP to Google Cloud Run

PROJECT_ID="CLTECCCT"
REGION="us-central1" # Change if needed

# Determine environment from argument, default to dev
ENV=${1:-dev}

if [ "$ENV" != "stable" ] && [ "$ENV" != "dev" ]; then
    echo "Error: Environment must be 'stable' or 'dev'"
    echo "Usage: ./deploy.sh [stable|dev]"
    exit 1
fi

SERVICE_NAME="webexccconfig-mcp-${ENV}"

echo "Deploying to Cloud Run service: $SERVICE_NAME (Project: $PROJECT_ID)"

# Submit source to Cloud Build and deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --project=$PROJECT_ID \
    --region=$REGION \
    --allow-unauthenticated \
    --port=8080 \
    --set-env-vars="PORT=8080"

echo ""
echo "Deployment initiated!"
echo "Note: You will need to set WEBEX_TOKEN, WEBEX_ORG_ID, and WEBEX_BASE_URL environment variables in the Cloud Run console for the service to function correctly."

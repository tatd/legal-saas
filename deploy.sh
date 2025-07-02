#!/bin/bash
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;

# Exit on error
set -e

echo "Starting deployment..."

# Deploy API service
echo "Deploying API service..."
cd "./api-easy-matters"
cp .env.example .env
nvm use
npm install
npm run build
docker compose up -d --build

# Wait for API service to start
sleep 10

# Run migrations (Should be redundant, as this is done when the API starts
echo -e "\nRunning migrations..."
npm run migrate

# Run data seed
echo -e "\nRunning data seed..."
npm run seed:run

# Deploy Frontend service
cd "../easy-matters"
nvm use
npm install
npm run build
echo -e "\nDeploying Frontend service..."
docker compose up -d --build

cd "../"
echo -e "\nDeployment complete!"
echo ""
echo "Services are now running:"
echo "- Frontend: http://localhost:5173"
echo "- API: http://localhost:3001"
echo ""
echo ""
echo "To stop the services, run:"
echo "  ./down.sh"

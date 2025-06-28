#!/bin/bash

# Exit on error
set -e

echo "Stopping all services and cleaning up..."

# Stop and remove API service containers and volumes
echo -e "\nStopping API service..."
cd "./api-easy-matters"
docker compose down -v

# Stop and remove Frontend service containers and volumes
echo -e "\nStopping Frontend service..."
cd "../easy-matters"
docker compose down -v

cd "../"
echo -e "\nAll services have been stopped and cleaned up."
echo "To start the services again, run: ./deploy.sh"

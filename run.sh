echo "starting execution"

echo "First Compiling all files"

truffle compile --all

echo "Completed compiling"

sleep 2

echo "migration of contracts on to the network"

truffle migrate --reset

echo "Completed to the network"

cd client

yarn start




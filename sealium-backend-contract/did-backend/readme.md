

npm install -g @nestjs/cli 
npm install ethr-did ethers
npm install class-validator 
npm install @nestjs/config
npm install --save @nestjs/typeorm typeorm pg
npm install drizzle-orm pg
npm install --save-dev @types/pg
npm install did-jwt-vc did-jwt ethers
npm install did-resolver ethr-did-resolver
npm install @nestjs/websockets @nestjs/platform-socket.io



npm run db:setup
npm run db:push 


npx drizzle-kit generate
npx drizzle-kit push


validator manager contract owner address 
51345 chainid
http://127.0.0.1:43797/ext/bc/2htLdMAAmVb9pRJL7ZJk6eRRuHia8kKFs42hXNoa2dOYT3MSN/rpc


```sh
install avalanchego
wget -nd -m https://raw.githubusercontent.com/ava-labs/avalanche-docs/master/scripts/avalanchego-installer.sh;\
chmod 755 avalanchego-installer.sh;\
./avalanchego-installer.sh

 /home/vboxuser/avalanche-node/avalanchego --version
export PATH=$PATH:/home/vboxuser/avalanche-node
source ~/.bashrc
avalanchego --version



avalanchego \
  --network-id=local \
  --http-host=0.0.0.0 \
  --http-allowed-hosts="*" \
  --log-level=info


DB_HOST=localhost
DB_PASSWORD=admin123
DB_NAME=sealium
DB_USER=admin
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sealium 


RPC_URL=http://127.0.0.1:46711/ext/bc/2aR6QKozrrQX3TRRb1EpfBco71YrVkTEitZG74un2hFkGg1S4L/rpc


adding route {"url": "/ext/bc/13151", "endpoint": "http://127.0.0.1:41807/ext/bc/jp7d6KyMTbF1LrZSDKhmZ9NnDeyaKrxBtQVhCa5bvX8vbRNGv/rpc"}




DB_HOST=localhost
DB_PASSWORD=admin123
DB_NAME=sealium
DB_USER=admin
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sealium 


RPC_URL=http://127.0.0.1:40323/ext/bc/C4sy9vwcoKM3oY3AGEj2HE9M3JSn92R29Vm76tEqY1b1DyzTJ/rpc

SEPOLIA_RPC_URL=http://127.0.0.1:40323/ext/bc/C4sy9vwcoKM3oY3AGEj2HE9M3JSn92R29Vm76tEqY1b1DyzTJ/rpc
SEPOLIA_PAYMASTER_PVTKEY=56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027


DID_CONTRACT_ADDRESS=0xA4cD3b0Eb6E5Ab5d8CE4065BcCD70040ADAB1F00


SALT=SEALIUMSALT123
JWT_SECRET_KEY=SEALIUMJWT123

KAKAO_CLIENT_ID=6365192651471a2b5549ef7cfbdead94
CLIENT_SECRET=zBgdqbb1PbXlZ5fY9nEoajjSgwBM5zt3
REDIRECT_URL=http://localhost:4000/auth/kakao/callback
LOGOUT_REDIRECT_URL=http://localhost:4000/auth/kakao/logout/callback
TOKEN_URL=https://kauth.kakao.com/oauth/token

eval "$(ssh-agent -s)"
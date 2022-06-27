require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/2O0Sv9b_YJgqPnuyj0ynbT_Wz76lOZAn',
      accounts: ['1cd4c4adff9cd49fe1b23624525c59ed0580a9a1020d5782ac2105943610436e'],
    } 
  },
  etherscan: {
    apiKey: 'KC7NWQHGZUKK3UMH1791FEJ8BY8XPJYSDW'
  }
};
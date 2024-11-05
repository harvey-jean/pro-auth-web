# Product Authentication Web Portal(for manufacturers)

## Description
This web application is designed for product authentication using blockchain technology. It allows manufacturers to store product information securely on the blockchain, ensuring the authenticity and integrity of the products. Users can search for products, add new products, and perform various other related operations.

## Motivation
The primary motivation behind this project is to combat counterfeit products and ensure that consumers can verify the authenticity of the products they purchase. By leveraging blockchain technology, we can provide a tamper-proof and transparent system for product authentication.

## Features
- **Store Products**: Add new products to the blockchain with unique identifiers.
- **Search Products**: Search for products by their unique identifiers to verify their authenticity.
- **Product Details**: View detailed information about each product.
- **Blockchain Integration**: Secure and immutable storage of product data on the blockchain.
- **Data Source Duplication**: Use MongoDB for data duplication to run reports without overloading the blockchain.
- **QR Code generator**: Generate QR code for each product

## Quick Start

### Prerequisites
- Node.js
- npm (Node Package Manager)
- Ganache (personal blockchain for Ethereum development)
- MetaMask (Ethereum wallet)
- Truffle (development framework for Ethereum)
- MongoDB (for data duplication)
- Languages: Node.js, Solidity, HTML, CSS, JavaScript

### Installation
1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/product-authentication-webapp.git
   cd product-authentication-webapp

2. **Install dependencies:**:
npm install

3. **Install Truffle globally:**:
npm install -g truffle

4. **Install and run Ganache:**:
- Download and install Ganache from: (https://archive.trufflesuite.com/ganache/)
- Start Ganache and configure it to use the default settings.

5. **Configure MetaMask:**:
- Install MetaMask extension in your browser.
- Connect MetaMask to your local Ganache blockchain.

6. **Configure MongoDB:**
- Install MongoDB from: (https://www.mongodb.com/try/download/community)
- Start MongoDB server.

7. **Configure the blockchain network settings** in the truffle-config.js file:

```javascript
// truffle-config.js

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",   // Localhost (default)
      port: 7545,          // Standard port for Ganache
      network_id: "*"      // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,       // Enable the Solidity optimizer
      runs: 200            // Optimize for how many times you intend to run the code
    }
  }
}
```

### Running the Application
1. **Compile and migrate the smart contracts:**:
truffle compile
truffle migrate

2. **Start the development server:**:
npm start

3. **Open your browser**: and navigate to http://localhost:3000
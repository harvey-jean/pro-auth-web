pragma solidity ^0.5.0;

contract ProductDetails {
    //State variable - State of the contrct inside the blockchain
    uint public productCount = 0;

    struct ProductEntity{
        uint id;
        /*string name;
        string referenceId;
        string manufacturer;
        string madeIn;
        string description;
        string category;*/

        string productDetails; //name , referenceId, manufacturer, madeIn, description, category, createdBy
        uint256 price;
        uint256 warranty;
        uint16 yearOfRelease;
        //string createdBy;
        uint256 createdAt;
    }

    mapping(uint => ProductEntity) public products;

    event ProductCreated(
        uint id,
        string productDetails,
        uint256 price,
        uint256 warranty,
        uint16 yearOfRelease,
        uint256 createdAt
    );

    constructor() public {
        string memory productDetails = "IPhone 12|IJ5|Apple|US|Test Desc|Phone|Paul";
        createProduct(productDetails, 1300, 360, 2022);
    }

    function createProduct(string memory _productDetails,
                            uint256 _price,
                            uint256 _warranty,
                            uint16 _yearOfRelease) public {
        productCount ++;
        uint256 createdAt = block.timestamp;

        products[productCount] = ProductEntity(productCount, 
                                        _productDetails, 
                                        _price,
                                        _warranty,
                                        _yearOfRelease,
                                        createdAt);

        emit ProductCreated(productCount, 
                            _productDetails, 
                            _price, 
                            _warranty, 
                            _yearOfRelease,
                            createdAt);
    }
}
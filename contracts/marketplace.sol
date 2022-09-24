// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Marketplace {

    uint internal productsLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Stream {
        address payable owner;
        string name;
        string image;
        string description;
        string url;
        string date;
        uint price;
        uint limit_people;
    }

    mapping (uint => Stream) internal streams;
    mapping (address => uint[]) internal buyed;
    constructor(){
        streams[0]=Stream(
            payable(0x915C449150C85885F869b846F9a0583afD8dD039),
            "Stream 1",
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
            "A wonderful course",
            "https://meet.google.com/utg-syes-ijw",
            "Sep 23 22:09",
            1*10**18,
            10
        );
        streams[1]=Stream(
            payable(0x915C449150C85885F869b846F9a0583afD8dD039),
            "Stream 2",
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
            "A wonderful course",
            "https://meet.google.com/utg-syes-ijw",
            "Sep 23 22:09",
            0.5*10**18,
            10
        );
    }
    function readStream(uint _index) public view returns (
        Stream memory
    ) {
        return streams[_index];
    }

    // function writeProduct(
    //     string memory _name,
    //     string memory _image,
    //     string memory _description, 
    //     string memory _location, 
    //     uint _price
    // ) public {
    //     uint _sold = 0;
    //     products[productsLength] = Product(
    //         payable(msg.sender),
    //         _name,
    //         _image,
    //         _description,
    //         _location,
    //         _price,
    //         _sold
    //     );
    //     productsLength++;
    // }

    
    // function buyProduct(uint _index) public payable  {
    //     require(
    //       IERC20Token(cUsdTokenAddress).transferFrom(
    //         msg.sender,
    //         products[_index].owner,
    //         products[_index].price
    //       ),
    //       "Transfer failed."
    //     );
    //     products[_index].sold++;
    // }
    
    // function getProductsLength() public view returns (uint) {
    //     return (productsLength);
    // }
}
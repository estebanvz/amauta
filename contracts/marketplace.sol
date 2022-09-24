// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Marketplace {
    uint256 internal streamsLength = 0;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Stream {
        address payable owner;
        string name;
        string image;
        string description;
        string date;
        uint256 price;
        uint256 limit_people;
    }

    mapping(uint256 => Stream) internal streams;
    mapping(uint256 => string) internal hiddenLinks;

    mapping(address => uint256[]) internal buyed;

    constructor() {
        streams[0] = Stream(
            payable(0x915C449150C85885F869b846F9a0583afD8dD039),
            "Stream 1",
            "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
            "A wonderful course,A wonderful course,A wonderful course,A wonderful course",
            "Sep 23 22:09",
            1 * 10**18,
            10
        );
        streams[1] = Stream(
            payable(0x915C449150C85885F869b846F9a0583afD8dD039),
            "Stream 2",
            "https://randompicturegenerator.com/img/cat-generator/g246157c274bdf07036e72fa481ad1cc24b3d88c830d66dfed057543ae2c8aa9f4a99a61f4de6c18e0254fe1e5d887d2b_640.jpg",
            "A wonderful course about cats, A wonderful course about cats, A wonderful course about cats",
            "Sep 23 22:09",
            0.5 * 10**18,
            10
        );
        hiddenLinks[0] = "https://meet.google.com/utg-syes-ijw";
        hiddenLinks[1] = "https://meet.google.com/utg-syes-ijw";
        streamsLength = 2;
    }

    function readStream(uint256 _index) public view returns (Stream memory) {
        return streams[_index];
    }

    function readLength() public view returns (uint256) {
        return streamsLength;
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

    function buyStreams(uint256 _index) public payable {
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                streams[_index].owner,
                streams[_index].price
            ),
            "Transfer failed."
        );
        buyed[msg.sender].push(_index);
    }

    function getHiddenLink(uint256 _index) public view returns (string memory) {
        
        for (uint256 i = 0; i < buyed[msg.sender].length; i++) {
            if (buyed[msg.sender][i] == _index) {
                return hiddenLinks[_index];
            }
        }
        return "";
    }
}

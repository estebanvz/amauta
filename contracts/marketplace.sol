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
    address internal  owner = 0x2b66E19C7b75fF24F58a2337b4aA0aCd76e59f5f;

    struct Stream {
        address payable owner;
        string name;
        string image;
        string description;
        string date;
        uint256 price;
        uint256 tickets;
    }

    mapping(uint256 => Stream) internal streams;
    mapping(uint256 => string) internal hiddenLinks;
    mapping(address => uint256[]) internal buyed;
    mapping(address => mapping(uint => bool)) hasbought;

    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _date,
        string memory _link,
        uint _price,
        uint _tickets
    ) public {
        
        streams[streamsLength] = Stream(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _date,
            _price,
            _tickets
        );
        hiddenLinks[streamsLength]=_link;
        streamsLength++;
    }

    function buyStreams(uint256 _index) public payable {
        require(!hasbought[msg.sender][_index], "user has already bought");
        require(msg.sender != streams[_index].owner);
        require(
            streams[_index].tickets>0 &&
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                streams[_index].owner,
                streams[_index].price*99/100
            ),
            "Transfer failed."
        );
        uint256 fee = streams[_index].price/100 ;
        IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                payable(owner),
                fee
            );
        streams[_index].tickets-= 1;
        buyed[msg.sender].push(_index);
    }

    function getHiddenLink(uint256 _index) public view returns (string memory) {
        if (hasbought[msg.sender][_index]){
            return hiddenLinks[_index];
        }
        return "";
    }
    
    function getMyStreams() public view returns (uint[] memory){
        return buyed[msg.sender];
    }

    function readStream(uint256 _index) public view returns (Stream memory) {
        return streams[_index];
    }

    function readLength() public view returns (uint256) {
        return streamsLength;
    }
}

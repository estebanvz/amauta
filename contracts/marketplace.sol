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
    address internal owner = 0x2b66E19C7b75fF24F58a2337b4aA0aCd76e59f5f;

    struct Stream {
        address payable owner;
        string name;
        string image;
        string description;
        string date;
        uint256 price;
        uint256 limit_people;
    }

    mapping(uint256 => Stream) private streams;
    mapping(uint256 => string) private hiddenLinks;
    mapping(address => mapping(uint256 => bool)) private buyed;


    function readStream(uint256 _index) public view returns (Stream memory) {
        return streams[_index];
    }

    function readLength() public view returns (uint256) {
        return streamsLength;
    }

    /**
        * @dev allow users to upload a Stream to the platform
        * @notice input data needs to only contain valid values
     */
    function writeStream(
        string calldata _name,
        string calldata _image,
        string calldata _description,
        string calldata _date,
        string memory _link,
        uint _price,
        uint _limit_people
    ) public {
        require(bytes(_name).length > 0,"Empty name");
        require(bytes(_image).length > 0,"Empty image");
        require(bytes(_description).length > 0,"Empty description");
        require(bytes(_date).length > 0,"Empty date");
        require(bytes(_link).length > 0,"Empty link");
        require(_limit_people > 0, "Limit for people must at least be one");
        require(_price >= 1 ether,"Price needs to start at least from one CUSD");
        streams[streamsLength] = Stream(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _date,
            _price,
            _limit_people
        );
        hiddenLinks[streamsLength]=_link;
        streamsLength++;
    }

    /**
        * @dev allow users to buy a Stream to get access to the hidden links
        * @notice Streams' owners can't buy their own streams
     */
    function buyStreams(uint256 _index) public payable {
        Stream storage currentStreams = streams[_index]; 
        require(currentStreams.owner != msg.sender, "You can't buy your streams");
        require(!buyed[msg.sender][_index],"Already bought stream");
        require(
            currentStreams.limit_people > 0 &&
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                currentStreams.owner,
                currentStreams.price * 99 / 100
            ),
            "Transfer failed."
        );
        uint256 fee = currentStreams.price / 100 ;
        IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                payable(owner),
                fee
            );
        currentStreams.limit_people -= 1;
        buyed[msg.sender][_index] = true;
    }

    /**
        * @dev allow users to query the hidden link of bought streams
        * @notice if you did not buy this stream yet, an empty string will be returned
     */
    function getHiddenLink(uint256 _index) public view returns (string memory) {
        
        if(buyed[msg.sender][_index]){
            return hiddenLinks[_index];
        }
        return "";
    }

}

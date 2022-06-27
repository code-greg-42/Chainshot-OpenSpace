// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SellerList is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    IERC20 link = IERC20(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);

    address reserveMain;
    uint256 public requiredDeposit;
    address public testAddress;
    string public testSender;

    bytes32 private jobId;
    uint256 private fee;

    event NewSeller(
        address indexed _seller,
        string indexed _url,
        string indexed _name
    );

    struct Seller {
        uint256 sellerId;
        string url;
        string name;
        bool active;
    }
    mapping(address => Seller) public sellers;
    uint256 public totalSellers;

    struct Submission {
        string baseURL;
        string endpoint;
        string name;
        bool urlSubmitted;
    }

    mapping(address => Submission) public submittedURL;
    mapping(address => bool) public verificationSuccess;
    event Verified(address indexed _addr);

    constructor() {
        reserveMain = msg.sender;
        requiredDeposit = 1e17;
        setChainlinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
        setChainlinkOracle(0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f);
        jobId = "7d80a6386ef543a3abb52817f6707e3b";
        fee = 1e17;
    }

    receive() external payable {}

    function joinAsSeller() external payable returns (uint256 _sellerId) {
        // require(msg.value >= requiredDeposit);
        // chainlink anyAPI address verification
        require(verificationSuccess[msg.sender], "must be verified!");
        _sellerId = totalSellers;
        Seller memory seller = Seller(
            _sellerId,
            submittedURL[msg.sender].baseURL,
            submittedURL[msg.sender].name,
            true
        );
        sellers[msg.sender] = seller;
        emit NewSeller(
            msg.sender,
            submittedURL[msg.sender].baseURL,
            submittedURL[msg.sender].name
        );

        // potentially add swap or purchase of link tokens
        totalSellers++;
    }

    function submitForVerification(
        string memory _base_url,
        string memory _endpoint,
        string memory _name
    ) public returns (bool _success) {
        // may need to be an array instead of a single variable
        testAddress = msg.sender;
        // msg.sender converted to string and saved to variable for comparison to api response
        testSender = Strings.toHexString(uint256(uint160(msg.sender)), 20);
        // baseURL is set permanently after the first verification attempt
        if (submittedURL[msg.sender].urlSubmitted) {
            submittedURL[msg.sender].endpoint = _endpoint;
            requestVerification(submittedURL[msg.sender].baseURL, _endpoint);
        } else {
            Submission memory _new_submission = Submission(
                _base_url,
                _endpoint,
                _name,
                true
            );
            submittedURL[msg.sender] = _new_submission;
            requestVerification(_base_url, _endpoint);
        }
        _success = true;
    }

    function requestVerification(
        string memory _base_url,
        string memory _endpoint
    ) public returns (bytes32 _reqId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        string memory _fullURL = concatenate(_base_url, _endpoint);
        req.add("get", _fullURL);
        req.add("path", "ethereumAddress");

        return sendChainlinkRequest(req, fee);
    }

    function fulfill(bytes32 _requestId, string memory _response)
        public
        recordChainlinkFulfillment(_requestId)
    {
        if (compareTwoStrings(_response, testSender)) {
            verificationSuccess[testAddress] = true;
            emit Verified(testAddress);
        }
    }

    function contractBalance() public view returns (uint256 _balance) {
        _balance = link.balanceOf(address(this));
    }

    function isSeller(address _addr) external view returns (bool _isSeller) {
        _isSeller = sellers[_addr].active;
    }

    function compareTwoStrings(string memory _string1, string memory _string2)
        public
        pure
        returns (bool _isEqual)
    {
        _isEqual =
            keccak256(abi.encodePacked(_string1)) ==
            keccak256(abi.encodePacked(_string2));
    }

    function concatenate(string memory _a, string memory _b)
        public
        pure
        returns (string memory)
    {
        return string(bytes.concat(bytes(_a), bytes(_b)));
    }
}

// deploy this contract first, then add contract address to ReserveNFT.sol and Marketplace.sol and ReserveAirdrop.sol

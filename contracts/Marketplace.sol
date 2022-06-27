// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
    address reserveMain;
    uint256 fee = 1e15;
    uint256 feeCollection;

    IERC721 ticket = IERC721(0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F);
    IERC721 airdrop = IERC721(0x50681Cbd21D0c17827f1cBE7c7952c162C318c63);

    struct Buyer {
        address ethAddress;
        bytes32 identifier;
        bool exists;
    }

    // mapping of identity hashes to corresponding ethereum addresses
    mapping(bytes32 => Buyer) public buyersByIdentifier;
    mapping(address => Buyer) public buyersByAddress;

    struct Purchase {
        uint256 tokenId;
        address seller;
        address buyer;
        uint256 timestampOfPurchase;
    }

    event ItemPurchased(
        uint256 indexed _tokenId,
        address indexed _seller,
        address indexed _buyer
    );

    struct Item {
        uint256 tokenId;
        uint256 price;
        uint256 timestampFirstSale;
        uint256 timestampCurrentSale;
        bool forSale;
        bool previouslyListed;
    }

    event NewSaleListing(
        uint256 indexed _tokenId,
        uint256 _price,
        address indexed _seller,
        bool indexed _previouslyListed
    );

    mapping(uint256 => Item) itemsForSale;

    constructor() {
        reserveMain = msg.sender;
    }

    receive() external payable {}

    function addBuyer(bytes32 _identifier) internal {
        // add buyer or update identifier -- most recent identifier is only valid one
        if (!buyersByAddress[msg.sender].exists) {
            Buyer memory _buyer = Buyer(msg.sender, _identifier, true);
            buyersByIdentifier[_identifier] = _buyer;
            buyersByAddress[msg.sender] = _buyer;
        } else {
            buyersByIdentifier[_identifier].ethAddress = msg.sender;
            buyersByAddress[msg.sender].identifier = _identifier;
        }
    }

    function buy(uint256 _tokenId, bytes32 _identifier) public payable {
        // seller must be pre-approved
        require(ticket.getApproved(_tokenId) == address(this), "not for sale!");
        // buyer must have paid more than or equal to sale price
        require(msg.value >= itemsForSale[_tokenId].price);
        require(itemsForSale[_tokenId].forSale);
        address _owner = ticket.ownerOf(_tokenId);
        // add buyer identifier to database for collection of reservation at third party
        addBuyer(_identifier);
        ticket.transferFrom(_owner, msg.sender, _tokenId);
        itemsForSale[_tokenId].forSale = false;
        // fee for contract gas fees and site maintenance
        uint256 _toSeller = itemsForSale[_tokenId].price - fee;
        // transfer money to seller and add fee to fee collection variable
        payable(_owner).transfer(_toSeller);
        // add to a larger variable for any necessary withdrawal
        feeCollection += fee;
        emit ItemPurchased(_tokenId, _owner, msg.sender);
    }

    function sell(uint256 _tokenId, uint256 _price)
        public
        returns (bool _posted)
    {
        require(ticket.ownerOf(_tokenId) == msg.sender, "not yours to sell!");
        require(!itemsForSale[_tokenId].forSale, "already for sale!");
        // must approve via calling the nft contract directly first
        require(
            ticket.getApproved(_tokenId) == address(this),
            "must approve first!"
        );
        if (itemsForSale[_tokenId].previouslyListed) {
            itemsForSale[_tokenId].price = _price;
            itemsForSale[_tokenId].forSale = true;
            itemsForSale[_tokenId].timestampCurrentSale = block.timestamp;
            emit NewSaleListing(_tokenId, _price, msg.sender, true);
        } else {
            Item memory item = Item(
                _tokenId,
                _price,
                block.timestamp,
                block.timestamp,
                true,
                true
            );
            itemsForSale[_tokenId] = item;
            emit NewSaleListing(_tokenId, _price, msg.sender, false);
        }
        _posted = true;
    }

    // function for delisting an item from the marketplace
    function cancelSale(uint256 _tokenId) public returns (bool _cancelled) {
        require(ticket.ownerOf(_tokenId) == msg.sender, "not yours!");
        require(itemsForSale[_tokenId].forSale, "not a listed item!");
        itemsForSale[_tokenId].forSale = false;
        _cancelled = true;
    }

    function changePrice(uint256 _tokenId, uint256 _new_price)
        public
        returns (bool _changed)
    {
        require(ticket.ownerOf(_tokenId) == msg.sender, "not yours to sell!");
        require(itemsForSale[_tokenId].forSale, "not for sale!");
        itemsForSale[_tokenId].price = _new_price;
        itemsForSale[_tokenId].timestampCurrentSale = block.timestamp;
        _changed = true;
    }

    // get price of item
    function viewPrice(uint256 _tokenId) public view returns (uint256 _price) {
        require(itemsForSale[_tokenId].forSale);
        _price = itemsForSale[_tokenId].price;
    }

    // function for a seller to verify a ticket/reservation in person
    function verifyToken(bytes32 _inPersonHash, uint256 _tokenId)
        public
        view
        returns (bool _verified)
    {
        address _owner = ticket.ownerOf(_tokenId);
        bytes32 _identification = buyersByAddress[_owner].identifier;
        if (_inPersonHash == _identification) {
            _verified = true;
        } else {
            _verified = false;
        }
    }

    // function for a seller to verify a ticket/reservation in person
    function verifyAirdrop(bytes32 _inPersonHash, uint256 _tokenId)
        public
        view
        returns (bool _verified)
    {
        address _owner = airdrop.ownerOf(_tokenId);
        bytes32 _identification = buyersByAddress[_owner].identifier;
        if (_inPersonHash == _identification) {
            _verified = true;
        } else {
            _verified = false;
        }
    }
    // possibly add auction/dutch auction
}

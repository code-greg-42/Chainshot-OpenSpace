// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./SellerList.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ReserveNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    SellerList sellerList =
        SellerList(payable(0x997618b67B91C8b5651257580fe7A2Aa94410336));

    event TicketCreation(address indexed _by, uint256 indexed _id);

    mapping(address => uint256[]) public sellerCreatedIds;

    constructor() ERC721("ReserveNFT", "RSRV") {}

    receive() external payable {}

    function awardItem(string memory _tokenURI)
        public
        returns (uint256 _newItemId)
    {
        require(sellerList.isSeller(msg.sender));
        _tokenIds.increment();
        _newItemId = _tokenIds.current();
        _mint(msg.sender, _newItemId);
        _setTokenURI(_newItemId, _tokenURI);

        sellerCreatedIds[msg.sender].push(_newItemId);

        emit TicketCreation(msg.sender, _newItemId);
    }

    function nftListLength() public view returns (uint256 _length) {
        _length = sellerCreatedIds[tx.origin].length;
    }

    function getTokenAtIndex(uint256 _index) public view returns (uint256 _id) {
        _id = sellerCreatedIds[tx.origin][_index];
    }
}

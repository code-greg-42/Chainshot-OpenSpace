// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./SellerList.sol";
import "./VRFv2Consumer.sol";
import "./ReserveNFT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ReserveAirdrop is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    SellerList sellerList =
        SellerList(payable(0x997618b67B91C8b5651257580fe7A2Aa94410336));
    VRFv2Consumer vrf =
        VRFv2Consumer(0x65A64a17eEc885C0858CBB9fC55d17CB8e8e78bC);
    IERC721 reserveToken = IERC721(0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F);
    ReserveNFT reserveNFT =
        ReserveNFT(payable(0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F));

    constructor() ERC721("ReserveAirdrop", "RAIR") {}

    receive() external payable {}

    function generateWinner() public returns (bool _success) {
        require(sellerList.isSeller(msg.sender));
        vrf.requestRandomWords();
        _success = true;
    }

    function awardRandomWinner(string memory _tokenURI) public {
        // award a random winner
        require(sellerList.isSeller(msg.sender));
        uint256 totalNFTs = reserveNFT.nftListLength() - 1;
        uint256 _winningIndex = vrf.s_randomNumber() % totalNFTs;
        uint256 _winningId = reserveNFT.getTokenAtIndex(_winningIndex);
        address _winningAddress = reserveToken.ownerOf(_winningId);
        awardItem(_winningAddress, _tokenURI);
    }

    function awardItem(address _recip, string memory _tokenURI)
        public
        returns (uint256 _newItemId)
    {
        require(sellerList.isSeller(msg.sender));
        _tokenIds.increment();
        _newItemId = _tokenIds.current();
        _mint(_recip, _newItemId);
        _setTokenURI(_newItemId, _tokenURI);
    }
}

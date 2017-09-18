pragma solidity ^0.4.11;

import './SphereInterface.sol';
import '../dependencies/DBC.sol';
import '../dependencies/Owned.sol';


/// @title Sphere Contract
/// @author Melonport AG <team@melonport.com>
/// @notice Simple and static Sphere Module.
contract Sphere is SphereInterface, DBC, Owned {

    // FIELDS

    address public DATAFEED;
    address public EXCHANGE_ADAPTER;

    // CONSTANT METHODS

    function getDataFeed() external constant returns (address) { return DATAFEED; }
    function getExchangeAdapter() external constant returns (address) { return EXCHANGE_ADAPTER; }

    // NON-CONSTANT METHODS

    function Sphere(address ofDataFeed, address ofExchangeAdapter) {
        DATAFEED = ofDataFeed;
        EXCHANGE_ADAPTER = ofExchangeAdapter;
    }
}
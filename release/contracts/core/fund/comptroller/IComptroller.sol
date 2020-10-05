// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.8;

/// @title IComptroller Interface
/// @author Melon Council DAO <security@meloncoucil.io>
interface IComptroller {
    enum FundStatus {Pending, Active, Shutdown}

    function activate(address, bool) external;

    function addTrackedAsset(address) external;

    function approveAssetSpender(
        address,
        address,
        uint256
    ) external;

    function burnShares(address, uint256) external;

    function buyShares(
        address,
        uint256,
        uint256
    ) external payable returns (uint256);

    function destruct() external;

    function getVaultProxy() external view returns (address);

    function init(
        address,
        bytes calldata,
        bytes calldata
    ) external;

    function isReceivableAsset(address) external view returns (bool);

    function getRoutes()
        external
        view
        returns (
            address,
            address,
            address,
            address,
            address,
            address,
            address
        );

    function mintShares(address, uint256) external;

    function removeTrackedAsset(address) external;

    function shutdown() external;
}

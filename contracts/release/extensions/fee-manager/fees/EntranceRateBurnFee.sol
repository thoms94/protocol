// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.8;

import "./utils/EntranceRateFeeBase.sol";

/// @title EntranceRateBurnFee Contract
/// @author Melon Council DAO <security@meloncoucil.io>
/// @notice An EntranceRateFee that burns the fee
contract EntranceRateBurnFee is EntranceRateFeeBase {
    constructor(address _feeManager)
        public
        EntranceRateFeeBase(_feeManager, IFeeManager.SettlementType.Burn)
    {}

    /// @notice Provides a constant string identifier for a fee
    /// @return identifier_ The identifier string
    function identifier() external pure override returns (string memory identifier_) {
        return "ENTRANCE_RATE_BURN";
    }
}
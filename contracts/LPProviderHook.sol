//  Earn yield as a liquidity provider at Afriramp

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseHook} from "v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {LPFeeLibrary} from "v4-core/libraries/LPFeeLibrary.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/types/BeforeSwapDelta.sol";
import {SwapParams} from "v4-core/types/PoolOperation.sol";

contract OctantVaultHook is BaseHook {



// THE CORE IS GETTING PART OF THE GENERATED YIELD FROM AFRIRAMP LIQUIDITY POOL FEES TO REWARD LIQUIDITY PROVIDERS AND PUT THE REST INTO THE POOL



    using LPFeeLibrary for uint24;

    error MustUseDynamicFees();

    // The moving average gas price
    uint128 public movingAverageGasPrice;

    // The number of transactions recorded
    uint104 public movingAverageGasPriceCount;

    // The default fee of the pool
    uint24 public constant BASE_FEE = 5000; //0.5% of the gas price or fees
    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
        // TODO
        updateMovingAverage();
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        // TODO: Turn true the hooks to use.
                return(
            Hooks.Permissions({
                beforeInitialize: true,
                afterinItialize: false,
                beforeAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterAddLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: true,
                afterSwap: true,
                beforeDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false


            })
        );
    }

    function _beforeInitialize(address, PoolKey calldata key, uint160) internal pure override returns(bytes4) {
        // TODO: Validate the poolKeys being added
        // Does the poolkey support dynamic fees?
        if(key.fee.isDynamicFee()) {
            revert MustUseDynamicFees();
        }

        return (this.beforeInitialize.selector);
    }

    function _beforeSwap(address, PoolKey calldata key, SwapParams calldata, bytes calldata) internal view override returns(
        bytes4 selector_,
        beforeSwapDelta delta_,
        uint24 fee_
    ) {
        // TODO: Determine the fee paid for a swap
        uint24 fee = getFee();

        // Update the swap fee in the pool manager
        uint24 feeWithFlag = fee | LPFeeLibrary.OVERRIDE_FEE_FLAG;


        return (this.beforeSwap.selector , BeforeSwapDeltaLibrary.ZERO_DELTA, feeWithFlag);

    }

    function _afterSwap(address, PoolKey calldata, SwapParams calldata, BalanceDelta, bytes calldata) internal override returns() {
        // TODO: Update our internal moving average gas price.
        updateMovingAverage();

        return (this.afterSwap.selector, 0);
    }

        // Get the current gas price
        // Compare the current gas price to our moving average 
        // Calculate the amount of fees that should be charged (based on current gas price <> moving average)
    function getFee() internal view returns (uint24) {
        // Fees are always defined as uint24
        uint128 gasPrice = uint128(tx.gasPrice);

        // Gas price > moving average by threshold
        if(gasPrice > (movingAverageGasPrice * 110) / 100) { // a 10% threshold
            return BASE_FEE / 2;

        }
        // Gas price < moving average by threshold
        else if(gasPrice < (movingAverageGasPrice * 90) / 100 ) {
            return BASE_FEE * 2;
        }
        // Gas price within moving average threshold
        else {
            return BASE_FEE;
        }
    }
    // Update our moving average gas price
    function updateMovingAverage() internal {
        // Get current gas price
        uint128 gasPrice = uint128(tx.gasprice);

        // Update the moving average
        // ((OLD_AVERAGE * # of transactions tracked) + Current gas price) / (# of transactions tracked + 1)
        movingAverageGasPrice = ((movingAverageGasPrice * movingAverageGasPriceCount) + gasPrice) / (movingAverageGasPriceCount + 1);

        // Increase the number of txns counted
        ++movingAverageGasPriceCount;
    }

}

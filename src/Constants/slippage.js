import { ChainID } from "./mains"

export const RouterAddress = {
    JOE: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", // Avalanche mainnet
    PNG: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106", // Avalanche mainnet
    LYD: "0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27", // Avalanche mainnet
}

export const Tokens = {
    USDT: {
        [ChainID.AVALANCHE]: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
    },
    USDC: {
        [ChainID.AVALANCHE]: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
    },
    DAI: {
        [ChainID.AVALANCHE]: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
    },
    WAVAX: {
        [ChainID.AVALANCHE]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
    }
}
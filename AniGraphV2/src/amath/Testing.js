export const VecEqual = {
    VecEqual(received, other, msg) {
        const pass = received.equalTo(other);
        if (pass) {
            return {
                message: () =>
                    `expected ${other} == ${received}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n`+msg,
                pass: false,
            };
        }
    }
}

// writing a custom expect jest test... for matrices
export const MatrixEqual = {
    MatrixEqual(received, other, msg) {
        const pass = received.equalTo(other);
        if (pass) {
            return {
                message: () =>
                    `expected ${received} == ${other}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${other.toString()}, got ${received.toString()}\n`+msg,
                pass: false,
            };
        }
    },
}
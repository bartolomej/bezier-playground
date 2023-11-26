export class Utils {
    static factorial (n) {
        if (n === 0) return 1;
        return n * this.factorial(n - 1);
    }

    static binomial (n, k) {
        return this.factorial(n) / (this.factorial(k) * this.factorial(n - k))
    }

    /**
     * @param arrays {Array[]}
     */
    static zip(...arrays) {
        let zipped = [];
        const maxLength = Math.max(...arrays.map(a => a.length));
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < arrays[i].length; j++) {
                zipped.push(arrays[i][j])
            }
        }
        return zipped;
    }
}

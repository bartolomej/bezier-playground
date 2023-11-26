export class Utils {
    static factorial (n) {
        if (n === 0) return 1;
        return n * this.factorial(n - 1);
    }

    static binomial (n, k) {
        return this.factorial(n) / (this.factorial(k) * this.factorial(n - k))
    }
}

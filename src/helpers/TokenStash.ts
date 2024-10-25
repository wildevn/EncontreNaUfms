type TokenNode = {
  token: number;
  expirationDate: Date;
  userEmail: string;
};

const tenMinutes = 600000;
const oneHour = 3600000;

class TokenStash {
  private tokenList: Array<TokenNode>;

  constructor() {
    this.tokenList = [];
    this.nodeCleaner();
  }

  generateToken(userEmail: string): number {
    const token = Number.parseInt(Math.random().toString(7).substring(9, 15));
    const expirationDate = new Date(new Date().getTime() + tenMinutes);

    this.tokenList.push({ token, expirationDate, userEmail });
    return token;
  }

  tokenVerifier(token: number, userEmail: string): boolean {
    const node = this.tokenList.find(
      (item) => item.token === token && item.userEmail === userEmail,
    );

    if (node) {
      this.tokenList = this.tokenList.filter(
        (item) => item.token === token && item.userEmail === userEmail,
      );

      if (new Date() <= node.expirationDate) {
        return true;
      }
    }
    return false;
  }

  nodeCleaner(): void {
    setInterval(() => {
      this.tokenList = this.tokenList.filter(
        (node) => new Date() < node.expirationDate,
      );
    }, oneHour);
  }
}

const tokenStash = new TokenStash();

export default tokenStash;

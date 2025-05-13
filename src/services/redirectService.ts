export interface IRedirectService {
  setRedirect(username: string, url: string): void;
  getRedirect(username: string): string;
  resetRedirect(username: string): void;
}

export class RedirectService implements IRedirectService {
  private redirectMap = new Map<string, string>();
  private defaultRedirect: string;

  constructor(defaultRedirect: string) {
    this.defaultRedirect = defaultRedirect;
  }

  resetRedirect(username: string): void {
    this.redirectMap.delete(username);
  }

  setRedirect(username: string, url: string): void {
    this.redirectMap.set(username, url);
  }

  getRedirect(username: string): string {
    const redirect = this.redirectMap.get(username);

    if (redirect === undefined) {
      return this.defaultRedirect;
    }
    return redirect;
  }
}

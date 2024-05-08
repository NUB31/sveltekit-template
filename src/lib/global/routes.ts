class ApiRoutes {
	v1Base = '/api/v1';
	logout = `${this.v1Base}/logout`;
	upload = `${this.v1Base}/upload`;
	account = `${this.v1Base}/account`;
}

export class Routes {
	static root = '/';
	static home = '/';
	static about = '/about';
	static login = '/login';
	static signup = '/signup';
	static verify = '/signup/verify';
	static account = '/account';
	static settings = '/account/settings';
	static api = new ApiRoutes();
}

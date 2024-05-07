class ApiRoutes {
	v1Base = '/api/v1';
	login = `${this.v1Base}/login`;
	logout = `${this.v1Base}/logout`;
	signup = `${this.v1Base}/signup`;
	sendVerification = `${this.v1Base}/sendVerification`;
	upload = `${this.v1Base}/upload`;
	myAccount = `${this.v1Base}/user/me`;
	verify = `${this.v1Base}/verify`;
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

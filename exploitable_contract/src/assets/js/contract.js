
window.user = null;

export function login(){
	window.user="asdf";
	return {tickets: 500, money: 20};
}

export function logout(){
	window.user = null;
}
export function getPoolInfo(){
	return {
		totalTickets: 5000,
		totalUsers: 20,
		totalMoney: 5100,
		closingDate: new Date(new Date().getTime()+(5*24*60*60*1000)),
	}
}
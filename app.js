window.onload = function(){

	hotelAdvisorDB.open(1,'users');
	hotelAdvisorDB.open(1,'reviews');

	function logIn(user){
		localStorage.setItem("user", user.email);
		window.location.replace('account.html');
		return false;
	};

	function displayAccount(user){
		console.log(user);
		$('#accountFirstName').val(user.first_name);
		$('#accountLastName').val(user.last_name);
		$('#accountEmail').val(user.email);
		$('#accountPassword').val(user.password);
		$('#accountPasswordVerification').val(user.password);
	};

	if (window.location.pathname.indexOf('account.html') > -1) {
		//check if we have a logged in user
		var email = localStorage.getItem("user");
		if(email){
			hotelAdvisorDB.open(1,'users',function(){
				hotelAdvisorDB.getUser(email,function(user){
					displayAccount(user);
				});
			});
		}

		else {
			window.location.replace('login.html');
		}
	}


	var adminMenu = '<li><a href="admin.html">View all reviews</a></li><li><a href="account.html">My Account</a></li><li><a id="logout" href="#">Log out</li>';
	var loggedUserMenu = '<li><a href="account.html">My Account</a></li><li><a id="logout" href="#">Log out</li>';
	var defaultMenu = '<li><a href="login.html">Login</a></li><li><a href="login.html">Register</a></li>';

	var registerForm = $('#register');
	var menu = $('#menu');


	var loggedUser = localStorage.getItem("user");
	if (loggedUser === 'admin@test.com'){
		menu.html(adminMenu);
	}

	else if (loggedUser) {
		menu.html(loggedUserMenu);
	}


	//Event Listeners
	$('#logout').on('click', function() {
	  	localStorage.removeItem("user");
		menu.html(defaultMenu);
		window.location.replace('login.html');
	});

	$('#login').on('submit', function(){
		var email = $('#loginEmail').val();
		hotelAdvisorDB.open(1,'users',function(){
			hotelAdvisorDB.getUser(email,function(user){
				logIn(user);
			});
		});
	});

	$('#register').on('submit',function(e){
		e.preventDefault();
		var firstName = $('#firstNameRegister').val();
		var lastName = $('#lastNameRegister').val();
		var email = $('#emailRegister').val();
		var password = $('#passwordRegister').val();

		hotelAdvisorDB.createUser(firstName,lastName,email,password,function(user){
			logIn(user);
		});
	});

	$('#account').on('submit',function(e){
		e.preventDefault();
		var firstName = $('#accountFirstName').val();
		var lastName = $('#accountLastName').val();
		var email = $('#accountEmail').val();
		var password = $('#accountPassword').val();

		hotelAdvisorDB.createUser(firstName,lastName,email,password,function(user){
			console.log('account updated');
		});
	});




};
window.onload = function(){
	var adminMenu = '<li><a href="admin.html">View all reviews</a></li><li><a href="account.html">My Account</a></li><li><a id="logout" href="#">Log out</li>';
	var loggedUserMenu = '<li><a href="account.html">My Account</a></li><li><a id="logout" href="#">Log out</li>';
	var defaultMenu = '<li><a href="login.html">Login</a></li><li><a href="login.html">Register</a></li>';

	var registerForm = $('#register');
	var menu = $('#menu');
	var hotelName = $('body').attr('id');
	var addReviewForm = $('#addReview');

	var loggedUser = localStorage.getItem("user");

	if (loggedUser === 'admin@test.com'){
		menu.html(adminMenu);
	}

	else if (loggedUser) {
		menu.html(loggedUserMenu);
	}

	hotelAdvisorDB.open(1,'users');
	hotelAdvisorDB.open(1,'reviews');

	function logIn(user){
		localStorage.setItem("user", user.email);
		window.location.replace('account.html');
		return false;
	};

	function displayAccount(user){
		$('#accountFirstName').val(user.first_name);
		$('#accountLastName').val(user.last_name);
		$('#accountEmail').val(user.email);
		$('#accountPassword').val(user.password);
		$('#accountPasswordVerification').val(user.password);
	};

	function displayReviews(reviews){
		var output = '';
		var reviewsContainer = $('#reviews');

		for (var i = 0; i < reviews.length; i++) {
			if(reviews[i].status === 'approved'){
				output += "<div class='review'><p>"+reviews[i].review+"</p><p class='meta'>Star Rating: "+reviews[i].rating+" star(s)</p></div>";
			}

			else if(reviews[i].user === loggedUser){
				output += "<div class='review'><p><strong>Your review is awaiting moderation:</strong></p><p>"+reviews[i].review+"</p><p class='meta'>Star Rating: "+reviews[i].rating+" star(s)</p></div>";
				addReviewForm.remove();
			}
		}

		reviewsContainer.html(output);

	};

	//logic for account page
	if (window.location.pathname.indexOf('account.html') > -1) {
		//check if we have a logged in user
		
		if(loggedUser){
			hotelAdvisorDB.open(1,'users',function(){
				hotelAdvisorDB.getUser(loggedUser,function(user){
					displayAccount(user);
				});
			});
		}

		else {
			window.location.replace('login.html');
		}
	}
	//logic for hotel page
	else if(hotelName) {
		hotelAdvisorDB.open(1,'reviews',function(){

			//get all approved reviews
			hotelAdvisorDB.fetchReviews('hotel',hotelName,null,function(reviews){
				displayReviews(reviews);
			});

			//get all pending reviews
		});

		if(!loggedUser){
			addReviewForm.after('<p><a href="login.html">Log in</a> to add review</p>')
			addReviewForm.remove();
		}

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

		hotelAdvisorDB.open(1,'users',function(){
			hotelAdvisorDB.createUser(firstName,lastName,email,password,function(user){
				logIn(user);
			});
		});
	});

	$('#account').on('submit',function(e){
		e.preventDefault();
		var firstName = $('#accountFirstName').val();
		var lastName = $('#accountLastName').val();
		var email = $('#accountEmail').val();
		var password = $('#accountPassword').val();

		hotelAdvisorDB.open(1,'users',function(){
			hotelAdvisorDB.createUser(firstName,lastName,email,password,function(user){
				console.log('account updated');
			});
		});
	});

	$('#addReview').on('submit',function(e){
		var review = $('#reviewText').val();
		var rating = $('#reviewStarRating').val();

		hotelAdvisorDB.createReview(review,rating,hotelName,loggedUser,'pendingReview',function(review){
			console.log('review added');
		});
	});




};
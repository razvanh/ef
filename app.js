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
		var reviewed = false;

		for (var i = 0; i < reviews.length; i++) {
			if(reviews[i].status === 'approved'){
				if (reviews[i].user === loggedUser) reviewed = true;
				output += "<div class='review'><p>"+reviews[i].review+"</p><p class='meta'>Star Rating: "+reviews[i].rating+" star(s)</p></div>";
			}

			else if(reviews[i].user === loggedUser){
				output += "<div class='review'><p><strong>Your review is awaiting moderation:</strong></p><p>"+reviews[i].review+"</p><p class='meta'>Star Rating: "+reviews[i].rating+" star(s)</p></div>";
				addReviewForm.remove();
			}

		}
		if (reviewed === true) {
			addReviewForm.remove();
			output += "<p>You can only submit one review for a hotel.</p>";
		}
		reviewsContainer.html(output);

	};

	function displayAdminReviews(reviews){
		var output = '';
		var reviewsContainer = $('#admin');
		for (var i = reviews.length - 1; i >= 0; i--) {
			output += "<form class='pending-review' action='#' data-review-hotel="+reviews[i].hotel+" data-review-id="+reviews[i].id+" data-review-user="+reviews[i].user+" data-review-rating="+reviews[i].rating+"><p>Star rating:"+reviews[i].rating+"</p><p><textarea>"+reviews[i].review+"</textarea></p><p><button>Approve</button><p></form>"
		}
		if (reviews.length > 0) {
			reviewsContainer.html(output);
		}
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

	//logic for admin page
	else if (window.location.pathname.indexOf('admin.html') > -1) {
		
		if (loggedUser === 'admin@test.com') {
			hotelAdvisorDB.open(1,'reviews',function(){
				hotelAdvisorDB.fetchReviews(null,null,'pendingReview',function(reviews){
					displayAdminReviews(reviews);
				});
			});
		}

		else {
			window.location.replace('login.html');
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
		if ($('#register').valid()) {
		var firstName = $('#firstNameRegister').val();
		var lastName = $('#lastNameRegister').val();
		var email = $('#emailRegister').val();
		var password = $('#passwordRegister').val();

		hotelAdvisorDB.open(1,'users',function(){
			hotelAdvisorDB.createUser(firstName,lastName,email,password,function(user){
				logIn(user);
			});
		});
		}
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

		if ($('#addReview').valid()) {
			var review = $('#reviewText').val();
			var rating = $('#reviewStarRating').val();

			hotelAdvisorDB.createReview(review,rating,hotelName,loggedUser,'pendingReview',function(review){
				console.log('review added');
			});
		}
	});


	$('#admin').on('submit','form',function(e){
		e.preventDefault();

		var hotel = $(this).attr('data-review-hotel');
		var id = $(this).attr('data-review-id');
		var rating = $(this).attr('data-review-rating');
		var status = 'approved';
		var user = $(this).attr('data-review-user');
		var text = $(this).find('textarea').val();

		var review = {
			'review': text,
			'id': Number(id),
			'rating': rating,
			'hotel':hotel,
			'user':user,
			'status':'approved'
		};

		hotelAdvisorDB.open(1,'reviews',function(){
			hotelAdvisorDB.updateReview(review,function(){
				location.reload();
			});
		});
		
	});

	//Form Validation
	$("#register").validate({
		// Specify validation rules
		rules: {
		  // The key name on the left side is the name attribute
		  // of an input field. Validation rules are defined
		  // on the right side
		  firstNameRegister: {
		  	required: true,
		  	maxlength: 100
		  },
		  lastNameRegister: {
		  	required: true,
		  	maxlength: 100
		  },
		  emailRegister: {
		    required: true,
		    // Specify that email should be validated
		    // by the built-in "email" rule
		    email: true
		  },
		  passwordRegister: {
		  	required:true,
		    minlength: 8
		  },
		  confirmPasswordRegister: {
		  	required:true,
		    minlength: 8,
		    equalTo: '#passwordRegister'
		  }
		},
		// Specify validation error messages
		messages: {
		  firstNameRegister:{
		  	required:  "Please enter your first name",
		  	maxlength: "First name must not exceed 100 characters"
		  },
		  lastNameRegister: {
		  	required:  "Please enter your last name",
		  	maxlength: "Last name must not exceed 100 characters"
		  },
		  passwordRegister: {
		    required: "Please provide a password",
		    minlength: "Your password must be at least 8 characters long"
		  },
		  confirmPasswordRegister: {
		    required: "Please verify your password",
		    minlength: "Your password must be at least 8 characters long",
		    equalTo: "Password verification does not match"
		  },
		  emailRegister: "Please enter a valid email address"
		}
	});

	$("#addReview").validate({
		// Specify validation rules
		rules: {
		  // The key name on the left side is the name attribute
		  // of an input field. Validation rules are defined
		  // on the right side
		  review: {
		  	required: true,
		  	maxlength: 500,
		  	minlength: 100
		  },
		  reviewStarRating: {
		  	required: true		  }
		},
		// Specify validation error messages
		messages: {
		  review:{
		  	required:  "Please enter a review",
		  	maxlength: "Review must not exceed 500 characters",
		  	minlength: "Review must be more than 100 characters"
		  },
		  reviewStarRating: {
		  	required:  "Please select your rating",
		  }
		}
	});



};
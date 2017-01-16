var hotelAdvisorDB = (function(){
	var hADB = {};
	var datastore = null;
	/*=================================
	* Open connection to datastore
	================================= */

	hADB.open = function(version,objectStoreName,callback) {
		//open connection to datastore
		var request = indexedDB.open(objectStoreName, version);

		//Datastore upgrades. This is run the first time and when 
		//upgrading version
		request.onupgradeneeded = function(e){
			var db = e.target.result;
			e.target.transaction.error = hADB.onerror;

			//Delete old datastore
			if (db.objectStoreNames.contains(objectStoreName)) {
				db.deleteObjectStore(objectStoreName);
			}

			if (objectStoreName === 'users') {
				//Create new Datastore
				var store = db.createObjectStore(objectStoreName,{keyPath:'email'});

				var admin = {
				'first_name': 'Razvan',
				'last_name': 'Horeanga',
				'email':'admin@test.com',
				'password':'password1',
				'admin':true
				};

				store.add(admin);
			}

			else {
				var store = db.createObjectStore(objectStoreName,{keyPath:'id',autoIncrement:true});
			}

		};

		request.onsuccess = function(e){
			//Get a reference to the DB
			datastore = e.target.result;

			//execute the callback
			if(callback) callback();
		};

		request.onerror = hADB.onerror;
		console.log(hADB.onerror);
	};

	hADB.createUser = function(fName,lName,email,password,callback) {
		//get a reference 
		var db = datastore;

		//initiate new transaction
		var transaction = db.transaction(['users'],'readwrite');

		//Get the datastore
		var objStore = transaction.objectStore('users');

		//create user object
		var user = {
			'first_name': fName,
			'last_name': lName,
			'email':email,
			'password':password
		};

		var request = objStore.put(user);

		//Handle successful datastore put
		request.onsuccess = function(e){
			callback(user);
		};

		//Handle error
		request.onerror = hADB.onerror;
	};

	hADB.getUser = function(email,callback){
		//get a reference 
		var db = datastore;
		//initiate new transaction
		var transaction = db.transaction(['users'],'readwrite');

		//Get the datastore
		var objStore = transaction.objectStore('users');

		var request = objStore.get(email);

		request.onsuccess = function(e){
			callback(request.result);
		}

		request.onerror = hADB.onerror;
	};

	hADB.createReview = function(review,rating,hotel,user,status,callback) {
		//get a reference 
		var db = datastore;

		//initiate new transaction
		var transaction = db.transaction(['reviews'],'readwrite');

		//Get the datastore
		var objStore = transaction.objectStore('reviews');

		//create review object
		var review = {
			'review': review,
			'rating': rating,
			'hotel':hotel,
			'user':user,
			'status':status
		};

		var request = objStore.put(review);

		//Handle successful datastore put
		request.onsuccess = function(e){
			callback(review);
		};

		//Handle error
		request.onerror = hADB.onerror;
	};

	hADB.fetchReviews = function(property,propertyValue,status,callback){
		var db = datastore;
		var transaction = db.transaction(['reviews'],'readwrite');
		var objStore = transaction.objectStore('reviews');

		var keyRange = IDBKeyRange.lowerBound(0);
		var cursorRequest = objStore.openCursor(keyRange);

		var reviews = [];

		transaction.oncomplete = function(e){
			callback(reviews);
		};

		cursorRequest.onsuccess = function(e){
			var result = e.target.result;
			if(!!result === false){
				return;
			}

			if (property === 'user' && result.value.user === propertyValue && result.value.status === status) reviews.push(result.value);
			else if(property === 'hotel' && result.value.hotel === propertyValue) reviews.push(result.value);
			else if(property === null && result.value.status === status) reviews.push(result.value);

			result.continue();
		}
		cursorRequest.onerror = hADB.onerror;
	};

	hADB.updateReview = function(review,callback){
		//get a reference 
		var db = datastore;

		//initiate new transaction
		var transaction = db.transaction(['reviews'],'readwrite');

		//Get the datastore
		var objStore = transaction.objectStore('reviews');

		var request = objStore.put(review);

		//Handle successful datastore put
		request.onsuccess = function(e){
			callback(review);
		};

		//Handle error
		request.onerror = hADB.onerror;
	};

	return hADB;
}());
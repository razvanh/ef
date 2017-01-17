# Hotel Advisor

The app can be tested here: https://razvanh.github.io/ef/


## Admin Account

When the app is loaded in the browser for the first time, an admin account is created:
user: admin@test.com
pass: password1

## Create a new user account/log in

In order to create reviews, you need to be an authenticated user. You can register/login here:
https://razvanh.github.io/ef/login.html

Once logged in , you can [update your account](https://razvanh.github.io/ef/account.html) details or add a 
review for one of the hotels: [pop](https://razvanh.github.io/ef/pop.html), [rock](https://razvanh.github.io/ef/rock.html), 
[jazz](https://razvanh.github.io/ef/jazz.html).

Once you submit the review, you can see that it is awaiting moderation and it will be hidden for other users or unauthenticated visitors.

## Moderating reviews

The admin can moderate the reviews on the [admin page](https://razvanh.github.io/ef/admin.html). The body of each review can be edited
efore being approved. Once a review is approved, it will show up on the hotel page for everyone.

## Technology used

All the data is stored using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) and [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
so it is tied to the browser used.

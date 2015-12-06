(function(){
	var app = angular.module('KittySitter', ['ngRoute', 'ngCookies']);

	var verify = function(userName, password, reenter){
		if(userName != '' && password != '' && reenter !=''){
			if(userName.length < 6)
				return 'Sorry, the username has to be at least 6 chareacters';
			if(password.length < 6)
				return 'Sorry, the password has to be at least 6 chareacters';
			if(password != reenter)
				return 'the passwords do not match';
			return true;
		}else{
			return 'Please fill out all fileds';
		}
	}

	app.service('userSignupLogin', ['$http', '$cookies','$window', function($http, $cookies, $window){
			var setCookie = function(userName, saltHash, rememberMe){
				if (rememberMe){
					var expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 7);
						console.log('set cookie' + expireDate.toString());
					$cookies.put('saltHash',saltHash, {'expires': expireDate});
					$cookies.put('userName',userName, {'expires': expireDate});
				}
				else{
					$cookies.put('userName',userName);
					$cookies.put('saltHash',saltHash);
				}
			}
			this.postUser = function($scope, url, userInfo, func){
				$http.post(url, {userName: userInfo.userName, password: userInfo.password}).then(
					function(response) {
						var responseData = angular.fromJson(response.data);
						if (responseData['status'] == 'failed'){
							$scope.status = 'failed';
							$scope.error = responseData['error'];
						}else{
								if(func == "signin"){
									setCookie(responseData['userName'], responseData['saltHash'], userInfo.rememberMe);
								}else{
									setCookie(responseData['userName'], responseData['saltHash']);
								}
								$window.location.reload();
						}
					},
					function(response) {
						$location.path( "/error/" + response.status.toString());
					}
				);
			}
	}]);


	app.controller('navbarController', ['$scope', '$cookies', '$window', function($scope, $cookies, $window){
		$scope.userName = $cookies.get('userName');

		$scope.displayUserName = function(){
			return $scope.userName ? $scope.userName : 'Log in';
		}

		$scope.userControlForm = function(){
			if ($scope.userName){
				return '/templates/userDropdown.html';
			}else{
				return '/templates/loginDropdown.html';
			}
		}

		$scope.logout = function(){
			$cookies.remove('saltHash');
			$cookies.remove('userName');
			$window.location.reload();
		}

	}]);

	app.controller('LoginController', ['$scope', '$http', '$window', '$cookies', '$location', 'userSignupLogin', function($scope, $http, $window, $cookies, $location, userSignupLogin){
		$scope.loginURL = "/auth/login";
		$scope.status = 'Depending';
		$scope.loginError = 'None';

		$scope.login = function(){
			$scope.status = 'Depending';
			$scope.error = 'None';
			userSignupLogin.postUser($scope, $scope.loginURL, {userName: $scope.userName, password: $scope.password, rememberMe: $scope.rememberMe}, 'login');
		}
	}]);

  app.controller('SignupController', ['$scope', '$http', '$window', '$cookies', '$location', 'userSignupLogin', function($scope, $http, $window, $cookies, $location, userSignupLogin){
		$scope.signupURL = "/auth/signup";
		$scope.status = 'Depending';
		$scope.reenterStatus = 'Depending';
		$scope.loginError = 'None';

		$scope.reenterVerify = function(){
			return (!$scope.signupForm.reenter.$error.required  && $scope.reenterPassword != $scope.password) ? true : false;
		}

		$scope.signup = function(){
			$scope.status = 'Depending';
			$scope.error = 'None';
			var result = verify($scope.userName, $scope.password, $scope.reenterPassword);
			if (result == true){
				userSignupLogin.postUser($scope, $scope.signupURL, {userName: $scope.userName, password: $scope.password}, 'signup');
	    }else{
      	$scope.status = 'failed';
      	$scope.error = result;
      }
		}
  	}]);
})();

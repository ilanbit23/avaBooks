
'use strict';

angular.module('myApp.view2', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/add-book', {
      templateUrl: 'add-book/add-book.html',
      controller: 'AddBookCtrl'
    });
  }])


  .controller('AddBookCtrl', ['$scope', 'WizardHandler', '$timeout', function ($scope, WizardHandler, $timeout) {
    $scope.hideAddNewSubgenre = 'true';
    $scope.newSubGenre = {name: '', isDescriptionRequired:false};

    // Note: I'm using $timeout here instead of $q, just to make things simpler
    // and to force angular to diagest (usually $http would do that)
    getGenres()
      .then(genres => {
        $timeout(() => {
          $scope.genres = genres
        }, 0)
        
      })
    $scope.book = getEmptyBook();

    $scope.selectGenre = (genre) => {
      $scope.book.genreId = genre.id;
      $scope.selectedGenre = genre;
    }
    $scope.selectSubGenre = (subGenre) => {
      $scope.book.subGenreId = subGenre.id;
    }
    $scope.showAddSubGenre = () => {
      $scope.hideAddNewSubgenre = 'false';
      $timeout(() => {
        WizardHandler.wizard().next();
      }, 0)
    }
    $scope.addSubgenre = () => {
      addSubgenre($scope.selectedGenre.id, $scope.newSubGenre)
        .then(subGenre => {
          $timeout(() => {
            $scope.book.subGenreId = subGenre.id
            WizardHandler.wizard().next();
          }, 0)
        })
    }

    $scope.addBook = () => {
      $scope.addedBook = $scope.book;
      saveBook($scope.book)
        .then(addedBook => {
          $scope.addedBook = addedBook
          $scope.book = getEmptyBook();
          getBooks()
            .then(books => $scope.books = books)
        })
    }
    $scope.resetWizard = () => {
      $scope.addedBook = null;
      $scope.selectedGenre = null;
    }
  }]);
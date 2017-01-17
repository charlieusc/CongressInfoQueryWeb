var legJson;
var billJson;
var comJson;
var preurl = '/W7y32hzsffewh387SFD/Homework8';

function toCode(myCode) {
	return "<pre><code>" + myCode + "</code></pre>";
}

var app = angular.module("myApp", ['angularUtils.directives.dirPagination']);
app.controller("myCtrl", function ($scope, $sce, $http) {
	
	$http.get(preurl + '/Homework8.php?q=leg&id=0').then(function(response) {
		$scope.legislators = response.data.results;
		//window.alert(JSON.stringify($scope.legislators));
	});
	
	$http.get(preurl + '/Homework8.php?q=activebills&id=0').then(function(response) {
		$scope.activebills = response.data.results;
	});
	$http.get(preurl + '/Homework8.php?q=newbills&id=0').then(function(response) {
		$scope.newbills = response.data.results;
	});
	$http.get(preurl + '/Homework8.php?q=com&id=0').then(function(response) {
		$scope.coms = response.data.results;
	});


	$scope.chamberImg = function($chamber){
			if ($chamber == "house") {
				return "h.png" ;
			} else if ($chamber == "senate"){
				return "s.svg";
			}
	};

	$scope.detail;
	$scope.detail2;
	$scope.favLeg;
	$scope.favBil;
	$scope.favCom;

	$scope.calculateDuration = function() {
		var today = moment(new Date());
		var startDay = moment($scope.detail.term_start, "YYYY-MM-DD");
		var endDay = moment($scope.detail.term_end, "YYYY-MM-DD");
		var temp = today.diff(startDay, 'days');
		var dura = endDay.diff(startDay, 'days');
		if (temp <= 0 || dura <= 0) {
			return 0;
		} else if (temp > dura) {
			return 100;
		} else {
			return Math.round(temp / dura * 100);
		}

	}
	$scope.setDetail = function($d) {
		$scope.detail = $d;
		$http.get(preurl + '/Homework8.php?q=legcom&id=' + $scope.detail.bioguide_id).then(function(response) {
			$scope.legcom = response.data.results;
			$scope.refreshFavList();
			$scope.detail.dur = $scope.calculateDuration();
			$(".slide").carousel(1);
    		//$(".slide").carousel("pause");
    		$(".slide3").carousel(1);
    		//$(".slide3").carousel("pause");
		});
		
		$http.get(preurl + '/Homework8.php?q=legbill&id=' + $scope.detail.bioguide_id).then(function(response) {
			$scope.legbill = response.data.results;
		});
	};

	$scope.setDetail2 = function($d) {
		$scope.detail2 = $d;
		$http.get(preurl + '/Homework8.php?q=getpdf&id=' + $scope.detail2.last_version.urls.pdf, {responseType:'arraybuffer'}).success(function (response) {
			var file = new Blob([(response)], {type: 'application/pdf'});
			var fileURL = URL.createObjectURL(file);
			$scope.pdffile = $sce.trustAsResourceUrl(fileURL);
			//window.alert("getpdf!");
			$scope.refreshFavList();

			//$scope.detail2.introduced_on = $scope.timeFormat($scope.detail2.introduced_on);

			$(".slide2").carousel(1);
    		//$(".slide2").carousel("pause");
    		$(".slide3").carousel(2);
    		//$(".slide3").carousel("pause");
		});
		
	};

	$scope.saveToLocal = function($flag, $data) {
		//var datas = JSON.stringify($data);
		var arr = JSON.parse(localStorage.getItem($flag));
		var star = JSON.parse(localStorage.getItem("sta"));
		var data_id;
		if ($flag == "leg") {
			data_id = $data.bioguide_id;
		} else if ($flag == "bil"){
			data_id = $data.bill_id;
		} else {
			data_id = $data.committee_id;
		}
		arr[data_id] = $data;
		star[data_id] = true;
		localStorage.setItem($flag, JSON.stringify(arr));
		localStorage.setItem("sta", JSON.stringify(star));
		$scope.refreshFavList();
		//window.alert(localStorage.getItem($flag));
	};

	$scope.delFromLocal = function($flag, $id) {
		var arr = JSON.parse(localStorage.getItem($flag));
		var star = JSON.parse(localStorage.getItem("sta"));
		delete arr[$id];
		delete star[$id];
		localStorage.setItem($flag, JSON.stringify(arr));
		localStorage.setItem("sta", JSON.stringify(star));
		$scope.refreshFavList();
	};

	$scope.refreshFavList = function() {
		$scope.favLeg = JSON.parse(localStorage.getItem("leg"));
		$scope.favBil = JSON.parse(localStorage.getItem("bil"));
		$scope.favCom = JSON.parse(localStorage.getItem("com"));
		$scope.favSta = JSON.parse(localStorage.getItem("sta"));
		$scope.refreshStar();
	};

	$scope.refreshStar = function() {
		$(".glyphicon-star-empty").css("color", "black");
		for (var key in $scope.favSta) {
			$(".star_" + key).css("color", "yellow");
		}
		//window.alert("star");
	};
});

app.filter('dateFormater', function() {
	return function(input) {
		return moment(input, "YYYY-MM-DD").format("MMM DD, YYYY");
	}
});

app.filter('isBillActive', function() {
    return function(input) {
      return (input == true) ? "Avtive" : 'New';
    }
});

app.filter('firstLetterCapitalize', function() {
    return function(input) {
      return (input != null) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.filter('whatParty', function() {
	return function(input) {
		if (input == "R") {
			return "Republic";
		} else if (input == "D"){
			return "Democrat";
		} else {
			return "Independent";
		}
	}
});

app.filter('hasDistrict', function() {
    return function(input) {
      return (input != null) ? "District " + input : "N.A";
    }
});

app.filter('hasValue', function() {
	return function(input) {
		return (input != null) ? input : "N.A";
	}
});

function carouselPrev () {
    $(".slide").carousel(0);
    //$(".slide").carousel("pause");
    $(".slide2").carousel(0);
    //$(".slide2").carousel("pause");
    $(".slide3").carousel(0);
    //$(".slide3").carousel("pause");
}


function navPage (link) {
	$(".content").hide();
    //window.alert(link);
    $(link).show();
    carouselPrev ();
}

$(document).ready(function(){
	carouselPrev();
	var legArr = {};
	var bilArr = {};
	var comArr = {};
	var starArr = {};
	if (localStorage.getItem('leg') == null) {
		localStorage.setItem('leg', JSON.stringify(legArr));
	}
	if (localStorage.getItem('bil') == null) {
		localStorage.setItem('bil', JSON.stringify(bilArr));
	}
	if (localStorage.getItem('com') == null) {
		localStorage.setItem('com', JSON.stringify(comArr));
	}
	if (localStorage.getItem('sta') == null) {
		localStorage.setItem('sta', JSON.stringify(starArr));
	}
	//localStorage.setItem('leg', JSON.stringify(legArr));
	//localStorage.setItem('bil', JSON.stringify(bilArr));
	//localStorage.setItem('com', JSON.stringify(comArr));
	//localStorage.setItem('sta', JSON.stringify(starArr));
});

function hideNavBar () {
	if ($(".navbar").css("display") == "none") {
		$("#contentfield").removeClass("col-lg-12 col-md-12 col-sm-12 col-xs-12").addClass("col-lg-10 col-md-10 col-sm-10 col-xs-10");
		$(".navbar").css("display", "block");
	} else {
		$(".navbar").css("display", "none");
		$("#contentfield").removeClass("col-lg-10 col-md-10 col-sm-10 col-xs-10").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12");
	}
	
}
















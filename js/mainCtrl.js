clubTortank.controller('mainCtrl', ['$scope','$http','$filter','$timeout','$interval', function($scope, $http, $filter, $timeout,$interval) {
	var vm = this;
	vm.timerIsRunning = false;
	vm.countDownIsRunning = false;
	vm.timeTotal = 0;
	vm.timeCountDown = 0;
	vm.timeRemaining = 0;
	vm.timeStamps = [];
	vm.ticks = [];
	vm.bip = new Audio("./bonus/bip.wav");
	vm.trente = new Audio("./bonus/30s.wav");
	var noSleep = new NoSleep();

	// à activer quand lancement d'une séance
	noSleep.enable();

	vm.calculateTotalTimeNow = function(){
		var vm = this;
		vm.cumul = 0;

		angular.forEach(vm.timeStamps,function(timestamp,idx){
			if (!vm.timeStamps[idx+1]){
				if( vm.timeStamps.length === 1 ){
					vm.timeTotal = parseInt((Date.now() - timestamp) / 1000,10);
				} else {
					vm.timeTotal = vm.cumul + parseInt((Date.now() - timestamp) / 1000,10);
				}
				// The % 2 represent a time start / end couple
			} else if (idx % 2 !== 0 && idx > 0){
				vm.cumul += parseInt((timestamp - vm.timeStamps[idx - 1]) / 1000,10);
			}
		})
	}

    // Kind of cute random title at each second (isn't useful at all, but fun when we see it)
	vm.getMood = function(){
		var faces = ['(ʘ‿ʘ)','(ʘOʘ)','(ʘ﹏ʘ)','ʕ•ᴥ•ʔ','ಠ_ಠ'];
		var faceToShow = faces[Math.floor(Math.random()*faces.length)]
		return faceToShow;
	}


    // Get series count (How many series you have to do in the current session)
	vm.getSeries = function(){
		var vm = this;
		var counter = 0;

		angular.forEach(vm.selectedSession.contents,function(content){
			counter += content.amount;
		});

		return counter;
	}

    // get remaining minutes
	vm.getMin = function(time){
		var vm = this;
		var min = Math.floor(time / 60 ) % 60;
		return ("0" + min).slice(-2);
	}

    // get remaining seconds
	vm.getSeconds = function(time){
		var vm = this;
		var sec = Math.floor(time % 60);
		return ("0" + sec).slice(-2);
	}

    // get remaining hours
	vm.getHour = function(time){
		var vm = this;
		var hour = Math.floor(time / 3600);
		return ("0" + hour).slice(-2);
	}

    // Start or stop timer (add a timestamp to store and allow
    // us to calculate the interval between a start and a stop)
	vm.toggleTimer = function() {
		var vm = this;

		if (!vm.timerIsRunning){
			vm.startTimer();
		} else {
			vm.stopTimer();
		}
	}

    vm.startTimer = function() {
    	var vm = this;
    	vm.timerIsRunning = true;
      // Don't start a new fight if we are already fighting
      if ( vm.allowStop ) return;
      vm.timeStamps.push(Date.now());

      vm.allowStop = $interval(function() {
        if (vm.timerIsRunning) {
        	vm.calculateTotalTimeNow();
        } else {
          vm.stopTimer();
        }
      }, 1000);
    };

    vm.stopTimer = function() {
    	var vm = this;
		  if ( vm.allowStop ) {
		    $interval.cancel(vm.allowStop);
		    vm.timeStamps.push(Date.now());
		    vm.timerIsRunning = false;
		    vm.allowStop = false;
		  }
    };

    vm.reset = function(){
    	var vm = this;

		vm.stopTimer();
    	vm.timeTotal = 0;
    	vm.timeStamps.length = 0;
    }

    vm.toggleCountDown = function(){
    	var vm = this;

		if (!vm.countDownIsRunning){
			vm.startCountDown();
		} else {
			vm.stopCountDown();
		}
    }

    vm.bonusRandom = function(){
    	var vm = this;

    	var sources = ["impressionnant.wav","wawMuscles.wav","tiensBon.wav","pari.wav","regale.wav"];
    	var index = Math.floor(Math.random() * sources.length);
    	var audio = new Audio('./bonus/random/'+sources[index]);
    	audio.play();
    }

    vm.startCountDown = function(){
    	var vm = this;

    	vm.countDownIsRunning = true;
      // Don't start a new fight if we are already fighting
      if ( vm.allowStopCountDown ) return;
      vm.allowStopCountDown = $interval(function() {
        if (vm.timeRemaining > 0) {
        	if (Math.floor(Math.random() * 50) === 1){
        		vm.bonusRandom();
        	}
        	if (vm.timeRemaining < 7 && vm.timeRemaining > 1){
        		vm.bip.play();
        	}
        	if ((vm.timeRemaining - 1) === 30){
      			vm.trente.play();
      		}
          	vm.timeRemaining -= 1;
        } else {
          	vm.stopCountDown();
          	$scope.playSound();
        }
      }, 1000);
    }

    vm.stopCountDown = function(){
    	var vm = this;
    	if (vm.allowStopCountDown){
    		$interval.cancel(vm.allowStopCountDown);
    		vm.countDownIsRunning = false;
    		vm.allowStopCountDown = false;
    	}
    }

    vm.resetCountDown = function(time){
    	var vm = this;

		if (vm.audio){
			vm.audio.pause();
		}
		vm.timeRemaining = time;
		vm.timeCountDown = time;
    }

    vm.tickClick = function(){
    	var vm = this;
    		vm.ticks.push(vm.timeTotal);
    }

    loadSound = function(){
    	var vm = this;

    	var sources = ["BigJojo-VilleLumiere.mp3","Maxiblar-Rap-de-Sayan.mp3","l_affisheur.mp3","RDVComissariat.mp3","VICIOUS-INCORIGLE-VICELARD.mp3"];
    	var index = Math.floor(Math.random() * (sources.length));
    	$scope.audio = new Audio('./bonus/'+sources[index]);
    }
    $scope.playSound = function(){
    	var vm = this;

		vm.audio.play();
    }

    vm.getNumberOfAmount = function(serie){
    	var vm = this;
    	var retour = [];

    	for (var i = 0; i < serie.amount; i++) {
    		retour.push(serie.serie[i]);
    	}
    	return retour;
    }

    vm.setCountDown = function(time){
    	var vm = this;

    	vm.loadSound();
    	vm.timeRemaining = time;
    	vm.timeCountDown = time;
    }

    vm.init = function(){
        // Fetch all sessions
        $http.get('./data/complete.json')
        .success(function(data){
            vm.sessions = data.sessions;
        })
        .error(function(err){
            console.log(err);
        })
        // Load the first sound in background
        loadSound();
    }

    vm.init();

}]);
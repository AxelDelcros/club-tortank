# Tortank club : Sport sessions app

## Why this app ?
Tired to pay a subscription to some very complete apps only to use a few basic features, I decided to make my own app, for me and my friends. Any resemblance to any other fitness / sport session app is totally adventitious ;)

## How to use it :
```sh
  npm install
  npm start
```
## Add your own sounds and music (motivational or jokes)
For my friends and I, I added some jokes or motivationals sounds like me saying "You can do it !" or "You are so strong !" which are launched randomly whereas the exercises : You can add your own (sounds or music or whatever) in the /bonus/random folder. + for each random sound you add, you have to add it's name (perfectly written, it's case sensible) in the bonusHasard function, in the sources array :

```javascript
  vm.bonusHasard = function(){
    var vm = this;

    var sources = ["you-can-do-it.wav","you-are-so-strong.mp3", ...];
    var index = Math.floor(Math.random() * sources.length);
    var audio = new Audio('./bonus/random/'+sources[index]);
    audio.play();
  }
```
    
At the end of each timed exercise, a music is launched randomly between files you added (with the same technique as for random sounds, but in the loadSound function :

```javascript
loadSound = function(){
  var vm = this;

  var sources = ["the-eye-of-the-tiger.mp3", "we-are-the-champions.mp3"];
  var index = Math.floor(Math.random() * (sources.length));
  $scope.audio = new Audio('./bonus/'+sources[index]);
}
```

# ENJOY !

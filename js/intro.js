var time = 1000;
$(document).ready(function(){
	dialog_controller.stop_listening();
	setTimeout(function(){
		say('Dobrze, że już jesteś!');		
		setTimeout(function(){
			say('Trzeba uratować świat, a przynajmniej internet. Stało się coś strasznego...');
				setTimeout(function(){
					say ('Mnóstwo memów wypadło z internetu, musimy je znaleźć...');
						setTimeout(function () {
							say('Wyczułem zapach Batmana, Myszki Miki i Nyan Cata na tej łące, musimy ich znaleźć...');
								setTimeout(function() {
									say ('Oczywiście może ich być tu więcej, o wiele więcej... Czas wyruszyć na poszukiwania...');
									dialog_controller.listen();
								}, time);
							}, time);
					}, time);
			}, time);
	}, time);
})
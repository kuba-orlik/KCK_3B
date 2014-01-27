var verbs = {
	go: "(id(z|ź)|przesu(n|ń) si(ę|e)|p(ó|o)jd(z|ź)|przejd(ź|z))",
    find: "(szukaj|znajd(z|ź))"
}

var nouns = {
	steps : "(pol(a|e)|p(o|ó)l|kroki|krok|krok(ó|o)w|kwadraty|kwadrat|kwadratów|kwadratow|kratki|kratk(e|ę))"
}


$(document).ready(function(){
    scheme_collection.collection = [
        new scheme(verbs.go + " (w|do|na) #kierunek", function(kierunek){           
            var amount = Math.ceil(Math.random()*3);
            var coords = parseDirection(kierunek);
            if(coords!=null){
                coords.y = coords.y*amount;
                coords.x = coords.x*amount;
                controller.main_hero.translate_steps(coords.x, coords.y);               
            }
        }),
        new scheme(verbs.go + " (jak )?(najdalej|najbardziej|najdalej|max|ma(x|ks)ymalnie) (w|do|na) #kierunek (jak (tylko )?si(ę|e) da|jak to (tylko )?mo(z|ż)liwe)?", function(kierunek){
            controller.main_hero.goAsFarAsPossible(parseDirection(kierunek));
        }),
        new scheme("nasza notacja #parametr", function(parametr){
            say(parametr);
            dialog_controller.listen();
        }),
        new scheme("nie " + verbs.go + " (w #kierunek)?.*", function(kierunek){
            if(kierunek!=undefined){
                say("Dobrze, nie pójdę w " + kierunek);             
            }else{
                say("Dobrze, nie pójdę. TAK BĘDĘ STAŁ")
            }
            dialog_controller.listen();
        }),
        new scheme(verbs.go + " (o )?(pol(e|ę)|kwadrat|kratk(ę|e)|krok) (w|do|na) #kierunek", function(kierunek){
            controller.main_hero.parseTranslate('jeden', kierunek);
        }),
		new scheme(verbs.go + " (o )?#ile " + nouns.steps + "? (w|do|na) #kierunek", function(ile, kierunek){
            controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("gdzie jeste(s|ś)?", function(){
            say("Jestem na polu (x = " + controller.main_hero.mesh.position.x + ", y = " + controller.main_hero.mesh.position.y + ")")
            dialog_controller.listen();
        }),
        new scheme(verbs.go + " (w|do|na) #kierunek (o )?#ile " + nouns.steps + "?", function(kierunek, ile){
            controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("zr(ó|o)b #ile (kroki|krok(ó|o)w|krok) (w|na|do) #kierunek", function(ile, kierunek){
            controller.main_hero.parseTranslate(ile, kierunek);
        }),
        new scheme("(elo|witaj|siema|joł|cześć|czesc|hej)", function(){
            say('Hej, nadszedł czas poszukiwań memów.');
            dialog_controller.listen();
        }),
        new scheme("(opowiedz mi (z|ż)art|tell (me|a|me a)? joke|rozbaw mnie|jest mi smutno|smutno mi|walnij suchara|corny joke|karny suchar|Krzysiu Weiss)", function(){
            $.get('http://api.icndb.com/jokes/random', function(data){
                say("Ok, znasz ten angielski żart? <i>" + data.value.joke + "</i>");
                dialog_controller.listen();
            })
        }),
        new scheme(verbs.go + " (o )?#ilex " + nouns.steps + "? (w|do|na) #kierunekx, (i )?" + verbs.go + "? (o )?#iley " + nouns.steps + "? (w|do|na) #kieruneky", function(ilex, kierunekx, iley, kieruneky){
            controller.main_hero.parseTranslate(ilex, kierunekx);
            controller.main_hero.parseTranslate(iley, kieruneky);
        }),
        new scheme(verbs.go + " (o )?#ilex " + nouns.steps + "? (w|do|na) #kierunekx, (a )?(nast(ę|e)pnie|potem) (o )?#iley " + nouns.steps + "? (w|do|na) #kieruneky", function(ilex, kierunekx, iley, kieruneky){
            controller.main_hero.parseTranslate(ilex, kierunekx);
            controller.main_hero.parseTranslate(iley, kieruneky);
        }),
		new scheme("(skacz|przeskocz|skocz) (w|do|na) #kierunek", function(kierunek){
            var coords = parseDirection(kierunek);
            if(coords!=null){
                if(coords.y < 0) coords. y = coords.y - 1;
				else if (coords.y > 0) coords.y = coords.y + 1;
                if (coords.x < 0) coords.x = coords.x - 1;
				else if (coords.x > 0) coords.x = coords.x + 1;
				controller.main_hero.translate(coords.x, coords.y);
				}
		}),
        new scheme("dance for me", function(){
            say("ok, you got it, babe");
            window.parent.location="http://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }),
              new scheme("(help|wskazówka|wskazowka|pomoc(y)?|Nie wiem co (robi(c|ć)|zrobi(ć|c))|co dalej(\?)?|(i)? co teraz(\?)?)|(panie )?(premierze )?jak żyć(panie )?(premierze )?", function(){
            say('Pomóż mi poszukać memów, podnieść je i włożyć do jednego z routerów, żeby wysłać je powrotem do Internetu.');       
           dialog_controller.listen();   

        }),

        new scheme("(rozejrzyj si(ę|e)( wokół)?( w około)?|co widzisz(\?)?)", function(){
            //tutaj funkcja rozglądania - musi zwracać listę memów, które zauważył + czy zobaczył router - albo niech zama o tym opodwiada, we wnętrzu funkcji
            controller.main_hero.lookAround(4);
            say("Zauważyłem następujące memy:, możesz kazać mi podejść do jednego z nich i go podnieść.");
            say ("Zauważyłem router. Pomyśl czy to nie czas, żeby wysłać jakieś memey do Interentu.");
        }),

        new scheme("(" + verbs.go + "do (najbli(z|ż)szego)? router(a)?|" + verbs.find + " (najbli(z|ż)sz(y|ego))? router(a)?)", function(){
            //idź do najbliższego routera
            say("Już lecę, jak na skrzydłach.");
        }),

        new scheme("(" + verbs.go + "do (najbli(z|ż)szego)? mem(a|ów)?|" + verbs.find + " (najbli(z|ż)sz(y|ego))? mem(a|ów)?)", function(){
            //idź do najbliższego mema
            say("Szukam, węszę, gdzie są memy?");
        }),

        new scheme("(podnie(ś|s)|we(ź|z)|unie(ś|s)|zabierz)", function(){
            // funkcja podnieś mema(mem) - podnosi mem o takiej nazwie, jeśli stoisz razem z nim na polu, ew. zaimplementować, że może być na polu obok
        }),

        new scheme("(podnie(ś|s)|we(ź|z)|unie(ś|s)|zabierz) mem(a)?", function(){
            // funkcja ponieś mema() - podnosi mem, który znajduje się na tym samym polu co Luigi
        })

    ];    
});

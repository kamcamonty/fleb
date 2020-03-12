//TESTOVA FUNKCE: pokus
function pokus() { alert("haha") };

//LAJKLITOVA FUNKCE: MyFBlike a pomocne funkce gelang, getSize, align, updateLike
//Zodpovida zazobrazni lajklitka
//V tele otazky je potreba mit HTML element ve tvaru <div class="laklitko"></div>
//Povinne argumenty:
//1) tento argument je vzdy this
//2)URL, kterou chceme sdilet a lajkovat
//Nepovinne argumenty: pokud je chceme použít, musí být bohužel vyplněny všechny předchozí; pokud ty předchozí měnit nechceme, tak stačí zadat undefined; texty musí být v uvozovkách, čísla a true/fase/undefined ne
//3) my_align: "right"/"left"/"center"; defaultní je "right" "center" pro telefony;
//v případě potřeby lze nastavit vlastní CSS s Media queries dle třídy lajklitko (nutno přidat !important)
//Vše dále už jsou původní argumenty Facebooku, jen mají místo podtržítka pomlčku, možné hodnot lze najít na této stránce:
//https://developers.facebook.com/docs/plugins/like-button/
//Priklad pouziti: myFBlike(this,  'https://www.pokusnikralici.cz/');
//Priklad pouziti2: myFBlike(this, 'https://www.pokusnikralici.cz/', "left", true, "box_count", undefined, undefined, "recommend", false);


function myFBlike(that, myURL, my_align, data_share, data_layout, data_size, data_width, data_action, data_show_faces) {
	var doit;

	if (data_layout === undefined) { data_layout = "button_count"; }
	//if(data_width === undefined) {data_width = 600;}
	if (data_action === undefined) { data_action = "like"; }
	// if(data_size === undefined) {data_size = "";}
	if (data_show_faces === undefined) { data_show_faces = "true"; }
	if (data_share === undefined) { data_share = "true"; }
	//nastaveni defaultnich parametru kvuli internetu exploreru: 
	//https://stackoverflow.com/questions/15178700/javascript-functions-and-default-parameters-not-working-in-ie-and-chrome
	//paramtery, ktere se aktualizuji se zemanou velikosti jsou nastavene az ve funkci updateLike;

	window.onresize = function () {
		clearTimeout(doit);
		doit = setTimeout(function () {
			align();
			updateLike(myURL, data_layout, data_width, data_action, data_size, data_show_faces, data_share);
		}, 100);
	};
	//https://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-ac
	//Updates Like button after resizing the page

	var Q = jQuery("#" + that.questionId);
	Q.prepend('<div id="fb-root"></div>'); //for FB: https://developers.facebook.com/docs/plugins/like-button/
	Q.prepend('<div id="scriptDiv"></div>'); //div for Facebook source script
	//Adding divsfor FB

	align(my_align); //enables either custom alignment or 
	updateLike(myURL, data_layout, data_width, data_action, data_size, data_show_faces, data_share);
	//draw the like button for the first time

	jQuery('#Q_lang').change(function () {
		updateLike(myURL, data_layout2, data_width, data_action, data_size, data_show_faces, data_share);
		//Aktuaizuje tlačítka při změně jazyka tak, aby byly vždy ve stejném jazyce jako dotazník
	});
	//Updates Like button when the language selector is changed


	window.fbAsyncInit = function () {
		FB.init({
			appId: 'your-app-id',
			autoLogAppEvents: true,
			xfbml: true,
			version: 'v4.0'
		});
	};
	//Intializing FB:https://developers.facebook.com/docs/javascript/quickstart/*/

}

function getLang() {
	//Gets value of the Qualtrics language selector and converts it to the  Facebook format
	//Works for following languages: "CS", "EN", "PT", "IT"

	var Q_list = ["CS", "EN", "PT", "IT"];
	var FB_list = ["cs_CZ", "en_US", "pt_BR", "it_IT"];
	var lang2;

	try {
		var Q_lang = document.documentElement.lang;
		var i = Q_list.indexOf(Q_lang);
		lang2 = FB_list[i];
	}

	catch (err) { lang2 = "en_US"; }

	return lang2;
}

function getSize() {
	//Different size of the Like button and the width of the whole div based on window.innerWidth
	var mySize = [];
	var vw = window.innerWidth;

	mySize[0] = vw < 450 ? "small" : "large";
	mySize[1] = vw < 500 ? Number(vw) - 50 : 450;
	return mySize;
}

function align(x) {
	//Aligns the buttons center or right with according to window.innerWidth
	var MyAlign = x;
	if (MyAlign === undefined) { MyAlign = window.innerWidth < 600 ? "center" : "right"; }

	jQuery(".lajklitko").css("text-align", MyAlign);
}


function updateLike(URL, data_layout, data_width, data_action, data_size, data_show_faces, data_share) {
	//Draws/updates the like button
	//Calls getSize and align
	//alert(data_layout);

	var mySize = getSize();

	if (data_size === undefined) { data_size = mySize[0]; }
	if (data_width === undefined) { data_width = mySize[1]; }

	//alert(mySize[1]+ "   " + window.innerWidth);


	var lang = "en_US";
	lang = getLang();

	FB = undefined;

	var likeDiv = '<' + 'div class="fb-like'
		+ '" data-href="' + URL
		+ '" data-width="' + data_width
		+ '" data-layout="' + data_layout
		+ '" data-action="' + data_action
		+ '" data-size="' + data_size
		+ '" data-show-faces="' + data_show_faces
		+ '" data-share="' + data_share
		+ '"></div>';
	//HTML of the like button

	//alert(likeDiv);

	jQuery('#scriptDiv').html('<' + 'script async defer crossorigin="anonymous" src="https://connect.facebook.net/' + lang + '/sdk.js#xfbml=1&version=v3.0"></script>');
	//script for the like button

	jQuery(".lajklitko").html(likeDiv); //updates the actual appearance of the buttons HTML
	FB.XFBML.parse(); //Make facebook to update actual appearance of the page: https://developers.facebook.com/docs/javascript/quickstart/

}



//ZAROVNAT DROP-DOWN LIST DOPRAVA
//Její argument musí být vždy this

function rightDropDown(that) { jQuery("#" + that.questionId + " .ChoiceStructure .Selection").css("direction", "rtl"); }

//LIKERTOVY ŠKÁLY -PŘEPÍNÁNÍ MEZI NORMÁLNÍM A MOBILNÍM ZOBRAZENÍM 
/*This function is here due to mobile friendly vertical (which becames horizonatal in mobile devices) multiple choice question
	I'd like to have 2 likert labels above choices, which created a problem in mobile friendly version which is vertical
	Therefore I add element bellow the scale to have there my label for mobile device. The text is filled automatically;
	works together with CSS classes .R, .L and .mR (media query for display property)
The first argument has to be lways this. The second one is optional. If it is true, it takes descriptions from classes nojsR and nojsL*/

function removeLastChar(x) {
	x = x.substring(x.indexOf('>') + 1, x.lastIndexOf('<'));
	x = x.substring(0, x.length - 1);
	return (x);
}

function getLastNumber(x) {
	var myRegexp = /(\d+)(?!.*\d)/;
	return (myRegexp.exec(x)[1])
}

function mobileLab(that, inside) {
	var Q = "#" + that.questionId;
	var text, L, R, choices, elL, elR;
	if (inside == true) {
		choices = jQuery(Q + " .SingleAnswer");

		elL = choices.first();
		elR = choices.last();

		L = removeLastChar(elL.html());
		R = removeLastChar(elR.html());

		text = '<div class = "L">' + L + '</div>' + '<div class = "R">' + R + '</div>';
		jQuery("#" + that.questionId + " .ChoiceStructure").before(text);


		elL.text(getLastNumber(elL.html()));
		elR.text(getLastNumber(elR.html()));


	}

	jQuery(that.getChoiceContainer()).append('<div class="mR">' + jQuery(Q + " .R").text() + '<div>');
	if (window.innerWidth < 753) jQuery(Q + " .LabelContainer ").css("width", "222px");
}

//MATICE - PŘEPÍNÁNÍ MEZI MOBILNÍ A NORMÁLNÍ VERZÍ
//používá se funkce mobileMatrixW, ostatní jsou pomocné
//argumenty
//that..this
//další dva - popisky škál, je nutné je mít i zde, pokus je brát z otázky se nevydařil, občas se nezobrzovaly

function remove1(x) {
	x = x.substring(x.indexOf('>') + 1, x.lastIndexOf('<'));
	return (x);
}

function removeLastChar2(x) {
	x = x.substring(0, x.length - 1);
	return (x);
}


function indicateAnswer(Q) {
	var int = setInterval(function () { jQuery(Q + " .answered-indicator span div").remove(); }, 30);
	setTimeout(function () { clearInterval(int); }, 2000);
	//If this function would not be used, first line of text would appear in the box showing which option was selected
	//in the mobile version (like this, the number appers)

}

function mobileMatrix(Q, textFirst, textLast) {

	var mobileTop = jQuery(Q + ' .mobileMatrixT');
	var mobileBottom = jQuery(Q + ' .mobileMatrixB');

	mobileTop.remove();
	mobileBottom.remove();
	//Removes my mobile labels (should not be in the desktop version); needed because of repeated call after resize

	var choices;

	//DESKTOP VERSION
	//takes liker scle descriptions and puts them 
	//-> spaces between all columns are equal
	if (jQuery(Q).find('div.desktop').length > 0) {
		var cisla = jQuery(".Answers");
		jQuery(Q + " tr.matrixDesktopTr").nextUntil(cisla).remove();


		choices = jQuery(Q + " .Answers th");

		var elL = choices.first();
		var elR = choices.last();

		var x = elL.html();

		var L = removeLastChar(remove1(elL.html()));
		var R = removeLastChar(remove1(elR.html()));

		var colspan = choices.length / 2;

		var text_final = '<tr class = "matrixDesktopTr"><td></td><td colspan="' + colspan + '"><div class = "matrixL">' + L + '</div></td>'
			+ '<td colspan="' + colspan + '"><div class = "matrixR">' + R + '</div></td></tr>';


		jQuery(Q + " .Answers").before(text_final);

		elL.html(getLastNumber(elL.text()));
		elR.html(getLastNumber(elR.text()));

	}

	//MOBILE VERSION
	else {
		jQuery('.single-answer br').replaceWith(' ');

		var choice_selector = Q + " tr.ChoiceRow  td label.single-answer.mobile";

		choices = jQuery(choice_selector);
		choices.parent(Q + "td").css("text-align", "center!important");

		//var choiceRow = choices.parent("tr");
		//console.log(choiceRow.first().html());


		if (mobileTop.length == 0) { jQuery(Q + ' th').after('<div class = "mobileMatrixT">' + textFirst + '</div>'); }

		if (mobileBottom.length == 0) { jQuery(Q + ' tr').append('<div  class = "mobileMatrixB">' + textLast + '</div>'); }


		var choice, temp;
		for (i = 0; i < choices.length; i++) {
			choice = choices.eq(i);
			temp = getLastNumber(choice.text());
			choice.text(temp);
		}

		jQuery(Q + "div.q-matrix.mobile").addClass("my-matrix");

		document.addEventListener("click", function () { indicateAnswer(Q) });
		//document.addEventListener("click", recolorAI);


	}
}

//WRAPPER FUNCTION
function mobileMatrixW(that, textFirst, textLast) {
	var Q = "#" + that.questionId;

	mobileMatrix(Q, textFirst, textLast);

	//update after resize
	var doit;
	window.onresize = function () {
		clearTimeout(doit);
		doit = setTimeout(function () {
			mobileMatrix(Q, textFirst, textLast);
		}, 100);
	};
}
//OMEZIT DÉLKU ODPOVĚDI TEXT ENTRY OTÁZKY
//První arguemtnt je vždy this a druhý délka (počet znaků)
function maxInput(that, n) {
	jQuery("#" + that.questionId + ' input[type="text"]').attr("maxlength", n);
}

function kralikCode(that){
	maxInput(that, 9);
}

function getBlockOrder(block_name){
	var previous_order = Qualtrics.SurveyEngine.getEmbeddedData("qOrder");
	var actual_order = previous_order + ";" + block_name;
	alert(actual_order);
	Qualtrics.SurveyEngine.setEmbeddedData("qOrder", actual_order);
}
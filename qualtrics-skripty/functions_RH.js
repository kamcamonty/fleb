/*This function allows just values which fulfills given regexp condition in a text entry field
	https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input/469362#469362
	https://jsfiddle.net/emkey08/zgvtjc51*/	
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}
	
/*This function rounds numbers to number of decimals given as the second argument
	http://www.jacklmoore.com/notes/rounding-in-javascript/*/
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/*This function converts strings to numbers and replaceces decimal comma by decimal dot if neccesary before that*/	
function toNum(x) {return Number(x.replace(",", "."));}



/*This function draws discrete "progressbar". The node with value x will have css class "actvie" the active one and all lower ones "done"
	n is total number of nodes
function drawPB(n, x) {
	for (var i = 0; i < n; i++) jQuery("ul.progressbar").append("<li></li>");
	jQuery("ul.progressbar li:nth-child("+x+")").addClass("active");
	for (var i = 0; i < x; i++) jQuery("ul.progressbar li:nth-child("+i+")").addClass("done");
    						}*/	

/*This function is here due to mobile friendly vertical (which becames horizonatal in mobile devices) multiple choice question
	I'd like to have 2 likert labels above choices, which created a problem in mobile friendly version which is vertical
	Therefore I add element bellow the scale to have there my label for mobile device. The text is filled automatically;
	works together with CSS classes .R, .L and .mR (media query for display property)*/
function mobileLab(that) {
	var Q = "#"+that.questionId;
	jQuery(that.getChoiceContainer()).append('<div class="mR">' + jQuery(Q + " .R").text() + '<div>');
	if(window.innerWidth < 753)jQuery(Q + " .LabelContainer ").css("width","222px");}

/*Following 3 are mobile optimalization for ilnesses questions*/
function addCSS_MC(that){
	var Q = "#"+that.questionId;
	var chs = Q + " .ChoiceStructure"; 
	var s =  Q + " .Selection";
	var ma = Q + " .MultipleAnswer";
	
		jQuery(chs).css("display","flex");
	    jQuery(chs).css("flex-wrap","wrap");
	    jQuery(chs).css("justify-content","center");
	
		jQuery(s).css("width","222px");
		jQuery(s).css("max-height","100px");
   		jQuery(s).css("margin","0px");
		jQuery(s).css("padding","0px");
		jQuery(s).css("padding-right","10px");
		jQuery(ma).css("padding","10px");
		jQuery(ma).css("margin","0px");
				}
	
		//jQuery(s).css("border-style","solid");

   	//	jQuery(s).css("height","100px");
	//;

function updateMCheights (that){
	var Q = "#"+that.questionId;
	
	 var chs = document.querySelector(Q + ' ul.ChoiceStructure');
	 var n =chs.getElementsByTagName("Li").length; 
	
	document.querySelector(Q + ' li.Selection:nth-child('+n+')').style.height = 58 + "px";
	
	var heights = [];
	for (var i = 1; i <= n; i++) {
		var el = document.querySelector(Q + ' li.Selection:nth-child('+i+')');
		var my_height = el.clientHeight;
		heights.push(my_height); }
	
	for (var i = 0; i < n; i++) {
		var j = i +1;
		var el = document.querySelector(Q + ' li.Selection:nth-child('+j+')');
		el.getElementsByClassName("MultipleAnswer")[0].style.height = heights[i] - 10 + "px";}}


function MCillness(that){
	var resizeTimer;
	addCSS_MC(that);
	updateMCheights(that);
	window.addEventListener("resize", function(ev){clearTimeout(resizeTimer);
  																							resizeTimer = setTimeout(function() {
		            																		updateMCheights (that);
																							}, 500)});}



/**
Reduce space above the div with buttons
 **/
	function reduceNBspace(){
 			jQuery("#Buttons").css("padding-top","0px");
		    jQuery("#Buttons").css("margin-top","0px");}

/**
Takto funkce ukáže otázku pouze pokud je u té před ní zvolena možnost 1. Funkce je nutné volat z JavaScriptu první otázky.
	that...this
	ID...číslo druhé otázky (pouze číslo bez "QID")	
 **/
	function display_next (that, ID){
		var qid = "QID" + ID;
		var sid = qid + "Separator";
		var sep = document.getElementById(sid);
		var nextQ = document.getElementById(qid);
		
		var selectedRecode;
	
		that.questionclick = function(event, element) {
			if(element.type == "radio")
				{ selectedRecode = that.getChoiceRecodeValue(that.getSelectedChoices());
			 		if(selectedRecode == 1) {nextQ.style.display = "block";
								 sep.style.display = "block";}

			 			else{nextQ.style.display = "none";
						     sep.style.display = "none";}}}
	
		}	



function PMorder1(Q){


		var myArray = [];
	
	//Get values of all clicked choices in the correct order
		jQuery("#" + Q.questionId + " label.MultipleAnswer" ).click(function() {

		var myID = jQuery(this).attr('id');
		myID = myID.substring(myID.indexOf("-") + 1);
		myID = myID.replace('-label','');
		myID = Number(myID);
		
		var myVal = Q.getChoiceRecodeValue(myID);
		//alert(myVal);
		
		myArray.push(myVal);
		Qualtrics.SurveyEngine.setEmbeddedData("psychomotor_temp", myArray.join());		
		});		
								}


function PMorder2(solution){
		var order = Qualtrics.SurveyEngine.getEmbeddedData("psychomotor_temp");

		//Get the correct answer
		var div = document.createElement("div");
		div.innerHTML = solution;
		solution = div.textContent || div.innerText || ""; //HTML to normal text: https://stackoverflow.com/questions/5002111/how-to-strip-html-tags-from-string-in-javascript

		solution = solution.replace(/ /g,'');
		//alert(solution + order);

	
	    var actualCorrect = order== "NA" ? "NA" : order == solution;
		//alert(actualCorrect);

		var previousCorrect = Qualtrics.SurveyEngine.getEmbeddedData("psychomotor_correct");
		if (previousCorrect == null) {previousCorrect = ""};
		var correct = previousCorrect + actualCorrect + ";";
		Qualtrics.SurveyEngine.setEmbeddedData("psychomotor_correct", correct);

		var previousOrder = Qualtrics.SurveyEngine.getEmbeddedData("psychomotor_order");
		if (previousOrder == null) {previousOrder = ""};
		var orders = previousOrder + order + ";";
		Qualtrics.SurveyEngine.setEmbeddedData("psychomotor_order", orders);		

		Qualtrics.SurveyEngine.setEmbeddedData("psychomotor_temp", "NA");
									}


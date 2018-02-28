function tokenizeText(text) {
	return text.toLowerCase().match(/\b[^\s]+\b/g).sort();
}

function removeReturns(text) {
  return text.replace(/\r?\n|\r/g, "");
}

function getAverageWordLength(tokens) {
	var totalLength = tokens.join("").length;
	return(totalLength / tokens.length).toFixed(2);
}

function getUniqueWordCount(tokens) {
	var uniqueWordCount = [];
	for (var i = 0; i <tokens.length; i++) {
		if (uniqueWordCount.indexOf(tokens[i]) === -1) {
			uniqueWordCount.push(tokens[i]);
		}
	}
	return uniqueWordCount.length;
}

function reportOnText(text) {
	var tokens = tokenizeText(text);
	var totalNumberOfWords = tokens.length;
	var averageWordLength = getAverageWordLength(tokens);
	var uniqueWords = getUniqueWordCount(tokens);

	var textReport = $('.js-text-report');
	textReport.find('.js-word-count').text(totalNumberOfWords);
	textReport.find('.js-average-word-length').text(averageWordLength + ' characters');
	textReport.find('.js-unique-word-count').text(uniqueWords); 
	textReport.removeClass('hidden');
}

function formSubmission() {
	$('.js-text-form').submit(function(event) {
		event.preventDefault();
		var userText = $(this).find('#user-text').val();
		reportOnText(removeReturns(userText));
	});
}

$(function() {
	formSubmission()
});
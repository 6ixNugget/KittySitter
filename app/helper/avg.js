exports.avg = function(ratings){
	sum = 0;
	for(i = 0; i < ratings.length; i++){
		sum += ratings[i];
	}
	return(sum/(ratings.length-1));
}
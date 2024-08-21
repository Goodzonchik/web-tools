javascript:(function() {
	const isToolsOpen = document.getElementById('goodzonchik-tools');

	if(isToolsOpen){
		isToolsOpen.remove();
	} else {
	var elem = document.createElement('div');
	elem.style.cssText = `position:absolute;
							width:100%;
							height:100%;
							opacity:0.3;
							z-index:100;background:#000`;
	elem.id = 'goodzonchik-tools';
    document.body.appendChild(elem);
	}
})();

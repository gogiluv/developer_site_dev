var shaders = function(){
	var self = this;
	
	console.log(self);

	self.init = function(){
		
	}	
	
	self.select_tab = function(element){
		var e = $(element);
		var tab_btns = [$('#btn-code'), $('#btn-scene')];
		var tab_name = 'tab-'+e.attr('id').replace(/btn-/g,'');

		//remove active
		for(var num in tab_btns){
			tab_btns[num].removeClass('active');
		}
		e.addClass('active');
		$('.tab-view').hide();
		$('#'+tab_name).show();
	}

	self.select_code_tab = function(element){
		var e = $(element);
		console.log(e);
		var tab_btns = [$('#btn-vertex'), $('#btn-fragment')];
		var tab_name = 'tab-'+e.attr('id').replace(/btn-/g,'');

		//remove active
		for(var num in tab_btns){
			tab_btns[num].removeClass('active',10000);
		}
		e.addClass('active',1000);
		$('.tab-view-sub').hide();
		$('#'+tab_name).show();
	}


	self.undo = function(element){
		var e = $(element);
		alert(e.attr('id'));
	}
	
	return self;
}();


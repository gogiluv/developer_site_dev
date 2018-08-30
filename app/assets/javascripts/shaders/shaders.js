var Shader = {
	
	init: function(){
						
	}(),

	index_params: {
		type: '',
		p: '',
		keyword: ''
	},
	
	select_tab: function(element){
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

		//코드텝 처음 선택시 코드창 출력 이벤트 호출
		if(tab_name == 'tab-code'){
			if(isVertexTab == true){ TabVertex(true);}
			if(isFragTab == true){ TabFrag(true);}
		}

		if(tab_name == 'tab-scene'){
			console.log('tab-scene');
		}
	},

	select_code_tab: function(element){
		var e = $(element);
		console.log(e);
		var tab_btns = [$('#btn-vertex'), $('#btn-fragment')];
		var tab_name = 'tab-'+e.attr('id').replace(/btn-/g,'');

		//remove active
		for(var num in tab_btns){
			tab_btns[num].removeClass('active');
		}
		e.addClass('active');
		$('.tab-view-sub').hide();
		$('#'+tab_name).show();
	},


	undo: function(){
		//self.addLoadingToFunc(LoadJsonData);
		Shader.addLoadingToFunc(LoadJsonData);
	},

	shader_params: {
		id: 0,
		user_id: 0,
		fbx_text: '',
		vertex_text: '',
		fragment_text: '',
		dat_gui_text: '',
		img_url: '',
		title: '',
		content: '',
		img_data: ''
	},

	set_shader_params: function(data){
		Shader.shader_params.id=data.shader.id;
		Shader.shader_params.fbx_text=data.shader.fbx_text;
		Shader.shader_params.vertex_text=data.shader.vertex_text;
		Shader.shader_params.fragment_text=data.shader.fragment_text;
		Shader.shader_params.dat_gui_text=data.shader.dat_gui_text;
	},
	
	shader_submit_confirm: function(submit_type){
		//유효성 체크
		var error_code = GetSubmitErrorCode();
		var msg = GetErrorMessage(error_code);
		var func = null;
		
		//쉐이더 파일 누락, 컴파일 여부 체크
		if(msg!=null &&  msg!= ''){Shader.msg_pop('warning', msg); return;}
		//제목, 글 내용 등 체크
		Shader.set_params();
		if(!Shader.validate_params()){console.log('valid fail'); return;}
		
		
		Shader.confirm_pop('confirm' ,'쉐이더를 업로드 하시겠습니까?', Shader.shader_submit);
	},

	msg_pop: function(type, msg, style={}){
		var html = [];
		html.push('<div class="shader-pop overlay">');
		html.push('<div class="overlay-inbox">');
		html.push('<strong style="color:red;">['+type+']</strong>');
		html.push('<hr/>');
		html.push('<p>'+msg+'</p>');
		html.push('<hr/>');
		html.push('<button id="shader-pop-close" class="btn shader-pop-close" onclick="Shader.shader_pop_close()">');
		html.push('<i class="fa fa-close d-icon d-icon-plus"></i>');
		html.push('</button>');
		html.push('</div>');
		html.push('</div>');
		$('body').prepend(html.join(''));
		$('.shader-pop').css(style);
		$('.shader-pop').show();
	},
	//TODO 예/아니오 팝업
	confirm_pop: function(type, msg, func){
		var html = [];
		html.push('<div class="shader-pop overlay">');
		html.push('<div class="overlay-inbox">');
		html.push('<strong style="color:blue;">['+type+']</strong>');
		html.push('<hr/>');
		html.push('<p>'+msg+'</p>');
		html.push('<hr/>');
		html.push('<button id="shader-pop-check" class="btn shader-pop-check">');
		html.push('<i class="fa fa-check d-icon d-icon-plus"></i>');
		html.push('</button>');
		html.push('&nbsp;&nbsp;');
		html.push('<button id="shader-pop-close" class="btn shader-pop-close" onclick="Shader.shader_pop_close()">');
		html.push('<i class="fa fa-close d-icon d-icon-plus"></i>');
		html.push('</button>');
		html.push('</div>');
		html.push('</div>');
		$('body').prepend(html.join(''));
		$('.shader-pop-check').click(func);
		$('.shader-pop').show();
	},

	shader_pop_close: function(){
		$('.shader-pop').remove();
	},
	
	shader_submit_callback(submit_type){

	},

	shader_submit: function(){
		//로딩창 on
		Shader.onLoading();
		
		//Shader.set_params();
		//Shader.validate_params();

               	_Render.render( _Scene, _Camera );
               	var canv = document.querySelector('#scene-view > div > canvas').toDataURL("image/png");
		
		$.ajax({
			url:'/shaders',
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			data: {
				'shader[title]': Shader.shader_params.title,
				'shader[content]': Shader.shader_params.content,
				'shader[fbx_text]': Shader.shader_params.fbx_text,
				'shader[vertex_text]': Shader.shader_params.vertex_text,
				'shader[fragment_text]': Shader.shader_params.fragment_text,
				'shader[dat_gui_text]': Shader.shader_params.dat_gui_text,
				'shader[img_data]': Shader.shader_params.img_data

			},
			success:function(data){	
				if(!(data.result===false)){
					//beforeonload 이벤트 제거
					$(window).off('beforeunload');
					//작성한 글로 이동
					location.href = "/shaders/"+data.shader.id;
				}else{
					alert('업로드를 실패했습니다.\r\n다시 시도해 주세요.');
				}
			}
		});
	},

	set_params: function(){
		Shader.shader_params.title = $('#shader_title').val().trim();
		Shader.shader_params.content = $('#shader_content').val().trim();
		//self.shader_params.img_url = GetImgData();
		Shader.shader_params.fbx_text = GetFbxArrayBufferData();
		Shader.shader_params.vertex_text = GetVertexStringData();
		Shader.shader_params.fragment_text = GetFragmentStringData();
		Shader.shader_params.dat_gui_text = encodeURI(GetDatGUIStringData());
		Shader.shader_params.img_data = GetImgData();
	},

	//TODO 유효성 검사
	validate_params: function(){
		console.log('validate_params');
		console.log(Shader.shader_params.title.length);
		if(Shader.shader_params.title.length < 1){ Shader.msg_pop('warning', '제목을 작성 해 주세요.'); console.log('제목이 없는데?'); return false; }
		if(Shader.shader_params.content.length < 1){Shader.msg_pop('warning', '쉐이더 설명을 작성 해 주세요.'); return false; }
		//통과하면 true
		return true;
	},
	/*
	function GetImgData()
	{
		_Render.render( _Scene, _Camera );
		return document.querySelector('div > canvas').toDataURL("image/png");
	}*/
	code_compile: function(){
		//유효성 체크
		var error_code = GetCompileErrorCode();
		var msg = GetCompileMessage(error_code);		
		var type = 'warning';
		
		if(msg!=null && msg!=''){
			Shader.msg_pop(type,msg);
		}else{		
			if (!onCompile()){
				$('.scene-error').html('');
				Shader.select_tab($('#btn-scene'));
			}else{
				$('.scene-error').html('Shader Error!');
			}
		}
		
	},
	/*
	function ab2str(bytes) {
	  var uintArray = new Uint16Array(bytes); 
	  var converted = []; 
	  uintArray.forEach(function(byte) {converted.push(String.fromCharCode(byte))});
	  return converted.join("");
	}
	function str2ab(str) {
	  
	  //var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
	  //var bufView = new Uint16Array(buf);
	  //for (var i=0, strLen=str.length; i < strLen; i++) {
	    //bufView[i] = str.charCodeAt(i);
	  //}
	  //return buf;
	  
          console.log('here');
	  console.log(Array.from(str.split(','), x => Number(x)));
	  return new Uint16Array(Array.from(str.split(','), x => Number(x)));
	}
	
	function GetImgData()
	{
		_Render.render( _Scene, _Camera );
		return document.querySelector('div > canvas').toDataURL("image/png");
	}*/


	like: function(element){
		var e = $(element).children('i');
		var like_boolean = false;

		if(e.hasClass('liked')){
			e.removeClass('fa-heart liked');
			e.addClass('fa-heart-o');
			action = 'delete';

		}else{
			e.removeClass('fa-heart-o');
			e.addClass('fa-heart liked');
			action = 'add';

		}
		
		$.ajax({
			url:'/shaders/user_action',
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			data: {			
				type: "like",
				shader_id: Shader.shader_params.id,
				action_status: action
			},
			success:function(data){
				console.log(data);
			}
		});
	},

	bookmark: function(element){
		var e = $(element).children('i');
		var bookmark_boolean = false;	//default

		if(e.hasClass('bookmarked')){
			e.removeClass('bookmarked');			
			action = 'delete';
		}else{
			e.addClass('bookmarked');
			action = 'add';
		}

		$.ajax({
			url:'/shaders/user_action',
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			data: {			
				type: "bookmark",
				shader_id: Shader.shader_params.id,
				action_status: action
			},
			success:function(data){
				//console.log(data);
			}
		});
	},

	keychk: function (){
            var key_number = event.keyCode;
            
            if(key_number==13){
                Shader.search();
            }
        },
        
        search: function (){
            var keyword = $('#search_keyword').val();
            
            location.href = '/shaders?type='+Shader.index_params.type+'&keyword='+keyword;
        },

	GetFbxText: function(){
		return Shader.shader_params.fbx_text;
	},

	GetVertexText: function(){
		return Shader.shader_params.vertex_text;
	},

	GetFragmentText: function(){
		return Shader.shader_params.fragment_text;
	},

	GetDatGUIText: function(){
		return Shader.shader_params.dat_gui_text;
	},

	onLoading: function(){
		$('.loading').show();

	},

	offLoading: function(){
		$('.loading').hide();
	},

	addLoadingToFunc: function(f){
		setTimeout(function(){
			Shader.onLoading();
			setTimeout(function(){
				f();
				setTimeout(function(){
					Shader.offLoading();
					Shader.select_tab($('#btn-scene'));
				},100);
			},100);
		},100);
	},

        add_fbx: function(){
		$('#fbxFile').change(onAddFBX);
		$('#fbxFile').click();
	},

        add_vertex: function(){
		$('#vertexFile').change(onAddVertexShader);
		$('#vertexFile').click();
	},

        add_fragment: function(){
		$('#fragFile').change(onAddFragShader);
		$('#fragFile').click();
	},
};

var CreateWidget = {

	open: function(){
		//스토리지 비움
		localStorage.clear();
		var html = [];
		html.push('<div class="overlay">');
		html.push('</div>');
		$('body').prepend(html.join(''));
		$('.overlay').append($('.create_widget')).show();
		$('.create_widget').fadeIn().css('display', 'block');
	},

	close: function(){
		$('.create_widget').fadeOut(function(){
			$('body').append($('.create_widget'));
			$('.overlay').remove();
		});
		//$('body').append($('.create_widget'));
	},

	create_empty: function(){
		location.href = '/shaders/new';
	},

        add_fbx: function(){
		console.log('inwidget');
		$('#fbxFile').click();
		$('#fbxFile').change(CreateWidget.on_fbx);
	},

        add_vertex: function(){
		$('#vertexFile').click();
		$('#vertexFile').change(CreateWidget.on_vertex);
	},

        add_fragment: function(){
		$('#fragFile').click();
		$('#fragFile').change(CreateWidget.on_fragment);
	},

	on_fbx: function(){
		console.log('on_fbx in widget');
		$('#widget-fbx').addClass('active');
		$('#widget-fbx > i').removeClass('fa-plus').addClass('fa-check');

		if (typeof(Storage) !== "undefined") {
			var file = $('#fbxFile')[0];
			var reader = new FileReader();
			var file_data = '';
			reader.addEventListener( 'load', function ( event ) {
				file_data = String(new Uint16Array(event.target.result));
				localStorage.setItem('fbx', file_data);
			}, false );

			reader.readAsArrayBuffer(file.files[0]);
		} else {
			console.log('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
		}
	},

	on_vertex: function(){
		console.log('on_vertex in widget');
		$('#widget-vertex').addClass('active');
		$('#widget-vertex > i').removeClass('fa-plus').addClass('fa-check');

		if (typeof(Storage) !== "undefined") {
			var file = $('#vertexFile')[0];
			var reader = new FileReader();
			var file_data = '';
			reader.addEventListener( 'load', function ( event ) {
				file_data = event.target.result;
				localStorage.setItem('vertex', file_data);
			}, false );

			reader.readAsText(file.files[0]);
		} else {
			console.log('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
		}
	},

	on_fragment: function(){
		console.log('on_fragment in widget');
		$('#widget-fragment').addClass('active');
		$('#widget-fragment > i').removeClass('fa-plus').addClass('fa-check');

		if (typeof(Storage) !== "undefined") {
			var file = $('#fragFile')[0];
			var reader = new FileReader();
			var file_data = '';
			reader.addEventListener( 'load', function ( event ) {
				file_data = event.target.result;
				localStorage.setItem('fragment', file_data);
			}, false );

			reader.readAsText(file.files[0]);
		} else {
			console.log('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
		}
	},

	send_new: function(){
		if(localStorage.fbx==null || localStorage.vertex==null || localStorage.fragment==null){
			Shader.msg_pop('File Empty','파일을 추가 해 주세요', {'z-index':1002});
			//alert('파일을 추가 해 주세요');
			return;
		}	

		localStorage.setItem('is_set', 'yes')
		location.href='/shaders/new';
	}
};

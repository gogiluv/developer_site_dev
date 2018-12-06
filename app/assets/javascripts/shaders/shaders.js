var Shader = {
	
	init: function(){
						
	}(),

	index_params: {
		type: '',
		p: '',
		keyword: ''
	},

    shader_render: function(){
		try{
			Init();
			Animate();
		}catch(err){
			console.log(err);
			Shader.msg_pop('Error!', '손상된 쉐이더 입니다.<br><br>관리자에게 문의 해 주세요');
		}finally{
			Shader.offLoading();
	       }
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
			if(isVertexTab == true){ TabVertex(true); }
			if(isFragTab == true){ TabFrag(true); }
			if((isVertexTab == false) && (isFragTab == false)){ TabVertext(true); }			
		}

		if(tab_name == 'tab-scene'){
			//console.log('tab-scene');
		}
	},

	select_code_tab: function(element){
		var e = $(element);
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
		if(!Shader.validate_params()){return;}
		
		
		Shader.confirm_pop('confirm' ,'쉐이더를 업로드 하시겠습니까?', Shader.shader_submit_func(submit_type));
	},

	msg_pop: function(type, msg, style){
		style = typeof style !== 'undefined' ?  style : {};
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
	// 예/아니오 팝업
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
	
	shader_submit_func: function(submit_type){
		return function(){
			//로딩창 on
			Shader.onLoading();
		
			var action = '/shaders';
			var method = 'GET';

			switch(submit_type){
				case 'new':
					action = '/shaders';
					method = 'POST';
					break;
				case 'edit':				
					action = '/shaders/'+Shader.shader_params.id;
					method = 'PATCH';
					break;
				default:
					msg_pop('warning', '올바르지 않은 접근 입니다.');
			}
			console.log('start');
			$.ajax({
				url: action,
				type: method,
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
				success: function(data){	
					//beforeonload 이벤트 제거
					$(window).off('beforeunload');
					if(!(data.result===false)){
						//작성한 글로 이동
						location.href = "/shaders/"+data.shader.id;
					}else{
						Shader.msg_pop('error', '업로드를 실패했습니다.<br><br>다시 시도해 주세요');
					}
				},
				fail: function(){
					Shader.shader_pop_close();
					Shader.offLoading();
					Shader.msg_pop('error', '서버 연결에 실패했습니다.');
				},
				error: function(xhr, textStatus, errorThrown){
				        Shader.shader_pop_close();
					Shader.offLoading();
				        switch (xhr.status) {
						case 413:
							Shader.msg_pop('error', '파일 허용량을 초과했습니다.<br><br>첨부된 파일 사이즈를 조정해 주세요.');
						        break;
						default:
							Shader.msg_pop('error', '업로드를 실패했습니다.<br><br>다시 시도해 주세요');
						        break;
				        }
				}
			});	
		}
	},

	shader_submit: function(){
		//로딩창 on
		Shader.onLoading();
		
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
				//beforeonload 이벤트 제거
				$(window).off('beforeunload');
				if(!(data.result===false)){
					//작성한 글로 이동
					location.href = "/shaders/"+data.shader.id;
				}else{
					Shader.msg_pop('error', '업로드를 실패했습니다.<br><br>다시 시도해 주세요');
				}
			}
		});
	},

	destroy_confirm: function(){
		Shader.confirm_pop('confirm' ,'쉐이더를 삭제  하시겠습니까?', Shader.shader_destroy);
	},

	shader_destroy: function(){
		//로딩창 on
		Shader.onLoading();
		$.ajax({
			url:'/shaders/'+Shader.shader_params.id,
			type: 'DELETE',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			success:function(data){	
				//beforeonload 이벤트 제거
				$(window).off('beforeunload');

				if((data.result==='complete')){
					//작성한 글로 이동
					location.href = "/shaders";
				}else{
					Shader.msg_pop('error', '삭제를 실패했습니다.<br><br>다시 시도해 주세요');
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
		//img_data는 파일을 업로드 할때 set 된다.
		//업로드된 이미지가 없으면 GetImgData를 호출해 쉐이더를 캡쳐한다	
		if(Shader.shader_params.img_data==null || Shader.shader_params.img_data==''){
			Shader.shader_params.img_data = GetImgData();
		}
	},

	//유효성 검사
	validate_params: function(){
		if(Shader.shader_params.title.length < 1){ Shader.msg_pop('warning', '제목을 작성 해 주세요.'); return false; }
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
			e.removeClass('fas fa-heart liked');
			e.addClass('far fa-heart');
			action = 'delete';

		}else{
			e.removeClass('far fa-heart');
			e.addClass('fas fa-heart liked');
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
				//console.log(data);
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

	textarea_resize: function(e){
		e.style.height = "1px";
		e.style.height = (12+e.scrollHeight)+"px";
	},

	go_to_top: function(){
		document.documentElement.scrollTop = 0;
	},
	
	go_to_main: function(){
		location.href="/shaders";
	},

	doLogin: function(){
		var name = "ldap"
		var authUrl = "/auth/"+name
		var left = 400;
		var top = 200;
		var height = 250;
		var width = 500;

		var w = window.open(
				authUrl,
				"_blank",
				"menubar=no,status=no,height=" +
				height +
				",width=" +
				width +
				",left=" +
				left +
				",top=" +
				top
				);
		//const self = this;
		const timer = setInterval(function() {
			if (!w || w.closed) {
				console.log('close');
				clearInterval(timer);
				//self.set("authenticate", null);
			}
		}, 1000);
	},

	add_upload_img: function(){
		$('.img-upload').click();
	},

	set_upload_img: function(element){
		var e = $(element);
		var file = e[0].files[0];
		var reader = new FileReader();
		var max_file_size = 1*1024*1024; //1m 제한

		reader.onload = function(e) {
			var img_data = e.target.result;
			Shader.shader_params.img_data = img_data;
			$('.img-preview').attr('src', img_data);
			$('.img-preview').show();
			$('.img-remove-btn').show();
		}
		console.log(file);

		if(file.size > max_file_size){
			Shader.msg_pop('초과된 파일 크기', '파일이 너무 큽니다.(1m 제한)');
			return
		}
		console.log(file.type);
		if(file.type!='image/png' && file.type!='image/jpeg'){
			Shader.msg_pop('잘못된 형식', 'png, jpg 파일만 업로드 가능합니다.');
			return
		}

		reader.readAsDataURL(file);
	},
	remove_upload_img: function(){
		$('.img-preview').attr('src', null);
		$('.img-preview').hide();
		$('.img-remove-btn').hide();
		Shader.shader_params.img_data = null;
	}

};

var ShaderComment = {

	submit: function(){
		var e = $('#comment-text > textarea');
		var btn = $('#comment-submit');
		var content_text = e.val().trim();
		
		if(content_text == null || content_text.length < 1){
			Shader.msg_pop('알림', '공백으로 작성 할 수 없습니다.');
			return;
		}
		//완료시까지 textarea readonly, submit event remove
		e.attr('readonly', true);
		btn.attr('onclick', null);
		btn.children('i').removeClass('fa-commenting').addClass('fa-spinner');

		$.ajax({
			url:'/shaders/'+ Shader.shader_params.id +'/comment',
			type: 'POST',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			data: {			
				'shader_comment[shader_id]': Shader.shader_params.id,
				'shader_comment[content]': content_text
			},
			success:function(data){
				// 덧글 목록 작성
				if(!(data.result===false)){
					ShaderComment.get_list();
				}else{
					Shader.msg_pop('작성 실패!','댓글 작성을 실패했습니다.<br><br>다시 시도 해 주세요.');
				}

				//FIXME timeout 삭제 요
				//text area, submit event 원상복구
				setTimeout(function(){
				e.val('');
				e.attr('readonly', false);
				btn.attr('onclick', 'ShaderComment.submit()');
				btn.children('i').removeClass('fa-spinner').addClass('fa-commenting');
				}, 1000);
			}
		});
	},

	get_list: function(){

		$.ajax({
			url:'/shaders/'+ Shader.shader_params.id +'/comment',
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			success:function(data){
				if(!(data.result===false)){
					var comments = data.shaders;					
					ShaderComment.render_list(comments);
				}else{
					Shader.msg_pop('불러오기 실패!', '댓글을 불러오는데 실패했습니다.<br><br>페이지를 새로고침 해 주세요.');
				}
			}
		});
	},

	render_list: function(comments){
		var html = [];

		comments.forEach(function(raw){
			html.push('<div class="comment-raw" data-comment-id="'+raw.id+'">');
			html.push('<div class="avatar-div">');
			html.push('<a class="trigger-user-card main-avatar" href="#" data-user-card="'+raw.username+'" onclick="ShaderUser.open('+raw.user_id+')">');
			html.push('<img alt="" width="45" height="45" src="'+raw.avatar_template+'" title="username" class="avatar">');
			html.push('</a>');
			html.push('</div>');
			html.push('<div>');
			html.push('<span>');
			html.push('<b>'+raw.username+'</b> '+raw.created_at+' ');
			html.push('</span>');
			//작성자 본인일 경우에만 노출한다
			if(raw.editable){
				html.push('<span class="comment-btn-box">');
				html.push('<button class="widget-button btn-flat edit comment no-text btn-icon" aria-label="이 글 편집." title="이 글 편집.">');
				html.push('<a style="color:inherit" onclick="ShaderComment.edit('+raw.id+')">');
				html.push('<i class="fas fa-pencil-alt" aria-hidden="true"></i>');
				html.push('</a>');
				html.push('</button>');
				html.push('<button class="widget-button btn-flat delete comment no-text btn-icon" aria-label="이 글 삭제." title="이 글 삭제.">');
				html.push('<a style="color:inherit" onclick="ShaderComment.destroy('+raw.id+')">');
				html.push('<i class="fas fa-trash" aria-hidden="true"></i>');
				html.push('</a>');
				html.push('</button>');
				html.push('</span>');
			}
			html.push('</div>');
			html.push('<textarea class="comment-view" readonly>');
			html.push(raw.content);
			html.push('</textarea>');
			/*
			html.push('<div id="reply-text">');
			html.push(raw.content);
			html.push('</div>');
			*/
			html.push('</div>');
			html.push('');
		})
		$('.comment-list').html(html.join(''));
		
		$('.comment-view').each(function(num, e){
			e.style.height=e.scrollHeight+'px';
		});
	},

	destroy: function(comment_id){
		Shader.confirm_pop('댓글 삭제', '삭제 하시겠습니까?', function(){
			
			$.ajax({
				url:'/shaders/'+ Shader.shader_params.id +'/comment/'+comment_id,
				type: 'DELETE',
				beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
				dataType:'json',
				success:function(data){
					if(!(data.result===false)){
						Shader.shader_pop_close();
						ShaderComment.get_list();
					}else{
						Shader.msg_pop('삭제 실패!','댓글을 삭제하는데 실패했습니다.<br><br>다시 시도 해 주세요.');
					}
				}
			});
		});
	},

	edit: function(comment_id){
		var e = $('div[data-comment-id='+comment_id+']');
		var content = e.children('.comment-view').text();

		var textarea_html = [];
		textarea_html.push('<textarea class="comment-edit" placeholder="댓글을 솰라솰라" onkeydown="Shader.textarea_resize(this)" onkeyup="Shader.textarea_resize(this)">');
		textarea_html.push(content);
		textarea_html.push('</textarea>');

		e.children('.comment-view').remove();		
		e.append(textarea_html.join(''));

		var btn_html = [];
		btn_html.push('<button class="widget-button btn-flat edit comment no-text btn-icon" aria-label="이 글 편집." title="이 글 편집." ' 
				+ 'onclick="ShaderComment.edit_submit('+comment_id+')">');
		btn_html.push('<i class="fa fa-check" aria-hidden="true"></i>');
		btn_html.push('</button>');
		btn_html.push('<button class="widget-button btn-flat edit comment no-text btn-icon" aria-label="취소" title="취소." onclick="ShaderComment.edit_close()">');
		btn_html.push('<i class="fa fa-close" aria-hidden="true"></i>');
		btn_html.push('</button>');
		e.find('div > span.comment-btn-box').html(btn_html.join(''));

		$('.comment-edit').each(function(num, e){
			e.style.height=e.scrollHeight+'px';
		});
		
	},

	edit_submit: function(comment_id){
		var e = $('div[data-comment-id='+comment_id+']');
		var content_text = e.children('textarea').val().trim();

		if(content_text == null || content_text.length < 1){
			Shader.msg_pop('알림', '공백으로 작성 할 수 없습니다.');
			return;
		}

		Shader.confirm_pop('댓글 수정', '수정 하시겠습니까?', function(){
			
			$.ajax({
				url:'/shaders/'+ Shader.shader_params.id +'/comment/'+comment_id,
				type: 'PATCH',
				beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
				dataType:'json',
				data: {			
					'comment_id': comment_id,
					'shader_comment[shader_id]': Shader.shader_params.id,
					'shader_comment[content]': content_text
					
				},
				success:function(data){
					if(!(data.result===false)){
						Shader.shader_pop_close();
						ShaderComment.get_list();
					}else{
						Shader.msg_pop('warning', '댓글을 수정하는데 실패했습니다.<br><br>다시 시도 해 주세요.');
					}
				}
			});
		});
	},

	edit_close: function(comment_id){
	
		ShaderComment.get_list();	
	}
	

}

var CreateWidget = {

	open: function(){
		//스토리지 비움
		localStorage.clear();
		var html = [];
		html.push('<div class="overlay">');
		html.push('</div>');
		$('body').prepend(html.join(''));
		$('.overlay').append($('.create-widget')).show();
		$('.create-widget').fadeIn().css('display', 'block');
	},

	close: function(){
		$('.create-widget').fadeOut(function(){
			$('body').append($('.create-widget'));
			$('.overlay').remove();
		});
		//$('body').append($('.create_widget'));
	},

	create_empty: function(){
		location.href = '/shaders/new';
	},

        add_fbx: function(){
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
			alert('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
		}
	},

	on_vertex: function(){
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
			alert('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
		}
	},

	on_fragment: function(){
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
			alert('해당 브라우져에서는 지원하지 않습니다. \r\n 빈프로젝트를 생성 해 주세요.');
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

var ShaderUser = {

	open: function(id){
		//사용자 정보 가져온다
		$.ajax({
			url:'/shaders/user/'+id,
			type: 'GET',
			beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
			dataType:'json',
			success:function(data){
				if(!(data==null || data.result==false)){
					ShaderUser.render_widget(data);
				}else{
					Shader.msg_pop('불러오기 실패!', '사용자 정보를 불러오는데 실패했습니다.<br><br>다시 시도 해 주세요.');
				}
			}
		});
		
	},
	close: function(){
		$('.user-info-widget').fadeOut(function(){
			$('.overlay').remove();
		});
	},

	render_widget: function(data){
		var profile = data.profile;
		var sc = data.shader_count;
		var rlc = data.receive_like_count;
		var slc = data.send_like_count;
		var rbc = data.receive_bookmark_count;
		var sbc = data.send_bookmark_count;
		var lb = JSON.parse(data.latest_bookmark);
		var lc = JSON.parse(data.latest_comment);
		var ls = JSON.parse(data.latest_shader);

		var html = [];
		html.push('<div class="overlay">');

		html.push('<div class="user-info-widget">');
		html.push('<div class="widget-table-box">');
		html.push('<table align="left">');
		html.push('<thead>');
		html.push('<tr><th></th><th></th><th></th><th></th><th></th></tr>');
		html.push('<tr>');
		html.push('<th colspan="5">');
		html.push('<button id="widget-close" class="btn widget-close" onclick="ShaderUser.close()">');
		html.push('<i class="fa fa-close d-icon d-icon-plus"></i>');
		html.push('</button>');
		html.push('</th>');
		html.push('</tr>');
		html.push('<tr>');
		html.push('<th>');
		html.push('<img alt="" width="60" height="60" src="'+profile.avatar_template+'" title="biokim" class="avatar">');
		html.push('</th>');
		html.push('<th colspan="2">');
		html.push(profile.username);
		html.push('</th');
		html.push('<th colspan="2"></th>');
		html.push('</tr>');
		html.push('<tr class="user-info-summary">');
		html.push('<th colspan="5">');
		html.push('<span><span>'+sc+'</span><span>작성한 글 수</span></span>');
		html.push('<span><span>'+rlc+'</span><span>추천 받은 수</span></span>');
		html.push('<span><span>'+slc+'</span><span>추천한 게시 물 수</span></span>');
		html.push('<span><span>'+rbc+'</span><span>북마크 된 횟수</span></span>');
		html.push('<span><span>'+sbc+'</span><span>북마크한 글 수</span></span>');
		html.push('</th>');
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody>');
		html.push('<tr><td colspan="5"><hr/></td></tr>');
		html.push(ShaderUser.render_latest_shader(ls));
		html.push('<tr><td colspan="5"><hr/></td></tr>');
		html.push(ShaderUser.render_latest_comment(lc));
		html.push('<tr><td colspan="5"><hr/></td></tr>');
		html.push(ShaderUser.render_latest_bookmark(lb));
		html.push('');
		html.push('');
		html.push('</tbody>');
		html.push('</table>');
		html.push('</div>');
		html.push('</div>');

		html.push('</div>');

		$('body').prepend(html.join(''));
		$('.overlay').show();
		$('.user-info-widget').fadeIn();
	},
	render_latest_shader: function(ls){
		var html = [];
		if(ls.length < 1){
			html.push('<tr>');
			html.push('<td colspan="2"><span>최근 작성한 쉐이더<span></td>');
			html.push('<td colspan="3">작성한 쉐이더가 없습니다.</td>');
			html.push('</tr>');
		}
	
		ls.forEach(function(shader, num){
			html.push('<tr>');
			if(num==0){
				html.push('<td rowspan="'+ls.length+'" colspan="2"><span>최근 작성한 쉐이더<span></td>');
			}
			html.push('<td colspan="3"><div><a href="/shaders/'+shader.id+'" title="'+shader.title+'">'+shader.title+'</a></div><span>'+shader.created_dt+'<span></td>');
			html.push('</tr>');
			
		});
	
		return html.join('');
	},

	render_latest_comment: function(lc){
		var html = [];
		if(lc.length < 1){
			html.push('<tr>');
			html.push('<td colspan="2"><span>최근 작성한 댓글<span></td>');
			html.push('<td colspan="3">작성한 댓글이 없습니다.</td>');
			html.push('</tr>');
		}
	
		lc.forEach(function(comment, num){
			html.push('<tr>');
			if(num==0){
				html.push('<td rowspan="'+lc.length+'" colspan="2"><span>최근 작성한 댓글<span></td>');
			}
			html.push('<td colspan="3"><div><a href="/shaders/'+comment.shader_id+'" title="'+comment.content+'">'+comment.content+'</a></div><span>'+comment.created_dt+'<span></td>');
			html.push('</tr>');
		});
	
		return html.join('');
	},

	render_latest_bookmark: function(lb){
		var html = [];
		if(lb.length < 1){
			html.push('<tr>');
			html.push('<td colspan="2"><span>최근 북마크 한 글<span></td>');
			html.push('<td colspan="3">북마크한 글이 없습니다.</td>');
			html.push('</tr>');
		}
	
		lb.forEach(function(shader, num){
			html.push('<tr>');
			if(num==0){
				html.push('<td rowspan="'+lb.length+'" colspan="2"><span>최근 북마크 한 글<span></td>');
			}
			html.push('<td colspan="3"><div><a href="/shaders/'+shader.id+'" title="'+shader.title+'">'+shader.title+'</a></div><span>'+shader.created_dt+'<span></td>');
			html.push('</tr>');
			
		});
	
		return html.join('');
	}

}

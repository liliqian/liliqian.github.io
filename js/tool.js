//创建右键菜单函数;
function showContextmenu(data){
	var contextmenu=document.getElementById("contextmenu");
	contextmenu.innerHTML="";
	contextmenu.style.display="block";
	data.forEach(function(v,k){
		var li=document.createElement("li");
		li.innerHTML=v.name;
		li.onclick=v.exe;
		contextmenu.appendChild(li);
	})
}
//隐藏右键菜单函数;
function hideContextmenu(){
	var contextmenu=document.getElementById("contextmenu");
	contextmenu.style.display="none";
}
//刷新页面函数;
function refreshDirectory(data, canEdit){
	var file_container=document.getElementById("file_container");
	var loadnum=document.getElementById("loadnum");
	loadnum.innerHTML="已全部加载，共"+data.length+"个";
	file_container.onmousedown=function(ev){
		var e=ev||event;
		e.cancelBubble=true;
	}
	$("#file_operate").hide();
	$("#file_name").html("文件名");
	$("#check_icon").removeClass("framecheck");
	file_container.innerHTML="";
	for(var i=0;i<data.length;i++){
		//判断modify(修改)的真假，用来判断文件夹是不是编辑的状态，第一个条件是用来判断哪个文件夹是新增的（记录下i值）；
		//新建文件夹:第二个条件肯定为true，主要通过对第一个条件来区分最后一个文件夹是可编辑的状态;
		//删除文件夹:删除的不是最后一个文件夹，第一个条件符合，但是不能出现编辑状态，所以要求第二个参数必须是false;
		var modify=datas.global.fileid==data[i].id&& canEdit ? true: false;
		createFolder(data[i], modify);
    }
	if(modify!=true){
		addevent();
		creatcrashdiv();
	}
    refreshDirectoryPosition();
}
//新建文件夹函数;
 function createFolder(data, last){
 	var str='<div class="fileBox">'
		      	+'<div class="fileinner">'
	            	+'<div class="fileImage bg"></div>'
	            	+'<s class="checkbox bg"></s>'
	            +'</div>'
	            +'<p class="fileName">'+data.name+'</p>'
	            +'<div class="new_dir_item  new_file" >'
	            	+'<input type="text" value="新建文件夹" class="new_dir_box"/>'
	            	+'<span class="new_dir_sure  bg"></span>'
	            	+'<span class="new_dir_cancel bg"></span>'
	            +'</div>'
        	+'</div>' 
    var fileBox=$(str); 
 	fileBox.attr("fileid",data.id);
    fileBox.attr("filepid",data.pid);
	//文件夹名字确定，生成文件夹,并添加事件；
	fileBox.find("span.new_dir_sure").click(function(ev){
		var new_dir_box=fileBox.find("input.new_dir_box")
		if(new_dir_box.val()){
			var e=ev||event;
			data.name=new_dir_box.val();
			fileBox.find("p.fileName").html(new_dir_box.val());
			for(var i=0;i<datas.files.length;i++){
				if(new_dir_box.val()==datas.files[i].name&&fileBox.attr("fileid")!=datas.files[i].id&&fileBox.attr("filepid")==datas.files[i].pid){
					alert("该文件夹名称已存在，请修改文件夹名称")
					return;
				}
			}
			namesure.call($(this));
			addevent();
			creatcrashdiv();
			datas.global.newfilelock=false;
			e.cancelBubble=true;
		}else{
			alert("请输入文件夹名称后点击确定按钮")
		}
	})
	fileBox.find("span.new_dir_cancel").click(function(ev){
		//括号内条件为判断点击取消时文件夹是否可删除
		var e=ev||event;
		if(datas.global.isremove){
			fileBox.remove();
		 	datas.files.pop();
		}else{
			fileBox.find("p.fileName").css("display","block");
			fileBox.find("div.new_dir_item").css("display","none");
		}
		 addevent();
		 creatcrashdiv();
		 datas.global.newfilelock=false;
		 e.cancelBubble=true;
	})
	
	if (last != true) {
		fileBox.find("p.fileName").css("display","block");
		fileBox.find("div.new_dir_item").css("display","none");
	}	
    $("#file_container").append(fileBox); 	
 }
 //为文件夹添加事件函数;
 function addevent(){
 	$(".fileBox").each(function(){
 		//为创建的文件夹绑定拖拽事件；
		drag($(this)[0]);
		//为创建的文件夹添加双击事件；
	 	$(this).on("dblclick",function(){
	 		$("#allfile").hide();
	 		$("#module_num a").show();
	 		datas.global.filepid = $(this).attr("fileid");
	 		refreshDirectory(getChildren())
	 	});
		//选中框点击事件
		$(this).find(".checkbox").on("click",function(){
			checkboxclick.call($(this))
		});
		//fileBox鼠标移出事件；
		$(this).on("mouseout",fileBoxout);
		//fileBox鼠标移入事件；
	 	$(this).on("mouseover",fileBoxover);
 	})
 }
 //文件夹移出事件函数;
function removeevent(){
	$(".fileBox").each(function(){
	  $(this).off("dblclick");
	  $(this).off("mouseout");
	  $(this).off("mouseover");
	  $(this).find(".checkbox").off("click");
	  drag($(this)[0],true);
	})
}
//新建文件夹修改文件夹名字点击确定后;
function namesure(){
	$(this).parent().hide();
	$(this).parent().prev().show();
}
 //刷新文件夹位置;
 function refreshDirectoryPosition(){
 	var folders=document.querySelectorAll(".fileBox");
 	var file_container=document.getElementById("file_container");
 	var width=146;
 	var height=132;
   	var multiple=Math.floor((file_container.offsetWidth-10)/width);
   	for(var i=0;i<folders.length;i++){
   		folders[i].style.position="absolute";
   		folders[i].style.left=i%multiple*width+10+"px";
   		folders[i].style.top=Math.floor(i/multiple)*height+"px";
   	}
 }
 //移动一个文件夹至另一个文件夹;
 function drag(obj,unbind){
 	//第二个参数如果有值，则不能拖拽，主要是为了取消拖拽；
 	if(unbind==true){
 		obj.onmousedown=null;
 		return;
 	}
 	obj.onmousedown=function(ev){
   		var e=ev||event;
   		var folders = document.querySelectorAll('.fileBox');
        obj.style.zIndex = zIndex++;
   		var disX=e.clientX-this.offsetLeft;
   		var disY=e.clientY-this.offsetTop;
   		
   		document.onmousemove=function(e){
   			obj.style.left=e.clientX-disX+"px";
   			obj.style.top=e.clientY-disY-4+"px";
   		}
   		document.onmouseup=function(){
   			document.onmousemove=document.onmouseup=null;
   			for(var i=0;i<folders.length;i++){
   				if(obj!=folders[i]&&crash(obj, folders[i])){
   					var infor1=getInfo($(obj).attr('fileid'));
					var infor2=getInfo($(folders[i]).attr('fileid'));
   					infor1.pid=infor2.id;
     				refreshDirectory(getChildren())
     				break;
   				}
   			}
   		}
   		e.cancelBubble=true;
   	 	return false;
 	}
 }
 //根据指定的id查找其下一级子数据;
function getChildren(){
	var pid=datas.global.filepid;
	var arr=[];
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].pid==pid){
			arr.push(datas.files[i]);
		}
	}
	return arr;
} 
//根据指定id查找对应的数据;
function getInfo(id) {
	for(var i=0;i<datas.files.length;i++){
		if(datas.files[i].id==id){
			return datas.files[i]
		}
	}
	
}
//根据datas下files中的最大id值;
function getMaxId() {
    var maxId = datas.files[0].id;
    for(var i=0;i<datas.files.length;i++){
    	if(datas.files[i].id>maxId){
    		maxId=datas.files[i].id;
    	}
    }
    return maxId;
}
//如下为盒子点击事件;	
function checkboxclick(){
	if($(this).hasClass("checkboxed")){
		$(this).removeClass("checkboxed");		
	}else{
		$(this).addClass("checkboxed");
	}
	var allslect=countnum();
	isallchecked(allslect)
}
//fileBox鼠标移出事件;
function fileBoxout(){
	if($(this).find("s.checkbox").hasClass("checkboxed")){
		$(this).find("div.fileinner").addClass("fileinnerchecked");
		$(this).find("s.checkbox").addClass("checkboxhover");
	}else{
		$(this).find("div.fileinner").removeClass("fileinnerchecked");
		$(this).find("s.checkbox").removeClass("checkboxhover");
	}
}
//fileBox鼠标移入事件;
function fileBoxover(){
	$(this).find("div.fileinner").addClass("fileinnerchecked");
	$(this).find("s.checkbox").addClass("checkboxhover");
}
//删除文件夹事件;
function deletefile(){
	$(".checkbox").each(function(){
		if($(this).hasClass("checkboxed")){
			var startnum=$(this).parent().parent().attr("fileid");
			for (attr in datas.files){
				if(startnum==datas.files[attr].id){
					datas.files.splice(attr,1);
				}
			}
		}
	})
	refreshDirectory(getChildren());
	countnum();
	$("#check_icon").removeClass("framecheck");
}
//计算被选中文件夹的数量之和;
function countnum(){
	var num=0;
	var allchecked=true;
	if($(".checkbox").length==0){
		allchecked=false;
	}
	$(".checkbox").each(function(){
		if($(this).hasClass("checkboxed")){
			num++
		}else{
			allchecked=false;
		}
	})
	if(num>0){
		$("#file_operate").show();
		$("#file_name").html("已选中"+num+"个文件/文件夹");
	}else{
		$("#file_operate").hide();
		$("#file_name").html("文件名");
	}
	if(num>=2){
		$("#rename").css("color","#c8d9ec")
	}else{
		$("#rename").css("color","#666666")
	}
	return allchecked;
}
//创建文件夹全选中或者文件夹全部取消选中事件;
function isallchecked(allslect){
	if(allslect){
		$("#check_icon").addClass("framecheck");
	}else{
		$("#check_icon").removeClass("framecheck");
	}
}
//检测碰撞(单独移动某个文件夹);
function crash(obj1, obj2) {
    var pos1 = obj1.getBoundingClientRect();
    var pos2 = obj2.getBoundingClientRect();
    var left = pos1.left-pos2.left;
    var top = pos1.top-pos2.top;
    return Math.sqrt(left*left+top*top)<30;
}
//检测碰撞（蓝色阴影div与每个文件夹;
function Crash(obj1, obj2) {
    var pos1 = obj1.getBoundingClientRect();
    var pos2 = obj2.getBoundingClientRect();
    //if括号内为不会碰撞的条件，符合条件返回true;
   	if(pos1.right<pos2.left || pos1.bottom<pos2.top ||pos1.left>pos2.right || pos1.top>pos2.bottom ){
   		return true;
   	}else{
   		return false;
   	}
}
//新生成可检测碰撞的div蓝色阴影盒子以及大小位置偏移、检测碰撞的设置;
function creatcrashdiv(){
	var file_container=document.getElementById("file_container")
	var startX,startY;
	file_container.onmousedown=function(ev){
		var frame_all=document.getElementById("frame_all");
		var e=ev||event;
		startX=e.clientX;
		startY=e.clientY;
		var div=document.createElement("div");
		div.style.left=e.clientX+"px";
		div.style.top=e.clientY+"px";
		div.className="collision";
		div.id="crash";
		frame_all.appendChild(div);
		document.onmousemove=function(ev){
			var e=ev||event;
			var disX=e.clientX-startX>0?e.clientX-startX:-(e.clientX-startX);
			var disY=e.clientY-startY>0?e.clientY-startY:-(e.clientY-startY);
			div.style.width=disX+"px";
			div.style.height=disY+"px";
			if(e.clientX-startX<0){
				div.style.left=(e.clientX+2)+"px";
				div.style.top=(e.clientY+2)+"px";
			}
			collision(div);
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			frame_all.removeChild(div)
		}
		return false;
	}

}
//检测新生成的检测碰撞div蓝色阴影盒子与当前层级下所有文件夹的碰撞情况;
function collision(obj){
	var folders = document.querySelectorAll('.fileBox');
	for(var i=0;i<folders.length;i++){
		var checkbox=folders[i].getElementsByClassName("checkbox")[0];
		var fileinner=folders[i].getElementsByClassName("fileinner")[0];
		if(!Crash(obj,folders[i])){
			$(checkbox).addClass("checkboxed checkboxhover");
			$(fileinner).addClass("fileinnerchecked");
		}else{
			$(checkbox).removeClass("checkboxed checkboxhover");
			$(fileinner).removeClass("fileinnerchecked");
		}
	}
	var allslect=countnum();
	isallchecked(allslect)
}
//文件夹重命名;
function Rename(){
	$("#rename").on("click",rename)
}
//文件夹重命名函数;
function rename(ev){
	var e=ev||event;
	var file_container=document.getElementById("file_container");
	if($(".checkboxed").length==1){
		datas.global.isremove=false;
		$(".checkboxed").parent().next().css("display","none");
		$(".checkboxed").parent().parent().find("input").val($(".checkboxed").parent().next().html());
		$(".checkboxed").parent().parent().find("div.new_dir_item").css("display","block");
		datas.global.newfilelock=true;
		removeevent();
		//取消在file_container区域点击鼠标后生成div的事件；
		file_container.onmousedown=function(ev){
			var e=ev||event;
			e.cancelBubble=true;
			if( ev.target.nodeName != "INPUT" ){
				e.preventDefault();
			}
		}
	}
	e.cancelBubble=true
}
//返回当前文件夹的上一级;
function returnupperlevel(){
	$("#upperlevel").click(function(){
		for (attr in datas.files){
			if(datas.global.filepid==datas.files[attr].id){
				datas.global.filepid=datas.files[attr].pid;
			}
		}
	 	refreshDirectory(getChildren())
	 	if(datas.global.filepid==0){
	 		$("#allfile").show();
	 		$("#module_num a").hide();
	 	}

	})
}
//返回文件夹首页;
function Firstlevel(){
	$("#firstlevel").click(firstlevel)
}
//返回文件夹首页函数;
function firstlevel(){
	datas.global.filepid=0;
 	refreshDirectory(getChildren())
 	$("#allfile").show();
 	$("#module_num a").hide();
}
//以下为input搜索文件区域，使用jsonp实现跨域;
var script = null;
function search(){
	var inps=document.getElementById("inps");
	inps.oninput = function(){
		script = document.createElement('script');
		script.src = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd='+this.value+'&cb=creatli';
		document.body.appendChild(script);
	}
}
//根据生成的信息新建下拉的li;
function creatli(data){
	var search_content=document.getElementById("search_content");
	var str="";
	if(data.s.length>0){
		for(var i=0;i<data.s.length;i++){
			str+="<li>"+data.s[i]+"</li>"
		}
		search_content.innerHTML=str;
		$(search_content).find("li").click(function(){
			$("#inps").val($(this).html());
			$(search_content).css("display","none");
		})
		search_content.style.display="block";
	}else{
		search_content.style.display="none";
	}
	
	document.body.removeChild(script);
}
//搜索提交按钮;
function submit(){
	$("#submit").click(function(){
		$("#form").submit();
	})
}
//按键选择下拉选项;
function dropdownoption(){
	var num=0;
	$("#inps").keydown(function(ev){
		var e=ev||event;
		switch(e.keyCode){
			case 38:
				num--
				num=num<0?9:num;
				 dropdownchange(num)
				break;
			case 40:
				if(num==0&&$("#inps").val()!=$("#search_content li").eq(0).html()){
					num=0;
				}else{
					num++
					num=num%10;
				}
				 dropdownchange(num)
				break;
			case 13:
				$(search_content).css("display","none");
		}
	})
}
//每条下拉被选中后的状态;
function dropdownchange(num){
	$("#inps").val($("#search_content li").eq(num).html());
	$("#search_content li").css("backgroundColor","#fff");
	$("#search_content li").eq(num).css("backgroundColor","#c5dffc");
}


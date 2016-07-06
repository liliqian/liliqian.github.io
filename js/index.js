var zIndex = 1;
$(document).ready(function(){
	(function(){
		var SkyDrive=document.getElementById("Skydrive");
		var text=document.getElementById("text");
		var bg=document.getElementById("bg");
		var classify=document.getElementById("classify");
		var lis=classify.getElementsByTagName("li");
		var navr=document.getElementById("nav_r");
		var infor=document.getElementById("infor");
		var inps=document.getElementById("inps");
		var member=document.getElementById("member");
		var more=document.getElementById("more");
		var perdata=document.getElementById("personal_data");
		var detail=document.getElementById("detail");

		SkyDrive.onmouseover=function(){
			classify.style.display="block";
			text.style.color="#333333";
			bg.style.backgroundPosition="-153px -16px";
		}
		SkyDrive.onmouseout=function(){
			for(var i=0;i<lis.length;i++){
				lis[i].onmouseover=function(){
					this.style.backgroundColor="#e0e1e5";
				}
				lis[i].onmouseout=function(){
					this.style.backgroundColor="";					
				}
			}
			classify.style.display="none";
			text.style.color="#ffffff";
			bg.style.backgroundPosition="-130px -16px";
				
		}
		inps.onfocus=function(){
			inps.value=""
		}
		inps.onblur=function(){
			inps.value="搜索你的文件";
		}
		member.onmouseover=function(){
			perdata.style.display="block"
		}
		member.onmouseout=function(){
			perdata.style.display="none"
		}
		more.onmouseover=function(){
			detail.style.display="block"
		}
		more.onmouseout=function(){
			detail.style.display="none"
		}
	})();
	(function(){
		var sideOpt=document.getElementById("side_options");
		var lis=sideOpt.getElementsByTagName("li")
		var optionPanel=document.getElementById("option_panel");
		lis[3].onmouseover=function(){
			optionPanel.style.display="block";
			lis[3].onmouseout=function(){
				optionPanel.style.display="none";
			}
		}
		optionPanel.onmouseover=function(){
			lis[3].onmouseout=null;
			optionPanel.style.display="block";
		}
		optionPanel.onmouseout=function(){
			optionPanel.style.display="none";
		}
		
		//设置frame_aside的整体高度；
		function setHeight(){
			var $height =$(window).height()-parseInt($("#frame_nav").css("height"))-14;
			$("#frame_aside").css("height",$height);
		}
		setHeight();
		$(window).on("resize",function(){
           	setHeight();
        })
		
	})();
	
	//如下为设置frame_main操作文件夹区域;
	//设置file_container的整体高度;
	(function(){
		function setHeight(){
			var file_container=document.getElementById("file_container")
			var screenheight=document.documentElement.clientHeight;
			var topheight =file_container.getBoundingClientRect().top;
			file_container.style.height=screenheight-topheight+"px";
		}
		setHeight();
		$(window).on("resize",function(){
           	setHeight();
     	})
	})();
		
	//点击右键菜单;
	$("#file_container").contextmenu(function(ev){
		var e=ev||event;
		var contextmenu=document.getElementById("contextmenu");
		showContextmenu(datas.contextmenu.common);
		contextmenu.style.left=e.clientX+"px";
		contextmenu.style.top=e.clientY+"px";
		e.cancelBubble=true;
        return false;
	})
	//鼠标点击文档,隐藏右键菜单;
    document.onclick = hideContextmenu;
    
	//根据已有文件数据  datas.files 来初始化创建文件夹/文件
    refreshDirectory( getChildren() );

    //根据屏幕窗口刷新目录
    window.onresize = refreshDirectoryPosition;

	//创建新建文件夹按钮事件
    $("#creatnewfile").click(datas.contextmenu.common[0].exe);
    
    //创建删除文件夹按钮事件
    $("#delete_button").click(deletefile);
    
    //创建文件夹全选中或者文件夹全部取消选中事件；
    $("#check_icon").click(function(){
    	if($(this).hasClass("framecheck")){
    		$(".checkbox").removeClass("checkboxed");
    		$(".checkbox").removeClass("checkboxhover");
    		$(".fileinner").removeClass("fileinnerchecked");
    	}else{
    		$(".checkbox").addClass("checkboxed");
    		$(".checkbox").addClass("checkboxhover");
    		$(".fileinner").addClass("fileinnerchecked");
    	}
    	var allslect=countnum();
		isallchecked(allslect);	
    })
   
   // 新生成div以及div大小位置偏移的设置以及检测碰撞
   creatcrashdiv();
   
   //文件夹重命名
   Rename();
   
   //返回当前文件夹的上一级
   returnupperlevel();
   
   //返回文件夹首页
   Firstlevel();
   
   //搜索
   search();
   
   //提交搜索申请
   submit();
   
   //搜索下拉通过键盘上下选择；
   dropdownoption();
   
});

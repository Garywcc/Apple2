$(function(){
	var pro=$('.footer a').eq(0);
	var iTu=$('.footer a').eq(1);
	var lis=$('.box li');
	var oPos=[];

	//布局转换
	for(var i=0;i<lis.length;i++){
		lis[i].index=i;
		oPos[i]=lis[i].offsetLeft;
		

	}

	for(var i=0;i<lis.length;i++){
		lis[i].style.position="absolute";
		lis[i].style.left=oPos[i]+'px';
		
	}

	var caret=$(".caret").get(0);
	
	pro.bind('click',function(){
		
		var len=lis.length;

		var j=len-1;
		var wid=$(lis[1]).innerWidth();
		var trimer=null;
		if(!trimer){
			clearInterval(trimer)
		}
		var trimer=setInterval(function(){
			
				miaovStartMove(lis[j], {"left":parseInt(oPos[j])}, MIAOV_MOVE_TYPE.FLEX);
				
			
			if(j==0){
				clearInterval(trimer)
			}
			j--;
		},100)
		var target=this.offsetLeft+this.offsetWidth/2;

		miaovStartMove(caret, {"left":parseInt(target)}, MIAOV_MOVE_TYPE.BUFFER);
		$(this).addClass("show").siblings().removeClass("show");
	});
	iTu.bind('click',function(){
		
		var j=0;
		var len=lis.length;
		var num=len-1;
		var wid=$(lis[1]).innerWidth();
		var trimer=null;
		if(!trimer){
			clearInterval(trimer)
		}
		var trimer=setInterval(function(){
			if(j<len/2){
				
				miaovStartMove(lis[j], {"left":-900}, MIAOV_MOVE_TYPE.FLEX)
			}else{
				miaovStartMove(lis[j], {"left":parseInt(oPos[j-6])}, MIAOV_MOVE_TYPE.FLEX);
				
			}
			if(j==num){
				clearInterval(trimer)
			}
			j++;
		},100)
		var target=this.offsetLeft+this.offsetWidth/2;

		miaovStartMove(caret, {"left":target}, MIAOV_MOVE_TYPE.BUFFER);
		$(this).addClass("show").siblings().removeClass("show");
	});

})



















































//弹性运动框架
function css(obj, attr, value)
{
	if(arguments.length==2)
		return parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);
	else if(arguments.length==3)
		switch(attr)
		{
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value*100+")";
				obj.style.opacity=value;
				break;
			default:
				obj.style[attr]=value;
		}
	
	return function (attr_in, value_in){css(obj, attr_in, value_in)};
}

var MIAOV_MOVE_TYPE={
	BUFFER: 1,
	FLEX: 2
};

function miaovStartMove(obj, oTarget, iType, fnCallBack, fnDuring)
{
	var fnMove=null;
	if(obj.timer)
	{
		clearInterval(obj.timer);
	}
	
	switch(iType)
	{
		case MIAOV_MOVE_TYPE.BUFFER:
			fnMove=miaovDoMoveBuffer;
			break;
		case MIAOV_MOVE_TYPE.FLEX:
			fnMove=miaovDoMoveFlex;
			break;
	}
	
	obj.timer=setInterval(function (){
		fnMove(obj, oTarget, fnCallBack, fnDuring);
	}, 15);
}

function miaovDoMoveBuffer(obj, oTarget, fnCallBack, fnDuring)
{
	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in oTarget)
	{
		cur=css(obj, attr);
		if(oTarget[attr]!=cur)
		{
			bStop=false;
			
			speed=(oTarget[attr]-cur)/5;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			css(obj, attr, cur+speed);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);
	
	if(bStop)
	{
		clearInterval(obj.timer);
		obj.timer=null;
		
		if(fnCallBack)fnCallBack.call(obj);
	}
}

function miaovDoMoveFlex(obj, oTarget, fnCallBack, fnDuring)
{
	var bStop=true;
	var attr='';
	var speed=0;
	var cur=0;
	
	for(attr in oTarget)
	{
		if(!obj.oSpeed)obj.oSpeed={};
		if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
		cur=css(obj, attr);
		if(Math.abs(oTarget[attr]-cur)>1 || Math.abs(obj.oSpeed[attr])>1)
		{
			bStop=false;
			
			obj.oSpeed[attr]+=(oTarget[attr]-cur)/5;
			obj.oSpeed[attr]*=0.7;
			var maxSpeed=65;
			if(Math.abs(obj.oSpeed[attr])>maxSpeed)
			{
				obj.oSpeed[attr]=obj.oSpeed[attr]>0?maxSpeed:-maxSpeed;
			}
			
			css(obj, attr, cur+obj.oSpeed[attr]);
		}
	}
	
	if(fnDuring)fnDuring.call(obj);
	
	if(bStop)
	{
		clearInterval(obj.timer);
		obj.timer=null;
		if(fnCallBack)fnCallBack.call(obj);
	}
}
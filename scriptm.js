"use strict";console.log("Hello, world!");const e=window.performance&&(performance.now||performance.mozNow||performance.oNow||performance.webkitNow),t=function(e=60){this._fps=e,this._start=this._getTime()};t.prototype._getTime=function(){return e&&e.call(performance)||(new Date).getTime()},t.prototype.onAscFrame=function(){const e=this._getTime();return Math.floor((e-this._start)/(1e3/this._fps))};const n=function(e=0,t=0){this.x=e,this.y=t},o=function(e,t,n){this.width=e,this.height=t,this.position=n,this.img=new Image,this.img.src=this.width>40?"img/block.png":"img/block_n.png"},i=function(e,t){this.str=e,this.position=t},s={down:new Audio("sound/down.mp3"),jump:new Audio("sound/jump.mp3"),speed:new Audio("sound/speedup.mp3"),score:new Audio("sound/scoreup.mp3")},r=new t(60),c=1,a=-1,l=document.getElementById("fov"),d=document.getElementById("reset_btn"),m=document.getElementById("fps"),g=document.getElementById("mainCanvas"),h=g.getContext("2d");let p=sessionStorage.getItem("fov")??50,u=g.width/p,w=sessionStorage.getItem("maxScore")??0,f=0,y=0,_=0,v=.4;const S=.5;let x=20;const I=75;let k,E=0;const T=200,b=40,M=35,A=40,L=10,j=new function(){this.position=new n,this.velocity=new n,this.score=0,this.onGround=!0,this.run_img_src=["img/char_0.png","img/char_1.png","img/char_2.png"],this.jump_img_src="img/char_j.png",this.dead_img_src="img/char_d.png"},R=[],C=[],G=[];let $=25,B=0,O=0,F=0,H=-1,N=!1;const D=new Image,P=new Image,q=new Image;function z(e=(new Date).getTime()){if(y==k+2)return h.drawImage(q,256,-10,512,256),s.down.pause(),s.down.currentTime=0,s.down.play(),t=j.score,void sessionStorage.setItem("maxScore",0==sessionStorage.length?t:Math.max(sessionStorage.getItem("maxScore"),t));var t;if(h.clearRect(0,0,g.width,g.height),W(),R.length<6&&($+=K(x,I),R.push(new o(K(15,55),K(45,100),new n($,0)))),C.length<10){B+=K(30,100);let e=K(0,50);C.push(new n(B,30+e))}if(G.length<50){O+=K(5,20);let e=K(5,45);G.push(new i("w".repeat(K(1,5)),new n(O,T+e)))}!function(e){if(y=r.onAscFrame(),y==H)return;N=!1;for(let e=0;e<R.length;e++){let t=j.position.x,n=j.position.y,o=R[e].position.x,i=R[e].width,s=R[e].height,r=Math.abs(t-o),c=b/u;if(t>o&&(r=t-(o+i/u),c=0),r<c&&n+s>0){(0==c||Math.abs(t-o)<b/u/2)&&(j.dead_img_src="img/char_dh.png"),N=!0,v=0,E=a;break}}E==a?(k=k??y,D.src=j.dead_img_src):j.onGround?D.src=j.run_img_src[f]:(j.velocity.y+=S,j.position.y+=j.velocity.y,j.position.y>0&&(j.position.y=0,j.velocity.y=0,j.onGround=!0,D.src=j.run_img_src[f]));if(_+=v,j.position.x=_,H=y,y%5==0&&E!=a){let t=e-F;F=e,m.innerText=`[fps]: ${(1e3/(t/5)).toPrecision(5)}`,f=(f+1)%3}y%6==0&&E==c&&j.score++;j.score%100==0&&0!=j.score&&(s.speed.play(),v=Math.min(v+.01,1.05),x=Math.min(x+.5,50))}(e),requestAnimationFrame(z)}function W(){h.fillStyle="#a0d8ef",h.fillRect(0,0,g.width,T),h.fillStyle="#79c06e",h.fillRect(0,T,g.width,g.height),h.beginPath(),h.moveTo(0,T),h.lineTo(g.width,T),h.stroke();for(let e=0;e<R.length;e++){let t=u*(R[e].position.x-_)+A,n=T;h.drawImage(R[e].img,t,n+L,R[e].width,-R[e].height),t<-(R[e].width+10)&&R.splice(e,1)}for(let e=0;e<C.length;e++){let t=u*(C[e].x-_)*.35,n=C[e].y;const o=new Image;o.src="img/cloud.png",h.drawImage(o,t,n,50,50),t<-50&&C.splice(e,1)}h.font="normal 22px monospace",h.fillStyle="black";for(let e=0;e<G.length;e++){let t=u*(G[e].position.x-_),n=G[e].position.y;K(1,5);h.fillText(G[e].str,t,n),t<-100&&G.splice(e,1)}h.drawImage(D,A,T+j.position.y-M+L+5,b,M),h.font="bold 22px monospace",h.strokeStyle="black",h.fillStyle="white",h.textAlign="right",h.lineWidth=1.5,h.fillText(`SCORE: ${j.score}`,g.width-100,30),h.strokeText(`SCORE: ${j.score}`,g.width-100,30),h.textAlign="left",h.fillText(`HI SCORE: ${w}`,50,30),h.strokeText(`HI SCORE: ${w}`,50,30)}function J(e){if(E==c&&("mousedown"==e.type||"Space"==e.code)){if(!j.onGround)return;s.jump.pause(),s.jump.currentTime=0,s.jump.play(),j.onGround=!1,D.src=j.jump_img_src,j.velocity.y=-12}}function K(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function Q(e){0==E&&("click"!=e.type&&"Space"!=e.code||(E=c,z()))}D.src=j.run_img_src[0],P.src="img/gamestart.png",q.src="img/gameover.png",l.addEventListener("input",(()=>{p=l.value,u=g.width/p,sessionStorage.setItem("fov",l.value)})),d.addEventListener("click",(()=>{w=0,sessionStorage.removeItem("maxScore")})),window.addEventListener("load",(()=>{let e=sessionStorage.getItem("fov")??50;l.value=e})),window.addEventListener("keydown",J),window.addEventListener("keydown",Q),g.addEventListener("mousedown",J),g.addEventListener("click",Q),g.addEventListener("click",(function(e){if(E!=a)return;"click"!=e.type&&"Space"!=e.code||location.reload()})),P.addEventListener("load",(()=>{W(),0==E&&h.drawImage(P,256,-10,512,256)}));
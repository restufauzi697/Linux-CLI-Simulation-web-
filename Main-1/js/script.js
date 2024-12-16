"use strict";
!function($){
	const
	$screen = $('.layar-cinema'),
	$line = $('<p>', {class: 'line', text: ' '}),
	$pointer = $('<span>', {class: 'pointer', text: ''})
	
	$screen.append($line.append($pointer[0])[0])
	 .on('click', function(){
			clearTimeout(timeout)
		if(!rule.length)
			[].splice.apply(rule,[0,0].concat(Recent.splice(0,Recent.length))),
			clear(), lines[0].text('replay? [Y/t] ').append($pointer[0])
		if(active =! active)
			auto()
		console.log('process: ',active)
	})
	
	$.text = function(a) {
		return document.createTextNode(a)
	}
	
	const
	screen = {width: 82, height: 25}
	
	var
	active = true,
	timeout = NaN,
	pointer = {x: 0, y: 0},
	process = null,
	delay = 0,
	text, lines
	
	const rule = window.rule || [
		[0,0,0],
		[1,"              "],
		[1,"Debian GNU/Linux 6.0 debian1 tty1"],
		[1," "],
		[2,"DebianS4Z login:"," restu",1],
		[2, "Password: ", "",1],
		[4, {delay:2}],
		[1,"Last login: Fri Nov 15 09:53:12 CST 2019 on tty1"],
		[1,"Linux debian1 2.6.32-5-686 #1 SMP Fri May 10 08:33:48 UTC 2019 1686"],
		[1," "],
		[1,"The programs included with the Debian GNU/Linux system are free software; the exact distribution terms for each program are described in the individual files in /usr/share/doc/*/copyright."],
		[1," "],
		[1,"Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent permitted by applicable law."],
		[2,"restu@DebianS4Z:~$"," sudo -i",1],
		[2,"[sudo] katasandi untuk restu: ","",1],
		[4, {delay:3}],
		[2,"root@DebianS4Z:~#"," apt-get install apache2 phpS phpS-mysql mysgl-server phpmyadmin",1],
		[1,"Reading package lists... Done"],
		[1,"Building dependency tree"],
		[1,"Reading state information... Done"],
		[4, {delay:1}],
		[1,"END"]
	],
	Recent = []
	
	start()
	
	function start() {
		var 
		h = screen.height
		lines = [$line]
		
		while(--h>0)
			lines.push($line.clone().appendTo($screen[0]).text(''))
		
		auto()
		//rule.splice(0,90)
	}
	
	function startProcess(a) {
		var start, end, i,j,k,
		title = a.box.title,
		text = a.box.text,
		backtitle = a.box.backtitle
		
		pointer = a.box.pointer
		process = a
		
		start = [Math.floor((screen.width - a.box.width) / 2), Math.floor((screen.height - a.box.height) / 2)]
		end = [screen.width - start[0], a.box.height + start[1]]
		
		if(!a.render)
		for(i = 0;i<screen.height;i++) {
			if(i<start[1])
				text.unshift(' '.repeat(screen.width))
			else if(i == start[1]){
				j = (screen.width - title.length - start[0]*2) / 2
				j = j-3
				
				text.splice(i,0,' '.repeat(start[0])+'┌'+'─'.repeat(j)+'┤ '+title+ ' ├'+'─'.repeat(j)+'┐'+' '.repeat(screen.width-end[0]))
			}
			else if(i == end[1])
				text.splice(i,0,' '.repeat(start[0])+'└'+'─'.repeat(screen.width-start[0]*2-2)+'┘'+' '.repeat(screen.width-end[0]))
			else if(i == end[1]+1)
				text.splice(i,0,' '.repeat(start[0]+1)+'\xa0'.repeat(screen.width-start[0]*2)+' '.repeat(screen.width-end[0]-1))
			else if(i>end[1])
				text.push(' '.repeat(screen.width))
			else if(text[i])
				text[i] = text[i].replace(/\[S(\d+)\]/g,function(a,b){return' '.repeat(b-0)}),
				j = a.box.width - text[i].replace(/\f/g,'').length - 1,
				text[i] = ' '.repeat(start[0])+'│'+text[i]+' '.repeat(j<0?0:j)+'│'+' '.repeat(screen.width-end[0])
			else
				console.log(i)
		}
		
		text[0] = backtitle + text[0].slice(backtitle.length)
		
		a.render = true
		render(process)
	}
	
	function onprocess() {
		const
		rule = process.rule,
		cache = process.cache,
		next = rule[cache.next++]
		
		var text
		
		if(next[0] == "SLP") //Sleep
			delay = next[1]*1000||100
		else if(next[0] == "BTN") //Button
			$('.active').removeClass("active"),
			$($(`.button`)[next[1]]).addClass("active"),
			$pointer.remove()
		else if(next[0] == "SWC") { //Switch or Toggle
			$('.active').removeClass("active")
			cache.input = $($('.switch')[next[1]])
			cache.input.addClass("active")
			cache.input.append($pointer[0])
		}
		else if(next[0] == "INP"){ //Input select
			$('.active').removeClass("active")
			cache.input =$( $('.input')[next[1]])
			text = cache.input.text()||''
			pointer.x = next[2]|0
			cache.input.text('').append($.text(text.slice(0,next[2])),$pointer[0],$.text(text.slice(next[2])))
		}
		else if(next[0] == "CHG" && cache.input){ //Change input text
			text = cache.input.text()||''
			text = text.split('')
			text.splice(pointer.x-1,next[1].length,next[1])
			text = text.join('').slice(0,text.length)
			
			pointer.x += next[1].length
			pointer.x %= text.length
			
			if(!pointer.x)
				pointer.x = text.length
				
			cache.input.text('').append($.text(text.slice(0,pointer.x)),$pointer[0],$.text(text.slice(pointer.x)))
		}
		else if(!next||next[0] == "END") //END: close dialog
			process = null,
			pointer.y = screen.height
	}
	
	function render(a) {
		var
		text = a.box.text,
		part,line,i
		a.cache = {next:0}
		
		for(i = 0;i<text.length;i++) {
			part = text[i].replace(/(┌|└|│ |┘ |┐|\f)|(<|>|\xa0+)|(_+)|(┤[^├]+├)|\[(.)\]/g,toHml)
			lines[i].html('<span class="blue">'+part+'</span>')
		}
		
		//$('.button')[0].className="button active"
	}
	
	function toHml(_,p,c,i,t,s){
		if(p)
			return (process.cache.pipe =! process.cache.pipe)?'<span class="gray">'+p:p[0]+'<span class="black">'+(p[1]||'')+'</span></span>'
		if(c)
			return {"<":`<span class="button">&lt;`,">":"&gt;</span>"}[c]||'<span class="black">'+c+'</span>'
		if(i)
			return '<span class="input">'+i+'</span>'
		if(t)
			return t[0]+'<span class="title">'+t.slice(1,-1)+'</span>'+t.slice(-1)
		if(s)
			return '[<span class="switch">'+s+'</span>]'
	}
	
	function printL(a,p) {
		print(a,0,p)
		pointer.y++
		pointer.x=0
		ceck_line()
		pointers()
	}
	
	function print(a,b,p) {
		ceck_line()
		
		var
		line = lines[pointer.y],
		text = line.text(),text1,
		x = pointer.x, l = a.length,
		w = screen.width
		p = p || ''
		
		text = p + text.slice(0, x) + a + text.slice(x + l)
		
		x += l
		if(b && x >= w)
			text = text.slice(1-w)
		
		text1 = text.slice(0,w).split(' ')
		
		if(x+p.length > w)
			text = text1.splice(-1,1)+text.slice(w)
		
		line.text(text1.join(' '))
		
		if(x > w)
			pointer.y++,
			pointer.x = 0,
			print(text,b,p)
		
		if(!(b && x >= w))
		pointer.x += l
		pointer.x %= w
		pointers()
	}
	
	function ceck_line() {
		if(pointer.y >= screen.height)
			pointer.y = screen.height-1,
			pointer.x = 0,
			lines.push(lines.shift().appendTo($screen[0]).text(''))
	}
	
	function pointers() {
		var
		line = lines[pointer.y],
		text = line.text()
		line.text('').append($.text(text.slice(0, pointer.x)), $pointer[0], $.text(text.slice(pointer.x)))
	}
	
	function clear() {
		var i
		
		pointer = {x: 0, y: 0}
		
		for(i = 0;i<lines.length;i++)
			lines[i].text('')
	}
	
	function motion() {
		var a = motion.t
		if(a.length > 0)
			print(a[0], true)
		motion.t = a.slice(1)
		delay = motion.d
		
		if(!motion.t&&motion.y)
			pointer.y++,
			motion.y = pointer.x = 0
	}
	
	function next() {
		var part = rule.shift()
		if(part[0] == 0)
			pointer.x = part[1]>-1 ? part[1] : pointer.x,
			pointer.y = part[2]>-1 ? part[2] : pointer.y
		else if(part[0] == 1)
			printL(part[1],part[2])
		else if(part[0] == 2)
			print(part[1]),
			motion.t=part[2],
			motion.y=part[3],
			motion.d=part[4]*1000||100,
			delay=900
		else if(part[0] == 3)
			startProcess(part[1])
		else if(part[0] == 4)
			delay = part[1].delay * 1000 | 0
		Recent.push(part)
	}
	
	function auto(){
		if(process)
			onprocess()
		else if(motion.t || motion.y)
			motion()
		else
			next()
		if(rule.length||process)
			timeout = setTimeout(auto, delay),
			delay = 100
	}
}(function(){
	//ASSIGN
	Object.assign = Object.assign
	|| assign;
	function assign(a) {
		var arg = Array.prototype.slice.call(arguments,1)
		for(var i = 1;i<arg.length;i++) {
			for(var k in arg[i]) {
				a[k] = arg[i][k]
			}
		}
		return a
	}
	
	const
	_ = {
		extend(parent,proto) {
			return Object.create(proto, Object.getOwnPropertyDescriptors(parent))
		},
		alias: {
			text : 'innerText',
			class: 'className'
		}
	},
	fn = {
		a: function(a,b) {
				return a instanceof Element
				 ? _.extend([a],fn.fn)
				 : /^<\w+>$/.test(a)
				 ? fn.c(a,b)
				 : fn.b(a)
		},
		b: function(a) {
			a = [].slice.call(document.querySelectorAll(a))
			return _.extend(a,fn.fn)
		},
		c: function(a,b) {
			a = document.createElement(a.slice(1,-1))
			if(b) {
				var i, k, t
				for(i in b)
					k = _.alias[i]||i,
					t = typeof a[k],
					'function' == t 
						 ? a[k].apply(a, b[i])
						 : 'object' == t && a[k] != null
							 ? Object.assign (a[k], b[i]) 
							 : (a[k] = b[i])
			}
			return _.extend([a],fn.fn)
		},
		fn: _.extend({
			append(){
				if(this[0])
				for(var i in arguments) {
					this[0].appendChild(arguments[i])
				}
				return this
			},
			appendTo(a){
				for(var i=0;i<this.length;i++)
					a.appendChild(this[i])
				return this
			},
			remove(){
				for(var i=0,p;i<this.length;i++)
					if(p=this[i].parentNode)
						p.removeChild(this[i])
				return this
			},
			clone(){
				for(var i=0,r=[];i<this.length;i++)
					r[i] = this[i].cloneNode(true)
				return _.extend(r,fn.fn)
			},
			on(a,b,c){
				for(var i=0;i<this.length;i++)
					this[i].addEventListener(a,b,c)
				return this
			},
			addClass(a){
				for(var i=0;i<this.length;i++)
					this[i].classList.add(a)
				return this
			},
			removeClass(a){
				for(var i=0;i<this.length;i++)
					this[i].classList.remove(a)
				return this
			},
			text(a){
				if(!arguments.length)
					return this[0]?this[0].innerText:null
				if(this[0])
					this[0].innerText = a
				return this
			},
			html(a){
				if(!arguments.length)
					return this[0]?this[0].innerHTML:null
				if(this[0])
					this[0].innerHTML = a
				return this
			}
		}, Array.prototype)
	}
	
	return function(a,b) {return fn.a(a,b)}
}())

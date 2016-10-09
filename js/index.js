$(function () {

    var audio=$('.audio').get(0);

    var audios=$('#audio')[0];

    //歌曲播完的函数
    // if(audios.ended){
    //     alert(1)
    // }

    //歌单
    // var musicBox=$('.music-box')[0]
    var database=[
        {name:'交响乐',src:'music/交响乐.mp3',background:'images/jiaoxiangyue.jpg',geshou:'交响乐团',lyric:'此音乐为纯音乐,没有歌词'},
        // {name:'Bad',src:'music/Bad.mp3',background:'images/Bad.jpg',geshou:'apple',lyric:'此音乐为纯音乐,没有歌词'},
        {name:'丑八怪',src:'music/丑八怪.mp3',background:'images/yiwai.jpg',geshou:'薛之谦',lyric:'未能搜索到歌词见谅'},
        {name:'你还要我怎样',src:'music/你还要我怎样.mp3',background:'images/jige.jpg',geshou:'薛之谦',lyric:'未能搜索到歌词'},
        {name:'我好像在哪见过你',src:'music/我好像在哪见过你.mp3',background:'images/chuxuezhe.jpg',geshou:'薛之谦',lyric:'未能搜索到歌词'}
    ];

    $(database).each(function (e,v) {
        $('<li id='+e+'><span>'+v.name+'</span></li>').appendTo('.music-box .lists')
    })

    //点击显示歌曲列表
    $('.music-box .xia').on('click',function () {
        $('.music-box ul').slideToggle('down')
    })

    //点击播放暂停按钮
    var sbutn=$('.start-pause',audio)

    sbutn.on('click',function(){
        sbutn.toggleClass('pauses')

        if(sbutn.hasClass('pauses')){
            audios.play()
        }else{
            audios.pause()
        }
    })




    //显示时间 完成
    var timeOne=$('.times .run-time');
    var timeTwo=$('.times .totle-time');
    var yuandian=$('.jindutiao .dian')
    var format=function(shijian) {
        var m=Math.floor(shijian/60);
        var s=parseInt(shijian%60);
        if(m<10){
            m='0'+m;
        }
        if(s<10){
            s='0'+s;
        }
        return m+':'+s;
    }
    $(audios).on('timeupdate',function () {
        timeOne.text(format(audios.currentTime));
        timeTwo.text(format(audios.duration));
        yuandian.css({
            left:audios.currentTime*($('.jindutiao').width()- $('.jindutiao .dian').width()/2)/audios.duration
        });
    })
    // $(audios).triggerHandler('timeupdate')


    $(document).on('mousedown',false)
    //点击进度条
    $('.jindutiao').on('click',function (e) {
        // console.log(e.offsetX-$('.jindutiao').find('.dian').width()/2)
        audios.currentTime=(e.pageX-$('.jindutiao').offset().left-$('.jindutiao').find('.dian').width()/2)/$(this).width()*audios.duration

    })

    //拖动进度条
    yuandian.on('mousedown',function (e) {
        e.preventDefault()
        $(document).on('mousemove',function (e) {
            var wide=(e.pageX-$('.jindutiao').offset().left)/$('.jindutiao').width()
            wide=wide>1?1:wide;
            wide=wide<0?0:wide;
            audios.currentTime=wide*audios.duration

            // console.log(audios.currentTime)
        })
        yuandian.on('mouseup',function () {
            $(document).off('mousemove')
            $(document).off('mouseup')
        })
    })



    //点击上下首和列表中进行播放 完成
    var preMusic=$('.pre-next .pre-music')
    // console.log(preMusic)
    var nextMusic=$('.pre-next .next-music')
        index=0;
    nextMusic.on('click',function () {
        sbutn.addClass('pauses')
        index+=1;
        if(index == database.length){
            index=0;
        }
        // console.log(database[index].src);
        audios.src=database[index].src;
        audios.play()

    })
    preMusic.on('click',function () {
        sbutn.addClass('pauses')
        index-=1;
        if(index==-1){
            index=database.length-1
        }
        audios.src=database[index].src;
        audios.play()
    })

    $('.music-box .lists').on('click','li',function(){
        $('.music-box ul').slideToggle('down')
        sbutn.addClass('pauses')
        // alert(9)
        var num=$(this).attr('id')
        index=num;
        audios.src=database[index].src;
        audios.play()
    })

    //换歌名
    $(audios).on('play',function () {
        // console.log($('.music-box .lists').find('li').eq(index))
        $('.music-box .lists').find('li').removeClass('zhengzaibofang')
        $('.music-box .lists').find('li').eq(index).addClass('zhengzaibofang')
        $('.playing .names').text(database[index].name)
        $('.playing .geshou').text(database[index].geshou)
        $('.play-box .pright .lyrics span').text(database[index].lyric)
        $('body').css({
            backgroundImage: 'url('+database[index].background+')'
        })
    })

    //音量改变
    var tiaos=$('.voices .tiaos')
    var yuandians=$('.voices .yuandian')
    yuandians.css({
        left:tiaos.width()*1+10
    })
    $(audios).on('volumechange',function () {
        var vc=(audios.volume*1+0.1)*tiaos.width()
        yuandians.css({
            left:vc
        })
    })

    //点击声音图标静音
    var voices=[];
    var shengyin=$('.voices .clicks')
    shengyin.on('click',function () {
        // console.log(voices)
        $(this).toggleClass('jingyin')
        if($(this).hasClass('jingyin')){
            voices.push(audios.volume)
            audios.volume=0
        }else{
            audios.volume=voices[0]
            voices=[]
        }

    })
    //声音点击事件
    tiaos.on('click',function (e) {
        // console.log(e.offsetX/$(this).width())
        audios.volume=(e.offsetX-$(yuandians).width()/2)/$(this).width()
        // if(audios.volume<=0.1){
        //     shengyin.toggleClass('jingyin')
        // }
    })
    //声音拖动事件
    yuandians.on('mousedown',function(e) {
        e.preventDefault()
        $(document).on('mousemove',function (e) {
            var number=e.pageX-$('.voices').offset().left-$('yuandians').width()-$('.voices').width()*0.1

            audios.volume=number/$('.voices .tiaos').width()
            if(audios.volume==0){
                $(shengyin).addClass('jingyin')
            }
            // console.log(number/$('.voices .tiaos').width())
            yuandians.css({
                left:(audios.volume*1+0.1)*$(tiaos).width()
            })
        })
        $(document).on('mouseup',function () {
            $(document).off('mousedown')
            $(document).off('mousemove')
        })
    })
    //自动播放下一首
    $(audios).on('ended',function () {
        nextMusic.trigger('click')
    })

    //循环模式
    var ordered=$('.audio .playMode .ordered')
    var musicRandom=$('.audio .playMode .musicRandom')

    var cycleSingle=$('.audio .playMode .cycleSingle')
    var cycleList=$('.audio .playMode .cycleList')
    var aa=0;
    ordered.on('click',function () {
        $('.audio .playMode').find('div').removeClass('active')
        $('.audio .playMode').find('div').eq(aa).addClass('active')
    })
    musicRandom.on('click',function () {
        $('.audio .playMode').find('div').removeClass('active')
        $('.audio .playMode').find('div').eq(aa+1).addClass('active')

    })
    cycleSingle.on('click',function () {
        $('.audio .playMode').find('div').removeClass('active')
        $('.audio .playMode').find('div').eq(aa+2).addClass('active')
    })
    cycleList.on('click',function () {
        $('.audio .playMode').find('div').removeClass('active')
        $('.audio .playMode').find('div').eq(aa+3).addClass('active')
    })





    //转圈的唱片图片
    var rollPic=$('.rolling .pic')
    $(audios).on('play',function () {
        console.log(rollPic)
        rollPic.rotate(360000);
    })



})
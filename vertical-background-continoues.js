$('.TakeImgToBackgroundVertical').each(
    function(){
        // tim anh lam background        
        var Idbackground=$(this).find('#' + $(this).attr('data-id-background'));
        if (Idbackground==null) {
            console.log('khong tim dc id background');
        }
        else{
            var SrcBackground=Idbackground.attr('src');
            console.log(SrcBackground);
            // dat img lam back ground
            // keo dai background xong duoi
            var Background=  '',
            BackgroundPosition='',
            BackgroundSize='',
            BackgroundRepeat='';        

            for (let index = 0; index < 100; index++) {
                Background =  Background + 'url('+ SrcBackground + '),';                               
                BackgroundPosition=BackgroundPosition  + '0 ' + index+'%' +',';
                BackgroundSize= BackgroundSize + '100% auto,'; 
                BackgroundRepeat= BackgroundRepeat +'no-repeat,';   
            }
            // xoa ky tu ',' cuoi cung
            Background=Background.slice(0, -1);  
            BackgroundPosition=BackgroundPosition.slice(0, -1);  
            BackgroundSize=BackgroundSize.slice(0, -1);  
            BackgroundRepeat=BackgroundRepeat.slice(0, -1);              
            // console.log(BackgroundRepeat);

            $(this).css({'background-image':Background,
            'background-position': BackgroundPosition,
            'background-size':BackgroundSize,
            'background-repeat':BackgroundRepeat});
        }
    }
)
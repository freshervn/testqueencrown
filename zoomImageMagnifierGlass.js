// var imgId = 'zoomimg';
// // lay ty le zoom 
// var ScaleZoom = 3;
// function magnify(imgID, zoom) {
//   var img, glass, w, h, bw;
//   img = document.getElementById(imgID);

//   /*create magnifier glass:*/
//   glass = document.createElement("DIV");
//   glass.setAttribute("class", "img-magnifier-glass");
//   /*insert magnifier glass:*/
//   img.parentElement.insertBefore(glass, img);
//   /*set background properties for the magnifier glass:*/
//   glass.style.backgroundImage = "url('" + img.src + "')";
//   glass.style.backgroundRepeat = "no-repeat";
//   glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
//   bw = 0;
//   w = glass.offsetWidth / 2;
//   h = glass.offsetHeight / 2;

//   /*execute a function when someone moves the magnifier glass over the image:*/
//   glass.addEventListener("mousemove", moveMagnifier);
//   img.addEventListener("mousemove", moveMagnifier);
//   /*and also for touch screens:*/
//   glass.addEventListener("touchmove", moveMagnifier);
//   img.addEventListener("touchmove", moveMagnifier);

//   function moveMagnifier(e) {
//     var pos, x, y;
//     /*prevent any other actions that may occur when moving over the image*/
//     e.preventDefault();
//     /*get the cursor's x and y positions:*/
//     pos = getCursorPos(e);
//     x = pos.x;
//     y = pos.y;
//     /*prevent the magnifier glass from being positioned outside the image:*/
//     if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
//     if (x < w / zoom) { x = w / zoom; }
//     if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
//     if (y < h / zoom) { y = h / zoom; }
//     /*set the position of the magnifier glass:*/
//     glass.style.left = (x - w) + "px";
//     glass.style.top = (y - h) + "px";
//     /*display what the magnifier glass "sees":*/
//     glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
//   }
//   function getCursorPos(e) {
//     e = e || window.event;
//     var a, x = e.clientX, y = e.clientY;
//     /*get the x and y positions of the image:*/
//     a = img.getBoundingClientRect();
//     /*calculate the cursor's x and y coordinates, relative to the image:*/
//     x = e.pageX - a.left;
//     y = e.pageY - a.top;
//     /* Consider any page scrolling: */
//     x = x - window.pageXOffset;
//     y = y - window.pageYOffset;
//     return { x: x, y: y };
//   }
// }
// $('.bigWindown').mouseenter(
//   function () {
//     // dat id cho anh can zoom        
//     // tim anh va dat id cho no
//     $(this).find('img').attr('id', imgId);
//     $(this).find('#' + imgId).parent().addClass('img-magnifier-container');
//     // console.log('on');
//     magnify(imgId, ScaleZoom);
//   }
// )
// $('.bigWindown').mouseleave(
//   function () {
//     $(this).find('.img-magnifier-glass').remove();
//     $(this).find('#' + imgId).parent().removeClass('img-magnifier-container');
//     $(this).find('#' + imgId).attr('id', '');
//     // console.log('off');
//   }
// )
// function imageZoom(imgID, resultID) {
//   var img, lens, result, cx, cy;
//   img = document.getElementById(imgID);
//   result = document.getElementById(resultID);
//   // console.log(result);
//   /*create lens:*/
//   lens = document.createElement("DIV");
//   lens.setAttribute("class", "img-zoom-lens");
//   /*insert lens:*/
//   img.parentElement.insertBefore(lens, img);
//   /*calculate the ratio between result DIV and lens:*/
//   cx = result.offsetWidth / lens.offsetWidth;
//   cy = result.offsetHeight / lens.offsetHeight;
//   /*set background properties for the result DIV:*/

//   result.style.backgroundImage = "url('" + img.src + "')";
//   result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

//   /*execute a function when someone moves the cursor over the image, or the lens:*/
//   lens.addEventListener("mousemove", moveLens);
//   img.addEventListener("mousemove", moveLens);
//   /*and also for touch screens:*/
//   lens.addEventListener("touchmove", moveLens);
//   img.addEventListener("touchmove", moveLens);

//   function moveLens(e) {
//     var pos, x, y;
//     /*prevent any other actions that may occur when moving over the image:*/
//     e.preventDefault();
//     /*get the cursor's x and y positions:*/
//     pos = getCursorPos(e);
//     /*calculate the position of the lens:*/
//     x = pos.x - (lens.offsetWidth / 2);
//     y = pos.y - (lens.offsetHeight / 2);
//     console.log(x,img.width);
//      /*prevent the lens from being positioned outside the image:*/
//      if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
//      if (x < 0) {x = 0;}
//      if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
//      if (y < 0) {y = 0;}
//      /*set the position of the lens:*/
//      lens.style.left = x + "px";
//      lens.style.top = y + "px";
//     // console.log(x,y);
//     /*display what the lens "sees":*/
//     result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
//   }

//   function getCursorPos(e) {
//     e = e || window.event;
//     var a, x = e.clientX, y = e.clientY;
//     /*get the x and y positions of the image:*/
//     a = img.getBoundingClientRect();
//     /*calculate the cursor's x and y coordinates, relative to the image:*/
//     x = e.pageX - a.left;
//     y = e.pageY - a.top;
//     /*consider any page scrolling:*/
//     x = x - window.pageXOffset;
//     y = y - window.pageYOffset;
//     return { x: x, y: y };
//   }
// }
// var imgIdzoom = 'zoomImg';
// // lay ty le zoom 
// var ZoomResult = 'myresultid';
// $('.bigWindown').mouseenter(
//   function () {
//     // dat id cho anh can zoom        
//     // tim anh va dat id cho no
//     $(this).find('img').attr('id', imgIdzoom);
//     $(this).find('#' + imgIdzoom).parent().addClass('img-zoom-container');
//     // create windown zoom
//     var zoomwindown = document.createElement("DIV");
//     zoomwindown.setAttribute("class", "img-zoom-result");
//     zoomwindown.setAttribute("id", ZoomResult);

//     $(this).find('#' + imgIdzoom).parent().append(zoomwindown);
//     imageZoom(imgIdzoom, ZoomResult);

//     $(this).mouseleave(
//       function () {
//         console.log( );
//         $(this).find('#' + imgIdzoom).parent().removeClass('img-zoom-container');
//         $(this).find('#' + imgIdzoom).attr('id', '');
//         /*insert lens:*/
//         $(this).find('#' + ZoomResult).remove();
//         $(this).find('.img-zoom-lens').remove();
//         // console.log('off');
//       }
//     )

//   }
// )
// click tang giá trị
$(" button.plush ").click(
    function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        var newVal = parseFloat(oldValue) + 1;
        $button.parent().find("input").val(newVal);
    }
);
// click giam gia tri
$(" button.minus ").click(
    function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        var newVal = parseFloat(oldValue) - 1;
        $button.parent().find("input").val(newVal);
    }
);

// lay anh lam nen
$(document).ready(
    function () {
        $('article.gioi-thieu section img').each(
            function () {
                $linkimg = $(this).attr("src");
                //   console.log( $(this).parent().parent() );
                $(this).parent().parent().css("background-image", " url(" + $linkimg + ")");
            })
    }
)

// lay anh lam nen 2.0   
$(document).ready(
    function () {
        $('.take-background ').each(
            function () {
                $linkimg = $(this).find('img.isbackground ').attr("src");
                //   console.log( $(this).parent().parent() );
                $(this).css("background-image", " url(" + $linkimg + ")");
            })

        // xoa san pham
        $('.buying-all').click(function () {
            if ($(this).is(':checked')) {
                // console.log('run');
                $('input[type="checkbox"].check-buying').prop('checked', true);
                $(this).prop('.buying-all', true);
            }
            else {
                // console.log('no run');
                $('input[type="checkbox"].check-buying').prop('checked', false);
                $(this).prop('.buying-all', false);
            }
        })
        // tick bo khong chon o nho thi o tat ca cung bo tick
		$('input[type="checkbox"].check-buying').click(function(){
			if(!$(this).is(':checked')){
				$('.buying-all').prop('checked', false);
			}
		})
    }
)

// thay chu cho tria nhiem khach hang
$('.item-5-3.owl-carousel .owl-nav::before').html('run')
$('.item-5-3.owl-carousel').find('.owl-item.active:nth(2)').find('img').attr('data-ten-khach-hang')
// xóa class theo cỡ màn hình
if ($(window).width() >= 756) {
    $('[desk-remove-class]').removeClass($('[desk-remove-class]').attr('desk-remove-class'));
}
// click to show input radio
$('input[type="radio"]').click(
    function () {
        // ẩn các khối khác       
        $('input[name=' + $(this).attr('name') + ']').each(
            function () {
                $blockId = $('#' + $(this).attr('data-block-id'));
                // an khoi
                $blockId.css('display', 'none');
            }
        )
        // // tìm khối cần hiển thị
        $blockId = $('#' + $(this).attr('data-block-id'));
        // hiển thị khối 
        if ($(this).is(":checked")) {
            // hiện thị khối theo id
            $blockId.css('display', 'block');
        }
    }
)
// khi một nút click dc bấm
$('.click-show').click(
    function () {
        // tìm khối cần hiển thị
        // kiểm tra tình trạng hiện, ẩn
        $blockId = $('#' + $(this).attr('data-block-id'));
        // console.log($(this).attr('data-block-id'));
        if ($blockId.css('display') == 'none') {
            // hiện thị khối theo id
            $blockId.css('display', 'block');
            $(window).on('mousedown');
        }
        else {
            $blockId.css('display', 'none');
        }
    }
)
// khi di chuot vào khối thì tắt uwwindown listentd
$('.ClickToShow,button,.click-show').mouseover(
    function () {
        // console.log('chuot hover button');
        $(window).off('mousedown');
    }
)
$('.ClickToShow , button,.click-show').mouseleave(
    function () {
        // console.log('chuot ben ngoai button');
        // khi di chuột    
        $(window).mousedown(
            function () {
                // console.log('chuot click');
                $('.ClickToShow').css('display', 'none');
            }
        );
    }
)

// nav bar hover
$('.dropdown-toggle').mouseenter(
    function () {
        $('.dropdown-toggle').addClass('show');
        $('.dropdown-toggle + .dropdown-menu ').addClass('show');
    }
)
$('.dropdown-menu').mouseenter(
    function () {
        $(this).addClass('show');
        $(this).mouseleave(
            function () {
                $(this).removeClass('show');
            }
        )
    }
)
$('.dropdown-toggle').mouseleave(
    function () {
        $('.dropdown-toggle').removeClass('show');
        $('.dropdown-toggle + .dropdown-menu ').removeClass('show');
    }
)
// animation
AOS.init();
// carousel bootrap
// $('.carousel').carousel();
$('.small-to-big-window .smallWindown ').click(
    function () {
        var item = $(this).clone();
        $('.small-to-big-window  .bigWindown ').html(item);
    });
// zoomOut khi ấn vào ảnh
function zoomout() {
    // tao nen
    let blankcover = document.createElement("div");
    blankcover.classList.add('blankcover');
    // nen tu xoa
    $(blankcover).click(
        function () {
            blankcover.remove();
        });
    // tao khung chua noi dung
    let container_content = document.createElement("div");
    container_content.classList.add('content');
    // lấy phần tử cần hiển thị
    let object = $(this).clone();
    $('body').append(blankcover);
    $('.blankcover').append(container_content);
    $('.blankcover .content').append(object);
}
//owl
$('.item-1-bottom ').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            loop: true
        }
    }
})
$('.item-4').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 4,
            loop: true
        },
        567: {
            items: 4
        },
        992: {
            items: 4
        }
    }
})


$('.item-3-dot ').owlCarousel({
    loop: false,
    margin: 10,
    dots: true,
    nav: false,
    responsive: {
        0: {
            items: 1,
            loop: true
        },
        567: {
            items: 3
        },
        992: {
            items: 3
        }
    }
})
$('.item-3-nav ').owlCarousel({
    loop: false,
    margin: 0,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 2,
            loop: true
        },
        567: {
            items: 3
        },
        992: {
            items: 3
        }
    }
})
$('.item-3-nav-middle').owlCarousel({
    loop: false,
    margin: 15,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            loop: true
        },
        567: {
            items: 3
        },
        992: {
            items: 3
        }
    }
})
$('.item-4-2').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 2,
            loop: true
        },
        567: {
            items: 2
        },
        992: {
            items: 4
        }
    }
})
$('.item-5-3').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 3,
            loop: true
        },
        567: {
            items: 3
        },
        992: {
            items: 5
        }
    }
})
$('.item-5').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 2,
            loop: true
        },
        567: {
            items: 4
        },
        992: {
            items: 5
        }
    }
})

$('.owl-1-nav-middle').owlCarousel({
    loop: true,
    margin: 10,
    dots: true,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        567: {
            items: 1
        },
        992: {
            items: 1
        }
    }
})


$('.item-4-2-nav-middle').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 2
        },
        567: {
            items: 2
        },
        992: {
            items: 4
        }
    }
})
$('.item-10-5').owlCarousel({
    loop: false,
    margin: 10,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 5
        },
        567: {
            items: 5
        },
        992: {
            items: 10
        }
    }
})

$(" .owl-1-nav-middle.owl-carousel .owl-nav button.owl-prev span").html("<i class='	fa fa-chevron-left'></i>");
$(" .owl-1-nav-middle.owl-carousel .owl-nav button.owl-next span").html("<i class='	fa fa-chevron-right'></i>");

$(" .item-5-3.owl-carousel .owl-nav button.owl-prev span").html("<i class='	fa fa-chevron-left'></i>");
$(" .item-5-3.owl-carousel .owl-nav button.owl-next span").html("<i class='	fa fa-chevron-right'></i>");

$(" .item-1-bottom.owl-carousel .owl-nav button.owl-prev span").html(" Back");
$(" .item-1-bottom.owl-carousel .owl-nav button.owl-next span").html(" Next");
// scroll
$('.owl-4-nav-top-left').owlCarousel({
    loop: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        567: {
            items: 2
        },
        992: {
            items: 4
        }
    }
})

/*
 * Magazine sample
 */

function setArrows() {

    setTimeout(function() {
        var width = $(window).width();
        var bookWidth = $(".magazine").width();
        var arrowSize = $(".next-button").width();
        var magaLeft = $(".magazine").offset().left;
        var nextLeft = (width - bookWidth - magaLeft - 60) / 2;
        //alert("width "+width +"\nbookWidth :"+bookWidth +"\nmagaLeft:"+magaLeft+"\nnextLeft:"+nextLeft);
        $('.next-button').animate({ "right": nextLeft }, 300);

        $('.previous-button').animate({ "left": nextLeft }, 300);
    }, 100);
}

function addPage(page, book) {
    var id, pages = book.turn('pages');
    var element = $('<div />', {});
    if (book.turn('addPage', element, page)) {
        element.html('<div class="gradient"></div><div class="loader"></div>');
        loadPage(page, element);
    }

}

function loadPage(page, pageElement) {
    pageElement.find('.loader').remove();

    // Create an image element
    var img = $('<img />');

    img.mousedown(function(e) {
        e.preventDefault();
    });
    img.load(function() {
        // Set the size
        $(this).css({
            width: '100%',
            height: '100%'
        });
        // Add the image to the page after loaded
        $(this).appendTo(pageElement);

        // Remove the loader indicator
        pageElement.find('.loader').remove();
    });
    s_page = page -1 ;
    // Load the page
    //img src 
    img.attr('src', './book/img_' + s_page + '.jpg');

}

function zoomTo(event) {}


function addRegion(region, pageElement) {

    var reg = $('<div />', {
            'class': 'region  ' + region['class']
        }),
        options = $('.magazine').turn('options'),
        pageWidth = options.width / 2,
        pageHeight = options.height;

    reg.css({
        top: Math.round(region.y / pageHeight * 100) + '%',
        left: Math.round(region.x / pageWidth * 100) + '%',
        width: Math.round(region.width / pageWidth * 100) + '%',
        height: Math.round(region.height / pageHeight * 100) + '%'
    }).attr('region-data', $.param(region.data || ''));

    reg.appendTo(pageElement);
}

// Process click on a region
function regionClick(event) {

    var region = $(event.target);

    if (region.hasClass('region')) {

        $('.magazine-viewport').data().regionClicked = true;

        setTimeout(function() {
                $('.magazine-viewport').data().regionClicked = false;
            },
            100);

        var regionType = $.trim(region.attr('class').replace('region', ''));

        return processRegion(region, regionType);

    }

}



// http://code.google.com/p/chromium/issues/detail?id=128488
function isChrome() {
    return navigator.userAgent.indexOf('Chrome') != -1;
}

function disableControls(page) {
    if (page == 1) $('.previous-button').hide();
    else $('.previous-button').show();
    if (page == $('.magazine').turn('pages')) $('.next-button').hide();
    else $('.next-button').show();
}

// Set the width and height for the viewport
function resizeViewport() {

    var width = $(window).width(),
        height = $(window).height(),
        options = $('.magazine').turn('options');
    $('.magazine').removeClass('animated');
    $('.magazine-viewport').css({
        width: width,
        height: height
    }).zoom('resize');
    setArrows();
    if ($('.magazine').turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });

        if (bound.width % 2 !== 0) bound.width -= 1;
        if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {
            $('.magazine').turn('size', bound.width, bound.height);
            if ($('.magazine').turn('page') == 1) $('.magazine').turn('peel', 'br');
        }

        $('.magazine').css({
            top: -bound.height / 2,
            left: -bound.width / 2
        });
    }

    var magazineOffset = $('.magazine').offset(),
        boundH = height - magazineOffset.top - $('.magazine').height(),
        marginTop = (boundH - $('.thumbnails > div').height()) / 2;

    if (marginTop < 0) {
        $('.thumbnails').css({
            height: 1
        });
    } else {
        $('.thumbnails').css({
            height: boundH
        });
        $('.thumbnails > div').css({
            marginTop: marginTop
        });
    }

    if (magazineOffset.top < $('.made').height()) $('.made').hide();
    else $('.made').show();

    $('.magazine').addClass('animated');

}

// Number of views in a flipbook
function numberOfViews(book) {
    return book.turn('pages') / 2 + 1;
}

// Current view in a flipbook
function getViewNumber(book, page) {
    return parseInt((page || book.turn('page')) / 2 + 1, 10);
}

// Width of the flipbook when zoomed in
function largeMagazineWidth() {
    return 2214;
}


// Calculate the width and height of a square within another square
function calculateBound(d) {
    var bound = {
        width: d.width,
        height: d.height
    };
    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {
        var rel = bound.width / bound.height;
        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {
            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;
        } else {
            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);
        }
    }
    return bound;
}
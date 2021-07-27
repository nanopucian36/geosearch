// 必要な変数を宣言
var list_image = [];
var div = [];
var div2 = [];
var h2 = [];
var select = [];
var JSON_DATA = [];
var JSON_DATA_befo = [];
var IMAGE_DATA = [];
var N;
var info;
var text = [];
var text_info = [];
var selects;
var div_locate = [];
var list_images = [];
var cou;
var JSON_DATA_af = [];
var stop_count = 0;

// データのパスを宣言
var url = "../static/material/json_result/result.json";
var url_img = "../static/material/json_indicator/indicator_result.json";

function count() {
    cou = setInterval('reload()', 10000);
}

count();

// リロード TODO: ?が無い場合対応
// function keep_scroll_reload() {
//     var re = /&page_x=(\d+)&page_y=(\d+)/;
//     var page_x = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
//     var page_y = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
//     var position = '&page_x=' + page_x + '&page_y=' + page_y;
//     if(!url.match(re)) {
//             //初回
//             location.href = url + position;
//     } else {
//             //2回目以降
//             location.href = url.replace(/&page_x=(\d+)&page_y=(\d+)/,position);
//     }
// }

// // スクロール位置を復元
// function restore_scroll() {
//     var re = /&page_x=(\d+)&page_y=(\d+)/;
//     if(window.location.href.match(re)) {
//         var position = window.location.href.match(re)
//         window.scrollTo(position[1],position[2]);
//     }
// }

// (window.onload = function() {
//     restore_scroll();
// })();

// 画像のJSON情報を取得
$.getJSON(url_img, (data) => {
    IMAGE_DATA = data;
});

// jqueryでJSONを読み込む。
$.getJSON(url, (data) => {
    JSON_DATA = []
    JSON_DATA_befo = data;
    set_data();
    // jsonでやってみる
    N = Object.keys(JSON_DATA).length
    create();
    // selectの中身を設定する関数
    optionSetting();
    create_image();
});

function reload() {
    var scrollPos= $(document).scrollTop();
    localStorage.setItem('key',scrollPos);
    console.log(scrollPos)
    $.getJSON(url_img, (data) => {
        IMAGE_DATA = data;
    });
    $.getJSON(url, (data) => {
        remove();
        JSON_DATA = []
        JSON_DATA_befo = data;
        if (JSON_DATA_befo.length == JSON_DATA_af.length) {
            stop_count += 1;
            console.log(stop_count);
            if (stop_count > 2) {
                console.log('stop');
                clearInterval(cou);
            }
        }
        JSON_DATA_af = JSON_DATA_befo;
        set_data();
        // jsonでやってみる
        N = Object.keys(JSON_DATA).length
        create();
        // selectの中身を設定する関数
        optionSetting();
        create_image();
    });
    // console.log('a')
}

// 俺は関数適当に分けがち
function create() {
    for(i=0; i<N; i++){
        // トピック名取得
        if (JSON_DATA.length == 0) {
            $.getJSON(url, (data) => {
                JSON_DATA = data;
            });
        }
        info = Object.keys(JSON_DATA)[i];
        text[i] = JSON_DATA[info];

        // JSONから画像の情報を取得
        if (list_image.length == 0) {
            $.getJSON(url_img, (data) => {
                IMAGE_DATA = data;
            });
        };
        list_image[i] = IMAGE_DATA[0][info];
        // console.log(list_image)

        // トピックのタイトルを割当
        // h2[i] = document.createElement('p');
        // h2[i].setAttribute('class', 'topic');
        // h2[i].innerHTML = 'トピック：<input type="text" value=' + text[i]["topic_words"][0][1] + '>';

        topic();

        // 画像割当のselectタグを作成
        select[i] = document.createElement('div');
        // selectタグにそれぞれidを付与
        select[i].setAttribute('id', 'select' + i);
        select[i].setAttribute('class', 'form-group');
        // select[i].setAttribute('onchange', 'set_img(' + i + ', this.selectedIndex)')

        // 画像を表示するためのタグを作る
        var img = document.createElement('img');
        img.setAttribute('name', 'img_area');
        img.setAttribute('id', 'img_area' + i);
        img.setAttribute('class', 'img_area');

        // divタグ作成
        div[i] = document.createElement('div');
        // div[i].className = 'prelude sample' + i;
        div[i].className = 'sample' + i;
        div[i].id = 'sample' + i;

        // 要素をいれるdivタグ
        div2[i] = document.createElement('div');
        div2[i].className = 'elements';

        // トピックを分ける
        for (nn=0; nn<text[i]['texts'].length; nn++) {
            text_info[nn] = document.createElement('p');
            text_info[nn].textContent = text[i]['texts'][nn];
            text_info[nn].setAttribute('class', 'p_element blueHour')
            div2[i].appendChild(text_info[nn]);
        };

        // 先ほど作成したトピックの値・タイトルをdivタグに子要素としていれる
        // div[i].appendChild(h2[i]);
        // div[i].appendChild(p[i]);
        for (ll=0; ll<topic_list.length; ll++) {
            div[i].appendChild(topic_list[ll]);
        }
        div[i].appendChild(div2[i]);
        div[i].appendChild(img);
        div[i].appendChild(select[i]);

        // 元々あるwrapperに作成したdivをいれる
        document.getElementById('wrapper_main').appendChild(div[i]);

        // divタグの位置を適用する
        if (div_locate.length == N) {
            div[i].style.position = "relative";
            div[i].style.top = div_locate[i][0];
            div[i].style.left = div_locate[i][1];
            div[i].style.zIndex = div_locate[i][2];
        }

        // set_img(i, 0);
        if (list_images.length != N + 1) {
            set_img(i, 0)
        } else {
            // console.log(list_images)
            set_img(i, list_images[i])
        }
    }

    $('[class*=sample]').tinyDraggable({ exclude: 'select, input' });
    click_elem();

    var pos = localStorage.getItem('key');
    $('html,body').animate({ scrollTop: pos }, 'slow');
    localStorage.clear();
    // setTimeout("reload()", 100000);
}

// selectタグの中身(画像)を設定する
function optionSetting() {
    // optionタグをそれぞれのタグに追加する
    for (l=0; l<select.length; l++) {
        for (n=0; n<list_image[l].length; n++) {
            var option = document.createElement('div');
            option.setAttribute("class", "radio-btn");

            if (n == list_images[l] || (list_images.length == 0 && n == 0)) {
                option.innerHTML = '<input class="radio-inline__input" type="radio" id="radio' + l + n + '" name="radio' + l + '" onclick="set_img(' + l + ',' + n + ')"' + 'value="' + l + '" checked="checked"></input>' + '<label class="radio-inline__label" for="radio' + l + n + '">選択肢' + (n+1) + '</label>'
            } else {
                option.innerHTML = '<input class="radio-inline__input" type="radio" id="radio' + l + n + '" name="radio' + l + '" onclick="set_img(' + l + ',' + n + ')"' + 'value="' + l + '"></input>' + '<label class="radio-inline__label" for="radio' + l + n + '">選択肢' + (n+1) + '</label>'
            }
            option.text = list_image[l][n][1];
            option.value = l;
            select[l].appendChild(option);
        }
    }
}

// トピックを数値の高い順に入れていく
function topic() {
    topic_list = [];
    for (t=0; t<text[i]["topic_words"][0].length; t++) {
        topic_list[t] = document.createElement('p');
        topic_list[t].setAttribute('class', 'silverLake topic' + t);
        topic_list[t].innerHTML = 'トピック' + (t+1) + ': ' + text[i]["topic_words"][0][t][1];
        topic_list[t].style.fontSize = (20 - 2 * t) + "px";
        red_elem = 235 - 50*t;
    };
};

// 画像をセットする関数
function set_img(num, sel_val) {
    var img_area = document.getElementById('img_area' + num)
    img_area.src = list_image[num][sel_val][0];
    list_images[num] = sel_val;
};

function remove() {
    for (s=0; s<N; s++) {
        var locate_elem = document.getElementById('sample' + s);
        div_locate[s] = [window.getComputedStyle(locate_elem).getPropertyValue("top"), window.getComputedStyle(locate_elem).getPropertyValue("left"), window.getComputedStyle(locate_elem).getPropertyValue("z-index")]
    }
    $("#wrapper_main").empty();
}

function click_elem() {
    var other_elem = []
    for (r=0; r<N; r++) {
        $('#sample' + r).on('click', function(){
            for (y=0; y<N; y++) {
                other_elem[y] = document.getElementById('sample' + y);
                var changed_zindex = other_elem[y].style.zIndex - 1;
                if (changed_zindex <= 0) {
                    changed_zindex = 1;
                }
                other_elem[y].style.zIndex = changed_zindex;
            }
            // other_elem[r].style.backgroundColor = 'red'
            this.style.zIndex = '1000'
        });
    };
};

function set_data() {
    for (ii=0; ii<Object.keys(JSON_DATA_befo).length; ii++) {
        // JSON_DATA = [];
        // console.log(JSON_DATA_befo);
        for (iii=0; iii<Object.keys(JSON_DATA_befo['part' + ii]).length; iii++) {
            // console.log(JSON_DATA_befo['part' + ii][iii])
            JSON_DATA.push(JSON_DATA_befo['part' + ii][iii]);
        }
    };
};

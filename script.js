let game_area , ga_width, ga_height, defender, mov_int, enemy
let playername = prompt("Ki játszik?","DefEndre")
let enemy_array = []
let start_ex = 100
let start_ey = 100
let end_ey = 500
let enemy_num = 10
let offset_x = (end_ey - start_ey) / enemy_num
let def_width = offset_x, def_height
let move_step = def_width / 2
let score = 0
let backgroundAudio = new Audio("epicmusic.mp3")
let boom = new Audio("boom.mp3")
backgroundAudio.play()
backgroundAudio.volume = 0.5

$(document).ready(function () {
    game_area = $('#gamearea')
    defender = $('<img src="def.png" id="defender">')
    enemy = $('<img src="enemy.png">')


    game_area.append(defender)
    ga_width = parseInt(game_area.css('width'))
    ga_height = parseInt(game_area.css('height'));
    defender.on('load', function () {
        init_defender()
    });


    enemy.on('load', function () {
        init_enemy()
    });


    $(window).on('keydown', move_defender)
    game_area.on('mousemove', mousemove_defender)
    mov_int = setInterval(moving_enemy, 1000)
    $(window).on('click', init_shoot)
    setInterval(check_collisoin, 1)

    game_area.append('<div id="score_tab">Score:<span id="score" style="padding-left: 10px"></span></div>')
    $('#score').text(score)
});


function init_enemy() {
   for(let a = 0; a < 4;a++) {
       for (let i = 0; i < enemy_num; i++) {
           enemy_array.push({
               x_pos: start_ex + i * offset_x,
               y_pos: start_ey,
               imgObj: enemy.clone()
           })
       }
        start_ey = start_ey + offset_x
       draw_enemy()
   }
}


function draw_enemy() {
    for (let e in enemy_array) {
        let act_enemy = enemy_array[e]
        let act_img = act_enemy.imgObj
        game_area.append(act_img)
        act_img.css({
            left: act_enemy.x_pos,
            top: act_enemy.y_pos,
            width: offset_x
        });
        act_img.addClass('enemy')
    }
}

function moving_enemy() {
    if(score === 400){
        localStorage.setItem(playername, Number(score))
        alert("Nyertél!")
        window.location = "scoreboard.html"
    } else {
        $('.enemy').each(function () {

            if ($(this).position().top < 560 && score <= 200) {
                $(this).css({
                    top: '+=20'
                });
            } else if($(this).position().top < 560 && score >= 200) {
                $(this).css({
                    top: '+=40'
                });
            }else{
                localStorage.setItem(playername, Number(score))
                window.location = "scoreboard.html"
                clearInterval(mov_int)
                alert("Vesztettél!")
            }
        });
    }
}


function init_defender() {

    defender.css({
        width: def_width,
    });
    def_height = parseInt(defender.css('height'))

    defender.css({
        top: ga_height - def_height,
    });
}

function move_defender(ev) {
    let pressed_key = ev.key
    if (pressed_key === 'ArrowRight') {
        if (parseInt(defender.css('left')) + def_width < ga_width) {
            defender.animate({
                left: '+=' + move_step
            }, 1)
        } else {
            defender.animate({
                left: ga_width - def_width
            }, 1)
        }
    } else if (pressed_key === 'ArrowLeft') {
        if (parseInt(defender.css('left')) - move_step > 0) {
            defender.animate({
                left: '-=' + move_step
            }, 1)
        } else {
            defender.animate({
                left: 0
            }, 1)
        }
    } else if (pressed_key === ' ') {
        init_shoot()
    }
}

function mousemove_defender(e) {
    let div_pos = game_area.offset();
    let mouse_pos_x = Math.ceil(e.clientX - div_pos.left - move_step)

    if (mouse_pos_x > 0 && mouse_pos_x < ga_width - def_width) {
        defender.css({
            left: mouse_pos_x,
        });
    }
}

function init_shoot() {
    let def_pos_x = defender.position().left + move_step
    let def_pos_y = defender.position().top - 30
    let cartridge = $('<img src="bomb.jpg">')
    cartridge.css({
        top: def_pos_y,
        left: def_pos_x,
        position: 'relative'
    });
    cartridge.animate({
        top: 0
    }, 1000, function () {
        cartridge.remove()
    });
    cartridge.addClass('shoot')
    game_area.append(cartridge)
}


function check_collisoin() {
    $('.shoot').each(function () {
        let act_shoot = $(this)
        let act_x = act_shoot.position().left + move_step
        let act_y = act_shoot.position().top

        $('.enemy').each(function () {
            let e_pos_x = $(this).position().left + move_step
            let e_pos_y = $(this).position().top + parseInt(enemy.css('height')) / 2

            if (distance({x: act_x, y: act_y}, {x: e_pos_x, y: e_pos_y}) <= parseInt($(this).css('height')) / 2) {
                $(this).remove()
                act_shoot.remove()
                score += 10
                boom.play()
                $('#score').text(score)
            }
        });
    });
}

function distance(a, b) {
    let dx = a.x - b.x
    let dy = a.y - b.y

    return Math.sqrt(dx * dx + dy * dy)
}


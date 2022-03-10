let dataUser2 = new Promise((res, rej) => {
    socket.on('list-user', data => {
        console.log(data);
        res(data)
    })
})
$(document).ready(() => {
    socket.on('connect', () => {
        let dataUser = new Promise((res, rej) => {
            socket.on('list-user', data => {
                console.log(data);
                res(data)
            })
        })

        socket.on('add-friend', data => {
            if (window.location.pathname.includes('/')) {
                Swal.fire({
                    text: `${data[0].name} đã gửi lời mời kết bạn`,
                    showConfirmButton: false,
                    timer: 3000,
                    position: 'top-end'
                })
            }
        })

        socket.on('accept-friend', data => {
            if (window.location.pathname.includes('/')) {
                Swal.fire({
                    text: `${data[0].name} đã đồng ý kết bạn`,
                    showConfirmButton: false,
                    timer: 3000,
                    position: 'top-end'
                })
            }
        })

    })

    $('.btn-search-friend').click((e) => {
        e.preventDefault()
        const email = $('#emailFriend').val().trim()

        $.ajax({
            url: '/friend/search',
            type: 'POST',
            data: {
                email
            },
            dataType: 'JSON',
            success(res) {
                if (res.status) {
                    $('#result').html(`
            <center> <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt=""
                    style="height: 150px; width: 150px;"><br>
                <span class="mt-2">${res.data[0].name == null ? 'Chưa cập nhật' : res.data[0].name}</span> <br>
                <span id="signature">${res.data[0].signature == null ? 'Chưa cập nhật' : res.data[0].signature}</span> <br>
                ${(() => {
                            if (typeof res.data[0].status !== 'undefined') {
                                if (res.data[0].status == 'pending') {
                                    return res.data[0].order == 'after' ? `<button class="btn btn-primary btn-action-friend mt-3 btn-cancel-friend mt-3 shadow-none" data-email="${res.data[0].email}">Huỷ lời mời </button>`
                                        : `<button class="btn btn-primary btn-action-friend mt-3 btn-accept-friend shadow-none" data-email="${res.data[0].email}">Đồng ý</button> 
                                        <button class="btn btn-primary btn-action-friend btn-cancel-friend mt-3 shadow-none" data-email="${res.data[0].email}">Bỏ qua</button>`
                                }
                                return `<button class="btn btn-primary"> <i class="fa fa-user-check"> </i> Bạn bè </button>`
                            }
                            else {
                                return `<button class="btn btn-primary btn-action-friend btn-add-friend mt-3" data-email="${res.data[0].email}">Kết bạn </button>`
                            }
                        })()}
            </center>
            <table class="table mt-5 infor">
                <tbody>
                    <tr>
                        <td>Giới tính :</td>
                        <td class="text-dark">${res.data[0].sex == 'male' ? 'Nam' : 'Nữ'}</td>
                    </tr>
                    <tr>
                        <td>Ngày sinh :</td>
                        <td class="text-dark">${res.data[0].birthday == null ? 'Chưa cập nhật' : new Date(res.data[0].birthday).toLocaleString("en-GB").slice(0, 10)}</td>
                    </tr>
                </tbody>
            </table>` )
                    $('#emailFriend').hide()
                    $('.btn-search-friend').hide()
                    if (typeof res.data[0].status !== 'undefined') {
                        if (res.data[0].status !== 'pending') {
                            $('.btn-add-friend').attr('disabled', true)
                                .addClass(`btn-light border border-dark`)
                                .removeClass('btn-primary').css('color', 'black')
                        }
                        $('.btn-cancel-friend')
                            .addClass(`btn-light`)
                            .removeClass('btn-primary')
                            .css('color', 'black')
                    }

                }
                else if (res.status == false) {
                    $('#result').html(`<center style="font-size:14px" class="mt-3">${res.msg}</center>`)
                }
                else {
                    $('#result').html(`<center style="font-size:14px" class="mt-3">${res[0].msg}</center>`)
                }
            },
            error(err) {
                $('#result').html(err)
            }
        })
    })

    $('button[data-dismiss="modal"]').click((e) => {
        e.preventDefault()
        $('#emailFriend').show()
        $('.btn-search-friend').show()
        $('input').not('#group-code').val('')
        $('#result').html('')
    })

    $(document).on('click', '.btn-add-friend', (e) => {
        e.preventDefault()
        const email = $(e.target).attr('data-email')
        const sender = $('#sessionUserEmail').val()
        $.ajax({
            url: '/friend/add',
            type: 'POST',
            data: {
                email
            },
            dataType: 'JSON',
            success(res) {
                console.log(res)
                if (res.status) {
                    Swal.fire({
                        text: `${res.msg}`,
                        showConfirmButton: false,
                        timer: 3000
                    })

                    // dataUser.then(data => {
                    //     data.forEach(user => {
                    //         if (user.email == email) {
                    //             user.sender = sender
                    socket.emit('add-friend', email)
                    //     }
                    // })
                    // })

                    $('button[data-dismiss="modal"]').click()
                }
                else {
                    $('#result').html(`<center style="font-size:14px" class="mt-3">${res.msg}</center>`)
                }
            },
            error(err) {
                $('#result').html(err)
            }
        })
    })

    $('.change-infor').click((e) => {
        e.preventDefault()

        $.ajax({
            url: '/user/getinfor',
            type: 'POST',
            data: {

            },
            dataType: 'JSON',
            success(res) {
                console.log(res)
                if (res.status) {
                    $('#modalChangeInfo #name').val(res.data[0].name)
                    $('#modalChangeInfo #email').val(res.data[0].email)
                    $('#modalChangeInfo #birthday').val(new Date(res.data[0].birthday).toISOString().slice(0, 10))
                    $('#modalChangeInfo #signature').val(res.data[0].signature)
                    $(`#modalChangeInfo input[name="sex"][value="${res.data[0].sex}"]`).attr('checked', 'checked')
                }
            }
        })
    })

    function getMsgErr(data) {
        arrError = {}
        for (let index = 0; index < data.length; index++) {
            if (data[index].param == 'name') {
                arrError['errName'] = data[index].msg
            }
            if (data[index].param == 'signature') {
                arrError['errSignature'] = data[index].msg
            }
            if (data[index].param == 'birthday') {
                arrError['errBirthday'] = data[index].msg
            }
        }
        return arrError
    }

    $('.btn-update-infor').click((e) => {
        const name = $('#name').val().trim()
        const birthday = $('#birthday').val().trim()
        const signature = $('#signature').val().trim()
        const sex = $('input[name="sex"]:checked').val()

        $.ajax({
            url: '/user/changeinfor',
            type: 'POST',
            data: {
                name,
                birthday,
                signature,
                sex
            },
            dataType: 'JSON',
            success(res) {
                if (res.status) {
                    Swal.fire({
                        text: 'Cập nhật thông tin thành công',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    $('button[data-dismiss="modal"]').click()
                }
                else {
                    $('#errorName').html(getMsgErr(res).errName)
                    $('#errorSignature').html(getMsgErr(res).errSignature)
                    $('#errorBirthday').html(getMsgErr(res).errBirthday)
                }
            }
        })
    })

    var countFriendRequest = parseInt($('#count-friend-request').text().trim())

    $(document).on('click', '.btn-accept-friend', (e) => {
        e.preventDefault()
        const sender = $('#sessionUserEmail').val()
        const email = $(e.target).data('email')
        const name = $(e.target).data('name')
        const countFriend = parseInt($('#count-friend').text().trim())
        $.ajax({
            url: '/friend/accept',
            type: 'POST',
            data: {
                email
            },
            success: (res) => {
                if (res.status) {
                    Swal.fire({
                        text: `${res.msg}`,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    socket.emit('accept-friend', 1)

                    dataUser2.then(data => {
                        data.forEach(user => {
                            if (user.email == email) {
                                user.sender = sender
                                socket.emit('accept-friend', user)
                            }
                        })
                    })

                    $(e.target).closest('.card').remove()
                    $('#count-friend-request').html(countFriendRequest - 1)
                    $('#count-friend').html(countFriend + 1)

                    $('#list-friend').prepend(`
                    <div class="row mt-2" style="height: 60px;">
                        <div class="col-md-3" style="line-height: 60px;">
                            <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                                class="w-100" style="max-width: 60px;">
                        </div>
                        <div class="col-md-9">
                            <p style="line-height: 60px;font-size: 15px;">
                                ${name}
                            </p>
                        </div>
                    </div>
                    `)
                }
            }
        })
    })

    $(document).on('click', '.btn-cancel-friend', (e) => {
        e.preventDefault()
        const email = $(e.target).data('email')

        $.ajax({
            url: '/friend/cancel',
            type: 'POST',
            data: {
                email
            },
            success: (res) => {
                if (res.status) {
                    Swal.fire({
                        text: `${res.msg}`,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    $(e.target).closest('.card').remove()
                    $('#count-friend-request').html(countFriendRequest - 1)
                }
            }
        })
    })

    $('.createRoom').click((e) => {
        $.ajax({
            url: 'friend/get',
            type: 'POST',
            data: {

            },
            success(res) {
                console.log(res);
                if (res.status) {
                    let data = res.data
                    let newArr = ''
                    data.forEach(user => {
                        newArr += `<input type="checkbox" style="border-radius:10px" name="friend" value="${user.email}"> <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt=""
                        style="height: 30px; width: 30px;"> <span style="font-size:14px">${user.name}</span><br>`
                    })
                    $('#createRoom #list-friend').html(newArr)
                }
            }
        })
    })

    var arrFriendRoom = []

    $(document).on('click', '#createRoom input[name="friend"]', (e) => {
        const email = $(e.target).val()
        if ($(e.target).is(':checked')) {
            arrFriendRoom.push(email)
        }
        else {
            arrFriendRoom.splice(arrFriendRoom.indexOf(email), 1)
        }
    })

    $('.btn-create-group').click((e) => {
        e.preventDefault()
        const name = $('#createRoom #name-group').val().trim()

        $.ajax({
            url: '/group/create',
            type: 'POST',
            data: {
                name,
                listMember: arrFriendRoom
            },
            success(res) {
                if (res.status) {
                    Swal.fire({
                        text: `${res.msg}`,
                        showConfirmButton: false,
                        timer: 3000
                    })
                    $('#createRoom').modal('hide')
                    $('#createRoom #name-group').val('')
                    $('#createRoom #list-friend').html('')
                    arrFriendRoom = []
                }
                else {
                    $('#createRoom #errorName').html(res[0].msg || '')
                }
            }
        })
    })

    $('#show-list-group').click((e) => {
        $('#list-group').addClass('d-block').removeClass('d-none')
        $('#list-friend-request').addClass('d-none').removeClass('d-block')
    })
    $('#show-list-friend-request').click((e) => {
        $('#list-friend-request').addClass('d-block').removeClass('d-none')
        $('#list-group').addClass('d-none').removeClass('d-block')
    })
})



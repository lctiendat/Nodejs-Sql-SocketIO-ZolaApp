$(document).ready(() => {


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
                console.log(res)
                if (res.status) {

                    $('#result').html(`
            <center> <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt=""
                    style="height: 150px; width: 150px;"><br>
                <span class="mt-2">${res.data[0].name == null ? 'Chưa cập nhật' : res.data[0].name}</span> <br>
                <span id="signature">${res.data[0].email}</span> <br>
                <button class="btn btn-primary btn-action-friend btn-add-friend mt-3" data-email="${res.data[0].email}">${(() => {
                            if (typeof res.data[0].status !== 'undefined') {
                                if (res.data[0].status == 'pending') {
                                    return res.data[0].order == 'after' ? '<i class="fa fa-user-plus"> </i> Đã gửi lời mời' : 'Xác nhận lời mời <i class="fa fa-check"> </i>'
                                }
                                return ` <i class="fa fa-user-check"> </i> Bạn bè`
                            }
                            else {
                                return 'Kết bạn'
                            }
                        })()}</button>
            </center>
            <table class="table mt-5 infor">
                <tbody>
                    <tr>
                        <td>Giới tính :</td>
                        <td class="text-dark">${res.data[0].sex == 'male' ? 'Nam' : 'Nữ'}</td>
                    </tr>
                    <tr>
                        <td>Ngày sinh :</td>
                        <td class="text-dark">${res.data[0].birthday == null ? 'Chưa cập nhật' : new Date(res.data[0].birthday).toISOString().slice(0, 10)}</td>
                    </tr>
                </tbody>
            </table>`)
                    $('#emailFriend').hide()
                    $('.btn-search-friend').hide()
                    if (typeof res.data[0].status !== 'undefined') {
                        if (res.data[0].status !== 'pending') {
                            $('.btn-add-friend').attr('disabled', true)
                                .addClass(`btn-light border border-dark`)
                                .removeClass('btn-primary').css('color', 'black')
                        }
                        $('.btn-add-friend')
                            .addClass(`btn-light border border-dark ${res.data[0].order == 'after' ? 'cancel-add-friend' : 'accept-friend'}`)
                            .removeClass('btn-primary btn-add-friend')
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
                $('#result').html(res.msg)
            }
        })
    })

    $('button[data-dismiss="modal"]').click((e) => {
        e.preventDefault()
        $('#emailFriend').show()
        $('.btn-search-friend').show()
        $('input').val('')
        $('#result').html('')
    })

    $(document).on('click', '.btn-add-friend', (e) => {
        e.preventDefault()
        const email = $(e.target).attr('data-email')
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
})
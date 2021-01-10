$(function() {

    //点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    //登录/注册表单校验
    //从layui中获取form对象
    var form = layui.form
        // 通过form.verify()函数来自定义校验规则
    form.verify({
        //自定义了一个pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value, item) {

            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于判断
            // 如果判断失败
            // 则return一个提示消息             
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    /* // -------------------------------------------- layui监听注册表单的注册提交事件

    form.on('submit(btnReg)', function(data) {

        $.post('/api/reguser', data.field, function(res) {
            if (res.status !== 0) {
                console.log(res.message);

            }
            console.log('注册成功！');
        })
        return false

    })

    // -------------------------------------------- layui监听注册表单的登录提交事件

    form.on('submit(btnlogin)', function(data) {

        $.post('/api/login', data.field, function(res) {
            if (res.status !== 0) {
                console.log(res.message);

            }
            console.log('登录成功！');
        })
        return false

    })

    // */

    var layer = layui.layer

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止默认行为
        e.preventDefault()
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }

        // post请求
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')

            //模拟点击“去登录”
            $('#link_login').click()
        })

    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')

                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    // console.log(res.token);

                //跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})
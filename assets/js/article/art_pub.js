$(function() {
    var form = layui.form
    var layer = layui.layer

    // 获取分类列表，渲染类别下拉框
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                console.log(res);
                // 使用模板引擎渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }

        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)


    //     3. 更换裁剪的图片
    // 1. 拿到用户选择的文件
    $('#btnChooseImage').on('click', function(e) {
            $('#coverFile').click()
        })
        // 监听coverFile的change事件
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择文件！')
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        console.log(newImgURL);

        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 发布文章
    var art_state = '已发布' //发布状态，可选值为：已发布/草稿
        // 点击存为草稿
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 发布文章
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 基于form表单，快速创建formData对象
        var fd = new FormData($(this)[0])
        console.log(fd);
        fd.append('state', art_state)
            //  4. 将裁剪后的图片， 输出为文件
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            //5.将文件对象，存储到fd中
            fd.append('cover_img', blob)
            fd.forEach(function(v, k) {
                    console.log(k, v);
                })
                // 6.发起ajax请求
            publishArticle(fd)

        })

        // 定义发布文章方法
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 如果向服务器提交FormData格式数据，必须添加配置项
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    location.href = './art_list.html'
                }
            })
        }
    })

})
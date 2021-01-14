$(function() {
    var layer = layui.layer
    var form = layui.form

    // 获取文章分类的列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加类别
    var indexAdd = null //open函数返回值
    $('#btnAddCate').on('click', function(e) {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    //通过代理的形式，为#form-add表单添加submit事件
    // 因为#form-add是动态添加的，所以不能直接通过id获取表单并添加事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
            // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                    //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理事件，给btn-edit按钮绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        console.log('ok');
        //弹窗修改分类信息
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        //把点击所在行的数据填到弹出层
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理形式，给“修改分类”表单绑定提交事件
    // 步骤：1.监听事件2.提交表单数据给服务器3.更新显示4.关闭弹出层
    $('tbody').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！ ')
                layer.close(indexEdit)
                initArtCateList()
            }
        })

    })

    //删除分类数据
    // 步骤：1.监听点击事件（代理形式，获取id） 2.弹出确定删除 3.监听确定删除 4.删除服务器数据 5.关闭确定删除弹窗 6.更新显示
    //1.通过代理事件，给btn-delete按钮绑定事件
    var indexDelete = null
    $('tbody').on('click', '.btn-delete', function(e) {
        var id = $(this).attr('data-id')

        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类信息失败！')
                    }
                    layer.msg('删除分类信息成功！ ')
                    layer.close(index)
                    initArtCateList()
                }
            })

        });
    })

})
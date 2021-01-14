$(function() {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage

    // 定义查询的参数对象
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 渲染列表
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染列表
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 渲染分页
                    // console.log(res.total);
                renderPage(res.total)
            }
        })
    }

    // 初始化筛选区域的文章分类下拉框
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通知layui，重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表绑定submit事件
    $('#form-search').on('submit', function() {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 赋值到查询参数q
        q.cate_id = cate_id
        q.state = state
            // 重新渲染列表
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到  
            limit: q.pagesize,
            curr: q.pagenum, //页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 4, 8],
            // 让分页关联表格
            // 步骤：1.拿到分页值 2.渲染表格
            // 分页发生切换的时候，触发jump回调，
            // 触发jump回调的方式有2种:
            // （1）点击页码的时候，此时first的值为undefined
            // （2）调用laypage.render，first的值为initTable
            jump: function(obj, first) {
                // console.log(first)
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                //根据最新的q获取对应的数据列表，并渲染表格
                // initTable()

                if (!first) { //方式1触发
                    initTable()
                }

            }
        });
    }

    // 通过代理形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {

        // 获取删除按钮个数
        var len = $('.btn-delete').length
        console.log(len);
        // 获取文章的id
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        // 此时页码值pagenum保持不变,删除后需要判断当前页码是否还有数据，如果没有，要让页码值-1，但最小为1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    initTable() //重新加载表格
                }
            })
            layer.close(index);
        });
    })


    // 通过代理形式，为编辑按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-edit', function() {
        // 获取文章的id
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res.data.title);//标题
                //根据id获取文章详情成功  跳转到发布页面              
                location.href = './art_pub.html'
                //把标题写入input标题框
                

            }
        })
    })


})
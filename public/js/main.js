function signin() {
    window.location.assign("signin.html");
}

var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "students": "studentList",
        "students/page/:page": "studentList",
        "students/name/:name": "studentListByName",
        "students/name/:name/page/:page": "studentListByName",
        "students/cpf/:cpf": "studentListByCPF",
        "students/cpf/:cpf/page/:page": "studentListByCPF",
        "students/registration/:registration": "studentListByRegistration",
        "students/registration/:registration/page/:page": "studentListByRegistration",
        "students/add": "addStudent",
        "students/:id": "studentDetails",
        "managers": "managerList",
        "managers/page/:page": "managerList",
        "managers/name/:name": "managerListByName",
        "managers/name/:name/page/:page": "managerListByName",
        "managers/cpf/:cpf": "managerListByCPF",
        "managers/cpf/:cpf/page/:page": "managerListByCPF",
        "managers/registration/:registration": "managerListByRegistration",
        "managers/registration/:registration/page/:page": "managerListByRegistration",
        "managers/add": "addManager",
        "managers/:id": "managerDetails"
    },

    initialize: function () {

        var logged = new LoggedTest();
        logged.fetch({
            success: function (data) {
                this.headerView = new HeaderView();
                $('.header').html(this.headerView.el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
    },

    home: function (id) {
        var logged = new LoggedTest();
        logged.fetch({
            success: function (data) {
                this.homeView = new HomeView();

                $('#content').html(this.homeView.el);
                selectMenuItem('home-menu');
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
    },

    studentList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var studentList = new StudentCollection();

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('students-menu');
    },

    studentListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByNameCollection({ name: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByCPFCollection({ cpf: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByRegistrationCollection({ registration: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentDetails: function (id) {
        var student = new Student({ _id: id });
        student.fetch({
            success: function () {
                $("#content").html(new StudentView({ model: student }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addStudent: function () {
        
        var student = new Student();
        $('#content').html(new StudentView({ model: student }).el);
        selectMenuItem('students-menu');

    },


    managerList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var managerList = new ManagerCollection();

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('managers-menu');
    },

    managerListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByNameCollection({ name: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByCPFCollection({ cpf: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByRegistrationCollection({ registration: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerDetails: function (id) {
        var manager = new Manager({ _id: id });
        manager.fetch({
            success: function () {
                $("#content").html(new ManagerView({ model: manager }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addManager: function () {

        var manager = new Manager();
        $('#content').html(new ManagerView({ model: manager }).el);
        selectMenuItem('managers-menu');

    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'StudentsView', 'StudentView', 'ManagersView', 'ManagerView', 'BaseModalView'], function () {
    app = new AppRouter();
    Backbone.history.start();
});

function selectMenuItem(menuItem) {
    if (menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }
}
﻿window.StudentView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        
        var student = this.model.toJSON();

        $(this.el).html(this.template(student));

        var html = '';

        html += '<article style="float: left; width: 35%">';
        html += '<div class="control-group">';
        html += '<label for="grapes" class="control-label">State:</label>';

        html += '<div class="controls">';
        html += '<select class="form-control" id="selstate" name="state" value="' + student.state + '" >';


        html += fillStates(_statesandcity, student.state);

        html += '</select>';

        html += '<span class="help-inline"></span>';
        html += '</div>';
        html += '</div>';
        html += '</article>';
        html += '<article style="float: right; width: 62%">';
        html += '<div class="control-group">';
        html += '<label for="grapes" class="control-label">City:</label>';

        html += '<div class="controls">';
        html += '<select class="form-control" id="selcity" name="city" value="' + student.city + '">';


        html += fillCity(_statesandcity, student.state, student.city);

        html += '</select>';
        html += '<span class="help-inline"></span>';
        html += '</div>';
        html += '</div>';
        html += '</article>';

        $('#divStatesAndCity', this.el).append(html);
        
        $('#selstate', this.el).change(function () {
            $('#selcity', this.el).html(fillCity(_statesandcity, $('#selstate option:selected', this.el).val(), ''));

        });

        return this;
    },

    events: {
        "change": "change",
        "click .save": "beforeSave",
        "click .delete": "deleteStudent",
        "drop #picture": "dropHandler"
    },

    change: function (event) {

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};

        if (target.name == 'active') {
            target.value = ($('#active', this.el).attr('checked') == 'checked');
        }

        change[target.name] = target.value;

        this.model.set(change);


        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveStudent();
        return false;
    },

    saveStudent: function () {
        var self = this;
        var mensagem = '';
        if (this.model.id == null)
            mensagem = 'Student inserted successfully';
        else
            mensagem = 'Student updated successfully';
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('students/' + model.id, false);
                utils.showAlert('Success!', mensagem, 'alert-success');
            },
            error: function (err, message) {
                utils.showAlert('Error', $.parseJSON(message.responseText).error, 'alert-error');
            }

        });
    },

    deleteStudent: function () {
        this.model.destroy({
            success: function (model) {
                $("#delUser", this.el).hide(function () {
                    app.navigate('#students', true);
                    self.render();
                });
            },
            error: function (err, message) {
                $("#delUser", this.el).hide(function () {
                    utils.showAlert('Error', $.parseJSON(message.responseText).error, 'alert-error');
                });
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }

});



function fillStates(data, userState) {

    var items = [];
    var options = '';

    $.each(data, function (key, val) {

        if (userState != val.state) {
            options += '<option value="' + val.state + '">' + val.state + '</option>';
        }
        else {
            options += '<option value="' + val.state + '" selected>' + val.state + '</option>';
        }
    });

    return options;
};


function fillCity(data, userState, userCity) {
    var items = [];
    var options = '';

    $.each(data, function (key, val) {
        if (val.state == userState) {
            $.each(val.city, function (key_city, val_city) {
                if (userCity != val_city) {
                    options += '<option value="' + val_city + '">' + val_city + '</option>';
                }
                else {
                    options += '<option value="' + val_city + '" selected>' + val_city + '</option>';
                }
            });
        }
    });

    return options;
};